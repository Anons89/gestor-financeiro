// ---- MOLDE DOS EMAILS (compartilhado) ----
// Um HTML só, montado à mão com CSS inline. Cliente de email não é navegador:
// Gmail e Outlook ignoram <style>, cortam classes e recolocam o layout. Por
// isso é tudo tabela e style="..." direto na tag — o formato que sobrevive.
//
// Fundo branco de propósito: tema escuro em email cai mal no modo claro do
// Gmail (o cliente inverte cores e o verde vira uma mancha). O verde da marca
// entra só no cabeçalho e no botão, sobre branco.

// O remetente vem do ambiente pra não precisar mexer em código se o endereço
// verificado no Resend for outro. Default no hello@; se esse não estiver
// configurado, basta pôr EMAIL_FROM="Algent <noreply@algent.co.uk>" no Netlify.
const FROM = process.env.EMAIL_FROM || "Algent <hello@algent.co.uk>";
const APP_URL = "https://algent.co.uk/app.html";

// Escapa o que for interpolado de dados (categoria, etc.) — um email é HTML, e
// um "<" numa descrição não pode virar tag. Os textos fixos deste arquivo já
// são seguros; isto protege o que vem de fora.
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// bodyHtml entra JÁ como HTML (os parágrafos são montados por quem chama, com
// esc() onde há dados). preheader é a linha que o Gmail mostra ao lado do
// assunto na caixa de entrada — sem ela, o cliente rouba a primeira linha do
// corpo, que às vezes é o endereço do logo.
function emailTemplate({ title, bodyHtml, ctaText, ctaUrl, preheader }) {
  const cta = (ctaText && ctaUrl) ? (
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">' +
      '<tr><td style="border-radius:8px;background:#00E68A;">' +
        '<a href="' + esc(ctaUrl) + '" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#0D0D0D;text-decoration:none;border-radius:8px;">' +
          esc(ctaText) +
        '</a>' +
      '</td></tr>' +
    '</table>'
  ) : "";

  return '<!doctype html><html><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="light">' +
    '</head>' +
    '<body style="margin:0;padding:0;background:#f2f2f2;">' +
      // preheader escondido: aparece na lista da caixa de entrada, não no corpo
      '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' + esc(preheader || "") + '</div>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;">' +
        '<tr><td align="center" style="padding:24px 12px;">' +
          '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">' +
            '<tr><td style="padding:36px 32px 8px;">' +
              '<div style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;color:#00B36B;letter-spacing:-0.5px;">Algent</div>' +
            '</td></tr>' +
            '<tr><td style="padding:16px 32px 0;">' +
              '<h1 style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#111111;">' + esc(title) + '</h1>' +
              '<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#444444;">' + bodyHtml + '</div>' +
            '</td></tr>' +
            '<tr><td style="padding:20px 32px 36px;">' + cta + '</td></tr>' +
            '<tr><td style="padding:22px 32px 34px;border-top:1px solid #ececec;">' +
              '<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#999999;">' +
                'You&#39;re receiving this because you created an Algent account. If this wasn&#39;t you, you can ignore this email.<br>' +
                '<a href="https://algent.co.uk/delete-account" style="color:#999999;text-decoration:underline;">Delete your account</a>' +
                ' &middot; Algent, London' +
              '</div>' +
            '</td></tr>' +
          '</table>' +
        '</td></tr>' +
      '</table>' +
    '</body></html>';
}

module.exports = { emailTemplate, esc, FROM, APP_URL };
