// ---- CANCELAR ASSINATURA (com segurança) ----
// Quando a pessoa clica "cancelar assinatura" dentro do app, o navegador chama aqui.
// Passos deste porteiro:
//   1) CONFERE quem é a pessoa, de verdade, pelo token do Supabase (pra ninguém cancelar a de outro)
//   2) descobre o "cliente Stripe" DELA na tabela subscriptions — a busca é sempre
//      pelo id vindo do token, nunca por um id que o navegador tenha mandado
//   3) pede pro Stripe cancelar AO FIM DO PERÍODO (ela mantém acesso até o fim do que já pagou / do teste)
//
// Segredos (só no cofre do Netlify, nunca no navegador/GitHub/chat):
//   STRIPE_SECRET_KEY      -> chave secreta do Stripe
//   SUPABASE_URL           -> endereço do projeto Supabase
//   SUPABASE_SERVICE_ROLE  -> chave-mestra do Supabase (só o servidor tem)

const { verifyUser } = require("./lib/verify-user");
const { checkLimits } = require("./lib/rate-limit");

const MAX_BODY = 8 * 1024;

const json = (statusCode, obj) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!stripeKey || !supaUrl || !supaKey) {
    return json(500, { error: "Server not configured" });
  }

  const raw = event.body || "{}";
  if (raw.length > MAX_BODY) return json(413, { error: "body too large" });

  let body;
  try { body = JSON.parse(raw); } catch (e) { return json(400, { error: "bad json" }); }
  if (!body || typeof body !== "object") return json(400, { error: "bad json" });

  // 1) CONFERE a identidade pelo token (mesmo conferente das outras funções)
  const auth = await verifyUser(body.accessToken);
  if (!auth.ok) {
    return json(auth.code, { error: auth.error });
  }
  const userId = auth.userId;

  // Freio: cancelar é uma ação de conta; ninguém precisa fazer isso 50x por minuto.
  const limited = await checkLimits(userId, {
    bucket: "cancel",
    burstCapacity: 3,
    burstRefillPerSec: 0.05,
    dailyLimit: 20,
  });
  if (limited) return limited;

  try {
    // 2) Acha o cliente Stripe DESSA pessoa (id vindo do token conferido acima)
    const rowRes = await fetch(
      supaUrl + "/rest/v1/subscriptions?user_id=eq." + encodeURIComponent(userId) + "&select=stripe_customer_id",
      { headers: { "apikey": supaKey, "Authorization": "Bearer " + supaKey } }
    );
    const rows = rowRes.ok ? await rowRes.json() : [];
    const customerId = rows && rows[0] && rows[0].stripe_customer_id;

    // Sem cliente Stripe = acesso de cortesia ou nunca assinou. Nada pra cancelar no Stripe.
    if (!customerId) {
      return json(200, { ok: true, nothing: true });
    }

    // 3) Lista as assinaturas desse cliente no Stripe
    const listRes = await fetch(
      "https://api.stripe.com/v1/subscriptions?customer=" + encodeURIComponent(customerId) + "&status=all&limit=10",
      { headers: { "Authorization": "Bearer " + stripeKey, "Stripe-Version": "2024-06-20" } }
    );
    const list = await listRes.json();
    const subs = (list && list.data) ? list.data : [];

    let periodEnd = null;
    let canceledAny = false;

    // Marca cada assinatura viva (ativa ou em teste) pra terminar no fim do período
    for (const s of subs) {
      const alive = (s.status === "active" || s.status === "trialing");
      if (alive && !s.cancel_at_period_end) {
        const params = new URLSearchParams();
        params.append("cancel_at_period_end", "true");
        const upd = await fetch("https://api.stripe.com/v1/subscriptions/" + encodeURIComponent(s.id), {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + stripeKey,
            "Content-Type": "application/x-www-form-urlencoded",
            "Stripe-Version": "2024-06-20",
          },
          body: params.toString(),
        });
        if (upd.ok) {
          canceledAny = true;
          if (s.current_period_end) periodEnd = s.current_period_end; // segundos (epoch)
        }
      } else if (alive && s.cancel_at_period_end) {
        // já estava marcada pra cancelar — trata como sucesso e devolve a data
        canceledAny = true;
        if (s.current_period_end) periodEnd = s.current_period_end;
      }
    }

    if (!canceledAny) {
      // Nenhuma assinatura viva encontrada (talvez já cancelada)
      return json(200, { ok: true, nothing: true });
    }

    return json(200, { ok: true, periodEnd: periodEnd });
  } catch (e) {
    console.error("cancel-subscription failed:", e);
    return json(502, { error: "Request failed" });
  }
};
