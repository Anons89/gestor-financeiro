// ---- RESUMO SEMANAL (agendada, 1x/semana) ----
// Segunda de manhã (ver netlify.toml). Para cada pessoa ATIVA (que já anotou
// algum gasto), monta o resumo dos últimos 7 dias e compara com a semana
// anterior. Quem não anotou nada na semana leva uma versão leve de reengajamento
// em vez de números vazios. No máximo um por pessoa por semana.

const { listAllUsers, expensesSince } = require("./lib/supa-admin");
const { sendEmail } = require("./lib/send-email");
const { emailTemplate, esc, APP_URL } = require("./lib/email-template");
const { alreadySent, markSent } = require("./lib/email-log");

const TYPE = "weekly";
const DAY = 86400 * 1000;

// Símbolos das 9 moedas do app. O resumo NÃO soma moedas diferentes: escolhe a
// de maior gasto e formata com o símbolo dela — senão "£" apareceria na frente
// de uma soma que mistura libra e real.
const SYM = { GBP: "£", EUR: "€", USD: "$", BRL: "R$", JPY: "¥", AUD: "A$", CAD: "C$", CHF: "CHF ", CNY: "¥" };
function fmt(v, cur) {
  const s = SYM[cur] || (cur ? cur + " " : "£");
  return s + (Number(v) || 0).toFixed(2);
}

// Recebe os gastos dos últimos 14 dias e devolve o que o email precisa. Puro,
// sem rede: dá pra testar o cálculo sozinho.
function summariseWeek(rows, nowMs) {
  const semana = nowMs - 7 * DAY;
  const anterior = nowMs - 14 * DAY;

  // Soma por moeda (semana atual) pra escolher a moeda dominante.
  const porMoeda = {};
  const catPorMoeda = {};
  let count = 0;
  const prevPorMoeda = {};

  for (const r of rows) {
    const t = Date.parse(r.date);
    if (isNaN(t)) continue;
    const cur = r.cur || "GBP";
    const amt = Number(r.amount) || 0;
    if (t >= semana) {
      porMoeda[cur] = (porMoeda[cur] || 0) + amt;
      count++;
      (catPorMoeda[cur] = catPorMoeda[cur] || {});
      catPorMoeda[cur][r.category || "Outros"] = (catPorMoeda[cur][r.category || "Outros"] || 0) + amt;
    } else if (t >= anterior) {
      prevPorMoeda[cur] = (prevPorMoeda[cur] || 0) + amt;
    }
  }

  if (count === 0) return { hasSpending: false };

  // Moeda dominante = a de maior total na semana.
  let cur = "GBP", melhor = -1;
  for (const c in porMoeda) if (porMoeda[c] > melhor) { melhor = porMoeda[c]; cur = c; }
  const total = porMoeda[cur];

  // Categoria líder DENTRO dessa moeda.
  const cats = catPorMoeda[cur] || {};
  let topCat = null, topAmt = -1;
  for (const c in cats) if (cats[c] > topAmt) { topAmt = cats[c]; topCat = c; }

  // Comparação com a semana anterior, na mesma moeda.
  const prev = prevPorMoeda[cur] || 0;
  let comparison = null;
  if (prev > 0) {
    const pct = Math.round(Math.abs(total - prev) / prev * 100);
    if (pct === 0) comparison = "about the same as last week";
    else comparison = pct + "% " + (total >= prev ? "more" : "less") + " than last week";
  }

  return { hasSpending: true, cur, total, count, topCat, topAmt, comparison };
}

// Nomes de categoria são guardados em português (id interno) — traduz pro email.
const CAT_EN = {
  "Alimentação": "Food", "Transporte": "Transport", "Mercado": "Groceries", "Lazer": "Leisure",
  "Contas": "Bills", "Compras": "Shopping", "Saúde": "Health", "Assinaturas": "Subscriptions",
  "Educação": "Education", "Viagem": "Travel", "Casa": "Home", "Beleza": "Beauty",
  "Pets": "Pets", "Outros": "Other",
};

function buildWithSpending(s) {
  const cat = CAT_EN[s.topCat] || s.topCat || "Other";
  const linhas = [
    '&#128202; You tracked <b>' + s.count + '</b> ' + (s.count === 1 ? "expense" : "expenses"),
    '&#128176; Total: <b>' + esc(fmt(s.total, s.cur)) + '</b>',
    '&#127942; Top category: <b>' + esc(cat) + '</b> (' + esc(fmt(s.topAmt, s.cur)) + ')',
  ];
  if (s.comparison) linhas.push('&#128200; ' + esc(s.comparison));

  const body =
    '<p style="margin:0 0 16px;">Here&#39;s your spending summary for the past week:</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111111;">' +
      linhas.map(l => '<tr><td style="padding:6px 0;">' + l + '</td></tr>').join("") +
    '</table>' +
    '<p style="margin:0;">Keep tracking — the more you log, the better Algent understands your spending.</p>';

  return {
    subject: "Your week with Algent: " + fmt(s.total, s.cur) + " spent 📊",
    html: emailTemplate({
      title: "Your week with Algent",
      bodyHtml: body,
      ctaText: "View your spending",
      ctaUrl: APP_URL,
      preheader: "Your spending summary for the past week.",
    }),
  };
}

function buildMissedYou() {
  const body =
    '<p style="margin:0 0 16px;">You didn&#39;t track any spending this week. Life gets busy — no judgement.</p>' +
    '<p style="margin:0 0 12px;">A quick tip: the easiest way to stay on top of your money is to log expenses as they happen. It takes 5 seconds:</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">' +
      '<tr><td style="padding:10px 16px;background:#f4f4f4;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111111;"><b>coffee 3.50</b></td></tr>' +
    '</table>' +
    '<p style="margin:0;">Your AI assistant is ready when you are.</p>';
  return {
    subject: "We missed you this week 👋",
    html: emailTemplate({
      title: "We missed you this week",
      bodyHtml: body,
      ctaText: "Open Algent",
      ctaUrl: APP_URL,
      preheader: "Logging an expense takes 5 seconds.",
    }),
  };
}

exports.handler = async () => {
  const now = Date.now();
  const sinceISO = new Date(now - 14 * DAY).toISOString();
  const semanaISO = new Date(now - 6.5 * DAY).toISOString(); // "já mandei esta semana?"
  let enviados = 0;
  try {
    const users = await listAllUsers();
    for (const u of users) {
      if (!u || !u.email) continue;
      try {
        // Uma vez por semana no máximo.
        if (await alreadySent(u.id, TYPE, semanaISO)) continue;

        const rows = await expensesSince(u.id, sinceISO);
        // Conta ativa = já anotou algo em algum momento. Sem NADA nos últimos 14
        // dias, buscamos o histórico pra não mandar "resumo" a quem nunca usou —
        // essa pessoa é caso do email de ativação, não deste.
        let ativo = rows.length > 0;
        if (!ativo) {
          const qualquer = await expensesSince(u.id, "1970-01-01T00:00:00Z");
          ativo = qualquer.length > 0;
          if (!ativo) continue;
        }

        const s = summariseWeek(rows, now);
        const { subject, html } = s.hasSpending ? buildWithSpending(s) : buildMissedYou();
        await sendEmail({ to: u.email, subject, html });
        await markSent(u.id, TYPE);
        enviados++;
      } catch (e) {
        console.warn("weekly pulou " + u.id + ":", e && e.message ? e.message : e);
      }
    }
    console.log("weekly: " + enviados + " enviados");
    return { statusCode: 200, body: "sent " + enviados };
  } catch (e) {
    console.error("weekly falhou:", e && e.message ? e.message : e);
    return { statusCode: 200, body: "error" };
  }
};

exports._summariseWeek = summariseWeek;
exports._buildWithSpending = buildWithSpending;
exports._buildMissedYou = buildMissedYou;
exports._fmt = fmt;
