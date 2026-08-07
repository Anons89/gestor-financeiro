// ---- O ESCUTADOR DO STRIPE (webhook) ----
// O Stripe "liga" pra cá quando alguém paga. Este porteiro:
//   1) confere a assinatura secreta (pra ter CERTEZA que é o Stripe, e não um impostor)
//   2) descobre quem é a pessoa (pelo id que a gente carimbou no pagamento)
//   3) escreve na tabela `subscriptions` do Supabase usando a chave-mestra (service_role)
//
// Segredos usados (todos moram só no cofre do Netlify, nunca no navegador/GitHub/chat):
//   STRIPE_WEBHOOK_SECRET  -> a senha que o Stripe usa pra assinar cada aviso
//   SUPABASE_URL           -> o endereço do seu projeto Supabase
//   SUPABASE_SERVICE_ROLE  -> a chave-mestra do Supabase (a única que pode escrever aqui)

const crypto = require("crypto");

// Confere a assinatura que o Stripe manda no cabeçalho "stripe-signature"
function verifyStripe(rawBody, sigHeader, secret) {
  if (!sigHeader || !secret) return false;
  let t = null, v1 = null;
  sigHeader.split(",").forEach(part => {
    const i = part.indexOf("=");
    if (i === -1) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === "t") t = v;
    if (k === "v1") v1 = v;
  });
  if (!t || !v1) return false;
  // O aviso tem que ser RECENTE (até 5 min): impede alguém de reenviar um aviso
  // antigo capturado (replay). O Stripe recomenda exatamente essa tolerância.
  const ageSec = Math.abs(Date.now() / 1000 - Number(t));
  if (!isFinite(ageSec) || ageSec > 300) return false;
  const signedPayload = t + "." + rawBody;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch (e) { return false; }
}

// Escreve (ou atualiza) a linha da pessoa na tabela subscriptions, via a chave-mestra
async function upsertSub(userId, fields) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) throw new Error("supabase env missing");
  const row = Object.assign({ user_id: userId, updated_at: new Date().toISOString() }, fields);
  const res = await fetch(url + "/rest/v1/subscriptions", {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": "Bearer " + key,
      "Content-Type": "application/json",
      // resolution=merge-duplicates faz o "upsert": cria se não existe, atualiza se já existe
      "Prefer": "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("supabase write failed: " + txt);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "method" };
  }

  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

  // Precisamos do corpo CRU, exatamente como o Stripe mandou, pra conferir a assinatura
  let rawBody = event.body || "";
  if (event.isBase64Encoded) rawBody = Buffer.from(rawBody, "base64").toString("utf8");

  if (!verifyStripe(rawBody, sig, whSecret)) {
    return { statusCode: 400, body: "bad signature" };
  }

  let evt;
  try { evt = JSON.parse(rawBody); } catch (e) { return { statusCode: 400, body: "bad json" }; }

  const type = evt.type;
  const obj = (evt.data && evt.data.object) ? evt.data.object : {};

  try {
    if (type === "checkout.session.completed") {
      // Pessoa terminou o pagamento. Pegamos o id que carimbamos e marcamos como em teste grátis.
      const userId = obj.client_reference_id || (obj.metadata && obj.metadata.user_id);
      const customerId = obj.customer || null;
      if (userId) {
        await upsertSub(userId, { status: "trialing", stripe_customer_id: customerId });
      }
    } else if (type === "customer.subscription.created" || type === "customer.subscription.updated") {
      // O status da assinatura mudou (trial -> ativo, ativo -> atrasado, etc.)
      const userId = obj.metadata && obj.metadata.user_id;
      const status = obj.status || "active";
      const periodEnd = obj.current_period_end ? new Date(obj.current_period_end * 1000).toISOString() : null;
      const customerId = obj.customer || null;
      if (userId) {
        await upsertSub(userId, { status: status, stripe_customer_id: customerId, current_period_end: periodEnd });
      }
    } else if (type === "customer.subscription.deleted") {
      // Assinatura cancelada/terminada
      const userId = obj.metadata && obj.metadata.user_id;
      if (userId) {
        await upsertSub(userId, { status: "canceled" });
      }
    }
    // Outros tipos de evento a gente simplesmente ignora, respondendo OK.
  } catch (e) {
    // Se falhar, devolve erro pro Stripe tentar de novo depois
    return { statusCode: 500, body: "handler error" };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
