// ---- EMAIL DE ATIVAÇÃO (agendada, 1x/dia) ----
// Roda de madrugada (ver netlify.toml). Procura quem criou conta há ~24h e
// ainda não anotou NENHUM gasto, e dá um empurrãozinho. Só uma vez por pessoa.
//
// A janela é 20–28h (24h ± 4h): o cron corre uma vez por dia, então a conta
// tem que "caber" numa única passagem — e a margem cobre quem se registou em
// qualquer hora do dia. Fora da janela não manda: mais cedo é apressado, mais
// tarde já não é "ontem".

const { listAllUsers, expenseCount } = require("./lib/supa-admin");
const { sendEmail } = require("./lib/send-email");
const { emailTemplate, APP_URL } = require("./lib/email-template");
const { alreadySent, markSent } = require("./lib/email-log");

const TYPE = "activation";
const H = 3600 * 1000;

// Só decide a janela — separado pra poder testar sem tocar na rede.
function dueForActivation(createdAtISO, nowMs) {
  const t = Date.parse(createdAtISO);
  if (isNaN(t)) return false;
  const idade = nowMs - t;
  return idade >= 20 * H && idade <= 28 * H;
}

function buildActivation() {
  const body =
    '<p style="margin:0 0 16px;">You created your Algent account yesterday but haven&#39;t tracked any spending yet.</p>' +
    '<p style="margin:0 0 12px;">It takes 5 seconds — just type what you spent:</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">' +
      '<tr><td style="padding:10px 16px;background:#f4f4f4;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111111;"><b>lunch 8.50</b></td></tr>' +
    '</table>' +
    '<p style="margin:0;">Algent&#39;s AI will categorise it instantly. Try it now:</p>';
  return {
    subject: "Ready to track your first expense? 📊",
    html: emailTemplate({
      title: "Your first expense is a sentence away",
      bodyHtml: body,
      ctaText: "Add your first expense",
      ctaUrl: APP_URL,
      preheader: "It takes 5 seconds — just type what you spent.",
    }),
  };
}

exports.handler = async () => {
  const now = Date.now();
  let enviados = 0, olhados = 0;
  try {
    const users = await listAllUsers();
    const { subject, html } = buildActivation();

    for (const u of users) {
      if (!u || !u.email || !dueForActivation(u.created_at, now)) continue;
      olhados++;
      try {
        if (await alreadySent(u.id, TYPE, null)) continue;   // já recebeu
        if (await expenseCount(u.id) > 0) continue;           // já se ativou
        await sendEmail({ to: u.email, subject, html });
        await markSent(u.id, TYPE);
        enviados++;
      } catch (e) {
        // Falha numa pessoa não pode parar a fila das outras.
        console.warn("activation pulou " + u.id + ":", e && e.message ? e.message : e);
      }
    }
    console.log("activation: " + enviados + " enviados de " + olhados + " na janela");
    return { statusCode: 200, body: "sent " + enviados };
  } catch (e) {
    console.error("activation falhou:", e && e.message ? e.message : e);
    return { statusCode: 200, body: "error" };
  }
};

exports._dueForActivation = dueForActivation;
exports._buildActivation = buildActivation;
