// ---- TESTES DE SEGURANÇA ----
// Rodar com:  node --test tests/
// Não precisa instalar nada: usa o test runner que já vem no Node (18+).
//
// O que estes testes protegem (se algum falhar, uma porta ficou aberta):
//   1) o webhook do Stripe só aceita avisos assinados, recentes e intactos
//   2) o freio de uso realmente trava quem chama demais
//   3) as funções de IA recusam quem não está logado / não é assinante
//   4) nada do que a IA devolve entra no app sem ser conferido

const test = require("node:test");
const assert = require("node:assert");
const crypto = require("node:crypto");

const webhook = require("../netlify/functions/stripe-webhook.js");
const rateLimit = require("../netlify/functions/lib/rate-limit.js");

const verifyStripe = webhook._verifyStripe;

// Monta um cabeçalho stripe-signature de verdade, como o Stripe monta
function signStripe(body, secret, tSeconds) {
  const t = String(tSeconds != null ? tSeconds : Math.floor(Date.now() / 1000));
  const v1 = crypto.createHmac("sha256", secret).update(t + "." + body, "utf8").digest("hex");
  return { header: "t=" + t + ",v1=" + v1, t: t, v1: v1 };
}

// ============================================================
// 1) WEBHOOK DO STRIPE — assinatura, adulteração e replay
// ============================================================

test("webhook: aceita um aviso legítimo e recém-assinado", () => {
  const body = JSON.stringify({ type: "checkout.session.completed" });
  const sig = signStripe(body, "whsec_teste");
  assert.strictEqual(verifyStripe(body, sig.header, "whsec_teste"), true);
});

test("webhook: RECUSA corpo adulterado (assinatura não bate mais)", () => {
  const body = JSON.stringify({ type: "checkout.session.completed" });
  const sig = signStripe(body, "whsec_teste");
  const adulterado = JSON.stringify({ type: "checkout.session.completed", hacked: true });
  assert.strictEqual(verifyStripe(adulterado, sig.header, "whsec_teste"), false);
});

test("webhook: RECUSA aviso assinado com outro segredo (impostor)", () => {
  const body = JSON.stringify({ type: "customer.subscription.updated" });
  const sig = signStripe(body, "whsec_do_atacante");
  assert.strictEqual(verifyStripe(body, sig.header, "whsec_teste"), false);
});

test("webhook: RECUSA aviso velho reenviado (replay de 10 minutos atrás)", () => {
  const body = JSON.stringify({ type: "customer.subscription.updated" });
  const dezMinAtras = Math.floor(Date.now() / 1000) - 600;
  const sig = signStripe(body, "whsec_teste", dezMinAtras);
  // A assinatura em si é válida — o que barra é a idade do aviso
  assert.strictEqual(verifyStripe(body, sig.header, "whsec_teste"), false);
});

test("webhook: aceita aviso de 4 minutos atrás (dentro da tolerância)", () => {
  const body = JSON.stringify({ type: "customer.subscription.updated" });
  const quatroMin = Math.floor(Date.now() / 1000) - 240;
  const sig = signStripe(body, "whsec_teste", quatroMin);
  assert.strictEqual(verifyStripe(body, sig.header, "whsec_teste"), true);
});

test("webhook: RECUSA cabeçalho sem assinatura, vazio ou malformado", () => {
  const body = "{}";
  assert.strictEqual(verifyStripe(body, "", "whsec_teste"), false);
  assert.strictEqual(verifyStripe(body, null, "whsec_teste"), false);
  assert.strictEqual(verifyStripe(body, "t=123", "whsec_teste"), false);       // sem v1
  assert.strictEqual(verifyStripe(body, "v1=abc", "whsec_teste"), false);      // sem t
  assert.strictEqual(verifyStripe(body, "lixo", "whsec_teste"), false);
});

test("webhook: RECUSA se o segredo do servidor não estiver configurado", () => {
  const body = "{}";
  const sig = signStripe(body, "whsec_teste");
  assert.strictEqual(verifyStripe(body, sig.header, ""), false);
  assert.strictEqual(verifyStripe(body, sig.header, undefined), false);
});

test("webhook: aceita quando UMA de várias assinaturas v1 bate (rodízio de segredo)", () => {
  const body = JSON.stringify({ type: "checkout.session.completed" });
  const sig = signStripe(body, "whsec_novo");
  const header = "t=" + sig.t + ",v1=" + "0".repeat(64) + ",v1=" + sig.v1;
  assert.strictEqual(verifyStripe(body, header, "whsec_novo"), true);
});

test("webhook: v1 de tamanho errado não derruba a função (só recusa)", () => {
  const body = "{}";
  const t = Math.floor(Date.now() / 1000);
  assert.strictEqual(verifyStripe(body, "t=" + t + ",v1=curto", "whsec_teste"), false);
});

// ============================================================
// 2) FREIO DE USO — trava quem chama demais
// ============================================================

test("freio: deixa passar até a capacidade e trava a chamada seguinte", () => {
  rateLimit._reset();
  const capacidade = 5;
  for (let i = 0; i < capacidade; i++) {
    assert.strictEqual(rateLimit._burstLimit("user-a", capacidade, 0.2).allowed, true, "chamada " + (i + 1) + " deveria passar");
  }
  const travado = rateLimit._burstLimit("user-a", capacidade, 0.2);
  assert.strictEqual(travado.allowed, false, "a 6a chamada tinha que travar");
  assert.ok(travado.retryAfter > 0, "precisa dizer em quantos segundos tentar de novo");
});

test("freio: o limite de uma pessoa não afeta a outra", () => {
  rateLimit._reset();
  for (let i = 0; i < 5; i++) rateLimit._burstLimit("user-a", 5, 0.2);
  assert.strictEqual(rateLimit._burstLimit("user-a", 5, 0.2).allowed, false);
  assert.strictEqual(rateLimit._burstLimit("user-b", 5, 0.2).allowed, true, "user-b não pode pagar pelo abuso do user-a");
});

test("freio: o balde enche de volta com o passar do tempo", () => {
  rateLimit._reset();
  const relogioReal = Date.now;
  let agora = 1_000_000_000_000;
  Date.now = () => agora;
  try {
    for (let i = 0; i < 3; i++) rateLimit._burstLimit("user-c", 3, 1); // 1 ficha por segundo
    assert.strictEqual(rateLimit._burstLimit("user-c", 3, 1).allowed, false, "balde vazio");
    agora += 2000; // passaram 2 segundos -> 2 fichas de volta
    assert.strictEqual(rateLimit._burstLimit("user-c", 3, 1).allowed, true);
    assert.strictEqual(rateLimit._burstLimit("user-c", 3, 1).allowed, true);
    assert.strictEqual(rateLimit._burstLimit("user-c", 3, 1).allowed, false, "só tinham voltado 2 fichas");
  } finally {
    Date.now = relogioReal;
  }
});

// ============================================================
// 3 e 4) FUNÇÕES DE IA — autenticação e conferência da resposta
// ============================================================

// Troca o fetch global por um dublê, pra testar sem chamar Supabase/NVIDIA de verdade
function comFetchFalso(rotas, fn) {
  const original = global.fetch;
  global.fetch = async (url, opts) => {
    for (const [pedaco, resposta] of Object.entries(rotas)) {
      if (String(url).includes(pedaco)) return resposta(opts);
    }
    throw new Error("URL inesperada no teste: " + url);
  };
  return Promise.resolve(fn()).finally(() => { global.fetch = original; });
}

const respostaJson = (obj, ok = true) => () => ({
  ok, json: async () => obj, text: async () => JSON.stringify(obj),
});

// Ambiente falso: sem isto as funções param no "Server not configured"
process.env.SUPABASE_URL = "https://exemplo.supabase.co";
process.env.SUPABASE_SERVICE_ROLE = "service-role-de-teste";
process.env.NVIDIA_API_KEY = "chave-de-teste";

const categorize = require("../netlify/functions/categorize.js");

const chamar = (fn, body) => fn.handler({ httpMethod: "POST", body: JSON.stringify(body) });

test("categorize: RECUSA quem não mandou token (401)", async () => {
  const res = await chamar(categorize, { text: "uber 10" });
  assert.strictEqual(res.statusCode, 401);
});

test("categorize: RECUSA token inválido (401) sem chamar a NVIDIA", async () => {
  let chamouNvidia = false;
  await comFetchFalso({
    "/auth/v1/user": respostaJson({}, false),
    "nvidia": () => { chamouNvidia = true; return respostaJson({})(); },
  }, async () => {
    const res = await chamar(categorize, { text: "uber 10", accessToken: "token-falso" });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(chamouNvidia, false, "não pode gastar a chave da NVIDIA com token inválido");
  });
});

test("categorize: RECUSA quem está logado mas NÃO é assinante (403)", async () => {
  let chamouNvidia = false;
  await comFetchFalso({
    "/auth/v1/user": respostaJson({ id: "u1", email: "a@b.c" }),
    "/rest/v1/subscriptions": respostaJson([{ status: "canceled" }]),
    "nvidia": () => { chamouNvidia = true; return respostaJson({})(); },
  }, async () => {
    const res = await chamar(categorize, { text: "uber 10", accessToken: "token-ok" });
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(chamouNvidia, false, "não assinante não pode gastar a chave da NVIDIA");
  });
});

test("categorize: RECUSA corpo gigante antes de qualquer outra coisa (413)", async () => {
  const res = await categorize.handler({ httpMethod: "POST", body: "x".repeat(9000) });
  assert.strictEqual(res.statusCode, 413);
});

test("categorize: RECUSA método diferente de POST (405)", async () => {
  const res = await categorize.handler({ httpMethod: "GET", body: "{}" });
  assert.strictEqual(res.statusCode, 405);
});

test("categorize: sanea resposta hostil da IA (categoria inventada, valor não-numérico, descrição gigante)", async () => {
  rateLimit._reset();
  const assinante = {
    "/auth/v1/user": respostaJson({ id: "u-sane", email: "a@b.c" }),
    "/rest/v1/subscriptions": respostaJson([{ status: "active" }]),
  };

  // (a) categoria fora da lista vira "Outros"
  await comFetchFalso(Object.assign({}, assinante, {
    "nvidia": respostaJson({ choices: [{ message: { content: JSON.stringify({ amount: 10, category: "<img src=x onerror=alert(1)>", description: "Uber" }) } }] }),
  }), async () => {
    const res = await chamar(categorize, { text: "uber 10", accessToken: "t" });
    const out = JSON.parse(res.body);
    assert.strictEqual(out.ok, true);
    assert.strictEqual(out.category, "Outros", "categoria fora da lista tem que virar Outros");
  });

  // (b) valor não-numérico é rejeitado (a coluna do banco é numérica)
  rateLimit._reset();
  await comFetchFalso(Object.assign({}, assinante, {
    "nvidia": respostaJson({ choices: [{ message: { content: JSON.stringify({ amount: "muito dinheiro", category: "Transporte", description: "Uber" }) } }] }),
  }), async () => {
    const res = await chamar(categorize, { text: "uber", accessToken: "t" });
    assert.strictEqual(JSON.parse(res.body).ok, false, "valor não-numérico não pode passar");
  });

  // (c) descrição gigante é cortada
  rateLimit._reset();
  await comFetchFalso(Object.assign({}, assinante, {
    "nvidia": respostaJson({ choices: [{ message: { content: JSON.stringify({ amount: 5, category: "Transporte", description: "A".repeat(5000) }) } }] }),
  }), async () => {
    const res = await chamar(categorize, { text: "uber", accessToken: "t" });
    const out = JSON.parse(res.body);
    assert.ok(out.description.length <= 80, "descrição tem que ser cortada, veio com " + out.description.length);
  });
});

test("categorize: erro interno não vaza detalhes pro navegador", async () => {
  rateLimit._reset();
  await comFetchFalso({
    "/auth/v1/user": respostaJson({ id: "u-err", email: "a@b.c" }),
    "/rest/v1/subscriptions": respostaJson([{ status: "trialing" }]),
    "nvidia": () => { throw new Error("SEGREDO_INTERNO_/var/task/env"); },
  }, async () => {
    const res = await chamar(categorize, { text: "uber", accessToken: "t" });
    assert.ok(!res.body.includes("SEGREDO_INTERNO"), "a resposta não pode conter o erro interno");
    assert.ok(!res.body.includes("/var/task"), "a resposta não pode conter caminho do servidor");
  });
});

test("categorize: trava a mesma pessoa depois de muitas chamadas seguidas (429)", async () => {
  rateLimit._reset();
  await comFetchFalso({
    "/auth/v1/user": respostaJson({ id: "u-flood", email: "a@b.c" }),
    "/rest/v1/subscriptions": respostaJson([{ status: "active" }]),
    "/rest/v1/rpc/bump_ai_usage": respostaJson(true),
    "nvidia": respostaJson({ choices: [{ message: { content: '{"amount":1,"category":"Outros","description":"x"}' } }] }),
  }, async () => {
    let travou = false;
    for (let i = 0; i < 40; i++) {
      const res = await chamar(categorize, { text: "cafe 3", accessToken: "t" });
      if (res.statusCode === 429) { travou = true; break; }
    }
    assert.strictEqual(travou, true, "40 chamadas seguidas tinham que bater no freio");
  });
});
