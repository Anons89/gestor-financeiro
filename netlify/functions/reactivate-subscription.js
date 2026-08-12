// ---- REATIVAR ASSINATURA (desfazer o cancelamento) ----
// A pessoa cancelou, se arrependeu, e ainda está dentro do período pago.
// Aqui NÃO se cria assinatura nova: isso geraria uma SEGUNDA cobrança no Stripe.
// O que se faz é desmarcar o cancelamento da assinatura que já existe.
//
// Passos:
//   1) CONFERE quem é a pessoa pelo token do Supabase (ninguém reativa a de outro)
//   2) acha o "cliente Stripe" DELA na tabela subscriptions
//   3) tira o cancel_at_period_end das assinaturas vivas dela
//   4) grava no banco na hora, pra tela mostrar a verdade sem esperar o webhook

const { verifyUser } = require("./lib/verify-user");
const { checkLimits } = require("./lib/rate-limit");

const MAX_BODY = 8 * 1024;

const json = (statusCode, obj) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});

// Mesma ideia do cancel: grava direto, com degradação se a coluna não existir
async function patchSubscription(userId, campos) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  const corpo = {};
  Object.keys(campos).forEach(k => { if (campos[k] !== undefined) corpo[k] = campos[k]; });

  const enviar = async (payload) => {
    const res = await fetch(
      url + "/rest/v1/subscriptions?user_id=eq." + encodeURIComponent(userId),
      {
        method: "PATCH",
        headers: {
          "apikey": key,
          "Authorization": "Bearer " + key,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify(payload),
      }
    );
    return res.ok ? null : await res.text();
  };

  try {
    let erro = await enviar(corpo);
    if (!erro) return;
    if (/cancel_at_period_end/.test(erro) && "cancel_at_period_end" in corpo) {
      const semColuna = Object.assign({}, corpo);
      delete semColuna.cancel_at_period_end;
      erro = await enviar(semColuna);
      if (!erro) { console.warn("coluna cancel_at_period_end ausente — rode o SQL do README"); return; }
    }
    console.error("não consegui desmarcar o cancelamento no banco:", erro);
  } catch (e) {
    console.error("não consegui desmarcar o cancelamento no banco:", e);
  }
}

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

  // 1) Quem é a pessoa vem do token, nunca do que o navegador diz
  const auth = await verifyUser(body.accessToken);
  if (!auth.ok) return json(auth.code, { error: auth.error });
  const userId = auth.userId;

  const limited = await checkLimits(userId, {
    bucket: "reactivate",
    burstCapacity: 3,
    burstRefillPerSec: 0.05,
    dailyLimit: 20,
  });
  if (limited) return limited;

  try {
    // 2) O cliente Stripe DESSA pessoa
    const rowRes = await fetch(
      supaUrl + "/rest/v1/subscriptions?user_id=eq." + encodeURIComponent(userId) + "&select=stripe_customer_id",
      { headers: { "apikey": supaKey, "Authorization": "Bearer " + supaKey } }
    );
    const rows = rowRes.ok ? await rowRes.json() : [];
    const customerId = rows && rows[0] && rows[0].stripe_customer_id;
    if (!customerId) return json(200, { ok: true, nothing: true });

    // 3) Desmarca o cancelamento das assinaturas ainda vivas
    const listRes = await fetch(
      "https://api.stripe.com/v1/subscriptions?customer=" + encodeURIComponent(customerId) + "&status=all&limit=10",
      { headers: { "Authorization": "Bearer " + stripeKey, "Stripe-Version": "2024-06-20" } }
    );
    const list = await listRes.json();
    const subs = (list && list.data) ? list.data : [];

    let periodEnd = null;
    let reativou = false;

    for (const s of subs) {
      const viva = (s.status === "active" || s.status === "trialing");
      if (!viva) continue;
      if (s.cancel_at_period_end) {
        const params = new URLSearchParams();
        params.append("cancel_at_period_end", "false");
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
          reativou = true;
          const nova = await upd.json();
          const item = nova.items && nova.items.data && nova.items.data[0];
          periodEnd = (item && item.current_period_end) || nova.current_period_end || s.current_period_end || null;
        }
      } else {
        // já estava valendo normalmente — trata como sucesso
        reativou = true;
        const item = s.items && s.items.data && s.items.data[0];
        periodEnd = (item && item.current_period_end) || s.current_period_end || null;
      }
    }

    if (!reativou) return json(200, { ok: true, nothing: true });

    // 4) Grava na hora, sem depender do aviso do Stripe chegar
    await patchSubscription(userId, {
      cancel_at_period_end: false,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : undefined,
      updated_at: new Date().toISOString(),
    });

    return json(200, { ok: true, periodEnd: periodEnd });
  } catch (e) {
    console.error("reactivate-subscription failed:", e);
    return json(502, { error: "Request failed" });
  }
};
