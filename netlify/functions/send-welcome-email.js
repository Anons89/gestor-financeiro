// ---- EMAIL DE BOAS-VINDAS ----
// O navegador chama aqui assim que detecta uma conta NOVA (o mesmo instante do
// evento sign_up do Analytics). Passos:
//   1) CONFERE quem é a pessoa pelo token (o email vem daí, não do corpo)
//   2) só envia uma vez — o registo em email_log segura o duplicado
//   3) manda pelo Resend e marca como enviado
//
// Segredos (cofre do Netlify): RESEND_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE.

const { verifyUser } = require("./lib/verify-user");
const { sendEmail } = require("./lib/send-email");
const { emailTemplate, APP_URL } = require("./lib/email-template");
const { alreadySent, markSent } = require("./lib/email-log");

const json = (statusCode, obj) => ({
  statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj),
});

const TYPE = "welcome";

function bearer(event) {
  const h = event.headers || {};
  const raw = h.authorization || h.Authorization || "";
  const m = /^Bearer\s+(.+)$/i.exec(raw);
  return m ? m[1] : "";
}

function buildWelcome() {
  const body =
    '<p style="margin:0 0 16px;">You&#39;re in. Algent is the simplest way to track your spending — just type what you spent and the AI handles the rest.</p>' +
    '<p style="margin:0 0 12px;">Start by adding your first expense. It&#39;s as easy as typing:</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111111;">' +
      '<tr><td style="padding:4px 0;">&#9749;&nbsp; <b>coffee 3.50</b> &rarr; Food &middot; &pound;3.50</td></tr>' +
      '<tr><td style="padding:4px 0;">&#128663;&nbsp; <b>uber home 8.20</b> &rarr; Transport &middot; &pound;8.20</td></tr>' +
    '</table>' +
    '<p style="margin:0;">The AI categorises everything automatically — and learns your habits over time.</p>';
  return {
    subject: "Welcome to Algent 👋",
    html: emailTemplate({
      title: "Welcome to Algent!",
      bodyHtml: body,
      ctaText: "Open Algent",
      ctaUrl: APP_URL,
      preheader: "Just type what you spent — the AI does the rest.",
    }),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { ok: false, error: "method" });
  try {
    const auth = await verifyUser(bearer(event));
    if (!auth.ok) return json(auth.code, { ok: false, error: auth.error });
    if (!auth.email) return json(200, { ok: true, skipped: "sem email" });

    // Já mandámos alguma vez? Então não repete. Se a consulta falhar, o catch
    // abaixo trata como erro brando (não reenvia às cegas).
    if (await alreadySent(auth.userId, TYPE, null)) {
      return json(200, { ok: true, skipped: "já enviado" });
    }

    const { subject, html } = buildWelcome();
    await sendEmail({ to: auth.email, subject, html });
    await markSent(auth.userId, TYPE);
    return json(200, { ok: true, sent: true });
  } catch (e) {
    // Erro fica no log do Netlify, nunca vai pro navegador — e não trava o app,
    // que chama isto em fire-and-forget.
    console.error("welcome email falhou:", e && e.message ? e.message : e);
    return json(200, { ok: false });
  }
};

exports._buildWelcome = buildWelcome;
exports._bearer = bearer;
