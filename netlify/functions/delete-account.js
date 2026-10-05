const { verifyUser } = require("./lib/verify-user");
const { checkLimits } = require("./lib/rate-limit");

const MAX_BODY = 8 * 1024;

const json = (statusCode, obj) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});

async function supaDelete(url, key, table, userId) {
  const res = await fetch(
    url + "/rest/v1/" + table + "?user_id=eq." + encodeURIComponent(userId),
    {
      method: "DELETE",
      headers: {
        "apikey": key,
        "Authorization": "Bearer " + key,
        "Prefer": "return=minimal",
      },
    }
  );
  if (!res.ok && res.status !== 404 && res.status !== 406) {
    throw new Error("delete " + table + " " + res.status);
  }
}

async function cancelStripeSubscriptions(stripeKey, customerId) {
  if (!customerId) return;
  const listRes = await fetch(
    "https://api.stripe.com/v1/subscriptions?customer=" + encodeURIComponent(customerId) + "&status=all&limit=10",
    { headers: { "Authorization": "Bearer " + stripeKey, "Stripe-Version": "2024-06-20" } }
  );
  if (!listRes.ok) throw new Error("stripe list " + listRes.status);
  const list = await listRes.json();
  const subs = (list && list.data) ? list.data : [];
  const skip = { canceled: 1, incomplete_expired: 1 };
  for (const s of subs) {
    if (skip[s.status]) continue;
    const delRes = await fetch(
      "https://api.stripe.com/v1/subscriptions/" + encodeURIComponent(s.id),
      {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + stripeKey,
          "Stripe-Version": "2024-06-20",
        },
      }
    );
    if (!delRes.ok) throw new Error("stripe cancel " + s.id + " " + delRes.status);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!stripeKey || !supaUrl || !supaKey) return json(500, { error: "Server not configured" });

  const raw = event.body || "{}";
  if (raw.length > MAX_BODY) return json(413, { error: "body too large" });

  let body;
  try { body = JSON.parse(raw); } catch (e) { return json(400, { error: "bad json" }); }
  if (!body || typeof body !== "object") return json(400, { error: "bad json" });

  const auth = await verifyUser(body.accessToken);
  if (!auth.ok) return json(auth.code, { error: auth.error });
  const userId = auth.userId;

  const limited = await checkLimits(userId, {
    bucket: "delete-account",
    burstCapacity: 2,
    burstRefillPerSec: 0.01,
    dailyLimit: 5,
  });
  if (limited) return limited;

  try {
    const rowRes = await fetch(
      supaUrl + "/rest/v1/subscriptions?user_id=eq." + encodeURIComponent(userId) + "&select=stripe_customer_id",
      { headers: { "apikey": supaKey, "Authorization": "Bearer " + supaKey } }
    );
    const rows = rowRes.ok ? await rowRes.json() : [];
    const customerId = rows && rows[0] && rows[0].stripe_customer_id;

    await cancelStripeSubscriptions(stripeKey, customerId);

    await supaDelete(supaUrl, supaKey, "expenses", userId);
    await supaDelete(supaUrl, supaKey, "settings", userId);
    await supaDelete(supaUrl, supaKey, "subscriptions", userId);
    await supaDelete(supaUrl, supaKey, "email_log", userId);

    const delRes = await fetch(
      supaUrl + "/auth/v1/admin/users/" + encodeURIComponent(userId),
      {
        method: "DELETE",
        headers: {
          "apikey": supaKey,
          "Authorization": "Bearer " + supaKey,
        },
      }
    );
    if (!delRes.ok) {
      return json(502, { error: "Request failed" });
    }

    return json(200, { ok: true });
  } catch (e) {
    console.error("delete-account failed:", e.message || e);
    return json(502, { error: "Request failed" });
  }
};

exports._cancelStripeSubscriptions = cancelStripeSubscriptions;
exports._supaDelete = supaDelete;
