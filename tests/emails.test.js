// ---- TESTES DOS EMAILS AUTOMÁTICOS ----
// Só a lógica pura + o envio com fetch fingido. Não toca no Resend nem no
// Supabase de verdade (nem tem as chaves). Roda com:  node --test tests/

const test = require("node:test");
const assert = require("node:assert");

const tpl = require("../netlify/functions/lib/email-template.js");
const activation = require("../netlify/functions/send-activation-email.js");
const weekly = require("../netlify/functions/send-weekly-summary.js");
const welcome = require("../netlify/functions/send-welcome-email.js");

const H = 3600 * 1000, DAY = 86400 * 1000;

// ============================================================
// 1) MOLDE — escapa dados e não deixa passar HTML de fora
// ============================================================
test("template: escapa < > & nos dados interpolados (title)", () => {
  const html = tpl.emailTemplate({ title: '<script>x</script> & "aspas"', bodyHtml: "ok" });
  assert.ok(!html.includes("<script>x"), "o script cru não pode aparecer");
  assert.ok(html.includes("&lt;script&gt;"), "tem que vir escapado");
});

test("template: sem CTA não gera botão; com CTA gera o link", () => {
  const semBtn = tpl.emailTemplate({ title: "t", bodyHtml: "b" });
  // O rodapé sempre tem o link de apagar conta; o que não pode existir sem CTA
  // é o BOTÃO verde.
  assert.ok(!semBtn.includes("background:#00E68A"), "sem ctaUrl não há botão verde");
  const comBtn = tpl.emailTemplate({ title: "t", bodyHtml: "b", ctaText: "Vai", ctaUrl: "https://algent.co.uk/app.html" });
  assert.ok(comBtn.includes("https://algent.co.uk/app.html"));
  assert.ok(comBtn.includes("#00E68A"), "botão verde da marca");
});

// ============================================================
// 2) JANELA DE ATIVAÇÃO — 20 a 28h, nada fora disso
// ============================================================
test("activation: dentro da janela (24h) envia", () => {
  const now = Date.now();
  assert.strictEqual(activation._dueForActivation(new Date(now - 24 * H).toISOString(), now), true);
  assert.strictEqual(activation._dueForActivation(new Date(now - 21 * H).toISOString(), now), true);
});
test("activation: cedo demais (10h) ou tarde demais (40h) NÃO envia", () => {
  const now = Date.now();
  assert.strictEqual(activation._dueForActivation(new Date(now - 10 * H).toISOString(), now), false);
  assert.strictEqual(activation._dueForActivation(new Date(now - 40 * H).toISOString(), now), false);
});
test("activation: data inválida não quebra, devolve false", () => {
  assert.strictEqual(activation._dueForActivation("nao-e-data", Date.now()), false);
});

// ============================================================
// 3) RESUMO SEMANAL — contas, moeda dominante, comparação
// ============================================================
const now = Date.now();
const r = (dias, amount, category, cur) => ({ date: new Date(now - dias * DAY).toISOString(), amount, category, cur: cur || "GBP" });

test("weekly: soma, contagem e categoria líder da semana", () => {
  const s = weekly._summariseWeek([
    r(1, 4.5, "Alimentação"), r(2, 8.2, "Transporte"), r(3, 10, "Alimentação"),
    r(9, 100, "Alimentação"),   // semana anterior — não entra no total
  ], now);
  assert.strictEqual(s.hasSpending, true);
  assert.strictEqual(s.count, 3);
  assert.strictEqual(s.total, 22.7);
  assert.strictEqual(s.topCat, "Alimentação");     // 14.5 > 8.2
  assert.strictEqual(s.cur, "GBP");
});

test("weekly: comparação com a semana anterior na mesma moeda", () => {
  const s = weekly._summariseWeek([ r(1, 110, "Casa"), r(8, 100, "Casa") ], now);
  assert.strictEqual(s.comparison, "10% more than last week");
});

test("weekly: NÃO soma moedas diferentes — escolhe a dominante", () => {
  const s = weekly._summariseWeek([
    r(1, 5, "Alimentação", "BRL"), r(1, 5, "Alimentação", "BRL"), r(1, 5, "Alimentação", "BRL"),
    r(1, 4, "Transporte", "GBP"),
  ], now);
  assert.strictEqual(s.cur, "BRL");     // 15 BRL > 4 GBP
  assert.strictEqual(s.total, 15);      // e NÃO 19
});

test("weekly: sem gastos na semana => versão 'we missed you'", () => {
  const s = weekly._summariseWeek([ r(10, 50, "Casa") ], now);
  assert.strictEqual(s.hasSpending, false);
  const m = weekly._buildMissedYou();
  assert.ok(/missed you/i.test(m.subject));
});

test("weekly: fmt usa o símbolo certo e nunca mistura", () => {
  assert.strictEqual(weekly._fmt(4.5, "GBP"), "£4.50");
  assert.strictEqual(weekly._fmt(15, "BRL"), "R$15.00");
  assert.strictEqual(weekly._fmt(9.9, "JPY"), "¥9.90");
});

test("weekly: assunto e corpo com dados perigosos ficam escapados", () => {
  const s = weekly._summariseWeek([ r(1, 5, '<b>x</b>') ], now);
  const email = weekly._buildWithSpending(s);
  assert.ok(!email.html.includes("<b>x</b>"), "categoria não pode injetar HTML");
});

// ============================================================
// 4) WELCOME — lê o Bearer do header, ignora o resto
// ============================================================
test("welcome: extrai o token do header Authorization", () => {
  assert.strictEqual(welcome._bearer({ headers: { authorization: "Bearer abc.123" } }), "abc.123");
  assert.strictEqual(welcome._bearer({ headers: { Authorization: "Bearer XYZ" } }), "XYZ");
  assert.strictEqual(welcome._bearer({ headers: {} }), "");
});

// ============================================================
// 5) ENVIO — monta o pedido certo pro Resend (fetch fingido)
// ============================================================
test("sendEmail: chama o Resend com from/to/subject e Bearer", async () => {
  const origFetch = global.fetch, origKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "re_teste";
  delete require.cache[require.resolve("../netlify/functions/lib/send-email.js")];
  delete require.cache[require.resolve("../netlify/functions/lib/email-template.js")];
  let capturado = null;
  global.fetch = async (url, opt) => {
    capturado = { url, opt };
    return { ok: true, json: async () => ({ id: "email_1" }) };
  };
  try {
    const { sendEmail } = require("../netlify/functions/lib/send-email.js");
    await sendEmail({ to: "a@b.com", subject: "Oi", html: "<p>x</p>" });
    assert.strictEqual(capturado.url, "https://api.resend.com/emails");
    assert.match(capturado.opt.headers.Authorization, /^Bearer re_teste$/);
    const body = JSON.parse(capturado.opt.body);
    assert.deepStrictEqual(body.to, ["a@b.com"]);
    assert.strictEqual(body.subject, "Oi");
    assert.ok(/@algent\.co\.uk/.test(body.from), "remetente do domínio Algent");
  } finally {
    global.fetch = origFetch; process.env.RESEND_API_KEY = origKey;
    delete require.cache[require.resolve("../netlify/functions/lib/send-email.js")];
  }
});

test("sendEmail: erro do Resend vira exceção (pra função tratar/pular)", async () => {
  const origFetch = global.fetch, origKey = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "re_teste";
  delete require.cache[require.resolve("../netlify/functions/lib/send-email.js")];
  global.fetch = async () => ({ ok: false, status: 422, text: async () => "bad" });
  try {
    const { sendEmail } = require("../netlify/functions/lib/send-email.js");
    await assert.rejects(() => sendEmail({ to: "a@b.com", subject: "s", html: "h" }), /Resend 422/);
  } finally {
    global.fetch = origFetch; process.env.RESEND_API_KEY = origKey;
    delete require.cache[require.resolve("../netlify/functions/lib/send-email.js")];
  }
});
