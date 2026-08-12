// ---- O ESCUTADOR DO STRIPE (webhook) ----
// O Stripe "liga" pra cá quando alguém paga. Este porteiro:
//   1) confere a assinatura secreta (pra ter CERTEZA que é o Stripe, e não um impostor)
//   2) confere que o aviso é RECENTE (não é um aviso velho sendo reenviado)
//   3) confere que o aviso não é mais VELHO que o último que já processamos
//   4) descobre quem é a pessoa (pelo id que a gente carimbou no pagamento)
//   5) escreve na tabela `subscriptions` do Supabase usando a chave-mestra (service_role)
//
// Segredos usados (todos moram só no cofre do Netlify, nunca no navegador/GitHub/chat):
//   STRIPE_WEBHOOK_SECRET  -> a senha que o Stripe usa pra assinar cada aviso
//   SUPABASE_URL           -> o endereço do seu projeto Supabase
//   SUPABASE_SERVICE_ROLE  -> a chave-mestra do Supabase (a única que pode escrever aqui)

const crypto = require("crypto");

const MAX_BODY = 1024 * 1024; // 1 MB: evento do Stripe nunca chega perto disso

// Confere a assinatura que o Stripe manda no cabeçalho "stripe-signature"
function verifyStripe(rawBody, sigHeader, secret) {
  if (!sigHeader || !secret) return false;
  let t = null;
  const v1List = [];
  sigHeader.split(",").forEach(part => {
    const i = part.indexOf("=");
    if (i === -1) return;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k === "t") t = v;
    // Durante a troca de segredo, o Stripe manda mais de uma assinatura v1.
    // Basta UMA bater — mas todas são comparadas em tempo constante.
    if (k === "v1") v1List.push(v);
  });
  if (!t || !v1List.length) return false;
  // O aviso tem que ser RECENTE (até 5 min): impede alguém de reenviar um aviso
  // antigo capturado (replay). O Stripe recomenda exatamente essa tolerância.
  const ageSec = Math.abs(Date.now() / 1000 - Number(t));
  if (!isFinite(ageSec) || ageSec > 300) return false;
  const signedPayload = t + "." + rawBody;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");
  const expBuf = Buffer.from(expected, "utf8");
  return v1List.some(v1 => {
    try {
      const gotBuf = Buffer.from(v1, "utf8");
      if (gotBuf.length !== expBuf.length) return false;
      return crypto.timingSafeEqual(expBuf, gotBuf);
    } catch (e) { return false; }
  });
}

// ---- Descobre a data em que o período acaba ----
// O Stripe MUDOU onde guarda isso. Até a API 2024 o campo ficava na raiz da
// assinatura; a partir da 2025 ele mudou pra dentro de cada item
// (items.data[0].current_period_end). E a versão que chega aqui é a configurada
// no PAINEL do Stripe pro webhook — não a que a gente pede nas outras chamadas.
// Por isso olhamos nos dois lugares: assim funciona em qualquer versão.
function periodEndISO(obj) {
  const item = obj.items && obj.items.data && obj.items.data[0];
  const doItem = item && item.current_period_end;
  const daRaiz = obj.current_period_end;

  // Em teste grátis, o que interessa é quando o teste acaba.
  // (trial_end continua preenchido DEPOIS do teste acabar, com data no passado —
  //  por isso só usamos ele enquanto o status ainda for "trialing".)
  let seg = (obj.status === "trialing" && obj.trial_end)
    ? obj.trial_end
    : (doItem || daRaiz || obj.trial_end || null);

  seg = Number(seg);
  if (!seg || !isFinite(seg)) return null;
  return new Date(seg * 1000).toISOString();
}

const supaHeaders = () => ({
  "apikey": process.env.SUPABASE_SERVICE_ROLE,
  "Authorization": "Bearer " + process.env.SUPABASE_SERVICE_ROLE,
  "Content-Type": "application/json",
});

// Quando foi a última vez que gravamos algo pra esta pessoa?
// Serve pra NÃO deixar um aviso atrasado desfazer um mais novo — o Stripe não
// garante a ordem de entrega, então "cancelada" poderia ser sobrescrita por uma
// "ativa" que saiu antes mas chegou depois.
async function lastWriteAt(userId) {
  const url = process.env.SUPABASE_URL;
  try {
    const res = await fetch(
      url + "/rest/v1/subscriptions?user_id=eq." + encodeURIComponent(userId) + "&select=updated_at",
      { headers: supaHeaders() }
    );
    if (!res.ok) return 0;
    const rows = await res.json();
    const at = rows && rows[0] && rows[0].updated_at;
    const ms = at ? Date.parse(at) : NaN;
    return isFinite(ms) ? ms : 0;
  } catch (e) { return 0; }
}

// Escreve (ou atualiza) a linha da pessoa na tabela subscriptions, via a chave-mestra
async function upsertSub(userId, fields, eventAtMs) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) throw new Error("supabase env missing");

  // Campo vazio não entra: senão um aviso que não traz o customer_id apagaria
  // o customer_id que já estava salvo.
  const clean = {};
  Object.keys(fields).forEach(k => { if (fields[k] !== null && fields[k] !== undefined) clean[k] = fields[k]; });

  const row = Object.assign(
    { user_id: userId, updated_at: new Date(eventAtMs).toISOString() },
    clean
  );
  const gravar = async (payload) => {
    const res = await fetch(url + "/rest/v1/subscriptions", {
      method: "POST",
      headers: Object.assign(supaHeaders(), {
        // resolution=merge-duplicates faz o "upsert": cria se não existe, atualiza se já existe
        "Prefer": "resolution=merge-duplicates,return=minimal",
      }),
      body: JSON.stringify(payload),
    });
    return res.ok ? null : await res.text();
  };

  let erro = await gravar(row);
  if (!erro) return;

  // A coluna cancel_at_period_end é nova (o SQL está no README). Se o banco de
  // alguém ainda não tiver, grava sem ela em vez de perder o aviso do Stripe
  // inteiro — status e data de renovação são mais importantes que ela.
  if (/cancel_at_period_end/.test(erro) && "cancel_at_period_end" in row) {
    const semColuna = Object.assign({}, row);
    delete semColuna.cancel_at_period_end;
    erro = await gravar(semColuna);
    if (!erro) {
      console.warn("coluna cancel_at_period_end ausente — rode o SQL do README");
      return;
    }
  }
  throw new Error("supabase write failed: " + erro);
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "method" };
  }

  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

  // Precisamos do corpo CRU, exatamente como o Stripe mandou, pra conferir a assinatura
  let rawBody = event.body || "";
  if (rawBody.length > MAX_BODY) return { statusCode: 413, body: "too large" };
  if (event.isBase64Encoded) rawBody = Buffer.from(rawBody, "base64").toString("utf8");

  if (!verifyStripe(rawBody, sig, whSecret)) {
    return { statusCode: 400, body: "bad signature" };
  }

  let evt;
  try { evt = JSON.parse(rawBody); } catch (e) { return { statusCode: 400, body: "bad json" }; }

  const type = evt.type;
  const obj = (evt.data && evt.data.object) ? evt.data.object : {};
  // Hora do evento SEGUNDO O STRIPE (já validada pela assinatura: não dá pra forjar)
  const eventAtMs = isFinite(Number(evt.created)) ? Number(evt.created) * 1000 : Date.now();

  try {
    let userId = null;
    let fields = null;

    if (type === "checkout.session.completed") {
      // Só conta se foi mesmo uma ASSINATURA e o pagamento não ficou pendente.
      const isSub = obj.mode === "subscription";
      const paidOrTrial = obj.payment_status === "paid" || obj.payment_status === "no_payment_required";
      if (isSub && paidOrTrial) {
        userId = obj.client_reference_id || (obj.metadata && obj.metadata.user_id);
        fields = { status: "trialing", stripe_customer_id: obj.customer || null };
      }
    } else if (type === "customer.subscription.created" || type === "customer.subscription.updated") {
      // O status da assinatura mudou (trial -> ativo, ativo -> atrasado, etc.)
      userId = obj.metadata && obj.metadata.user_id;
      fields = {
        status: obj.status || "active",
        stripe_customer_id: obj.customer || null,
        current_period_end: periodEndISO(obj),
        // MARCADA PRA CANCELAR: o Stripe mantém status "active"/"trialing" até o
        // período acabar, então sem guardar isto o app não teria como saber que
        // a pessoa cancelou — e ela veria "assinatura ativa" depois de cancelar.
        cancel_at_period_end: obj.cancel_at_period_end === true,
      };
    } else if (type === "customer.subscription.deleted") {
      // Assinatura cancelada/terminada de vez (o período acabou)
      userId = obj.metadata && obj.metadata.user_id;
      fields = { status: "canceled", cancel_at_period_end: false };
    }
    // Outros tipos de evento a gente simplesmente ignora, respondendo OK.

    if (userId && fields) {
      // Aviso atrasado (mais velho que o último que já gravamos) é descartado.
      const last = await lastWriteAt(userId);
      if (eventAtMs >= last) {
        await upsertSub(userId, fields, eventAtMs);
      }
    }
  } catch (e) {
    // Se falhar, devolve erro pro Stripe tentar de novo depois.
    // O detalhe vai pro log do Netlify, não pra resposta.
    console.error("webhook handler failed:", e);
    return { statusCode: 500, body: "handler error" };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

// Exposto só pros testes de segurança (tests/security.test.js).
// O Netlify usa exclusivamente `exports.handler` acima.
exports._verifyStripe = verifyStripe;
