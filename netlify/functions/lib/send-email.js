// ---- ENVIO DE EMAIL (Resend) ----
// Um ajudante só, na pasta lib/ — não vira endpoint. A chave do Resend mora no
// cofre do Netlify (RESEND_API_KEY), nunca no navegador nem no GitHub.

const { FROM } = require("./email-template");

async function sendEmail({ to, subject, html }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY ausente");
  if (!to) throw new Error("destinatário vazio");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject: subject,
      html: html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Resend " + res.status + ": " + err);
  }
  return res.json();
}

module.exports = { sendEmail };
