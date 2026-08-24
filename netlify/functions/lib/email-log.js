// ---- REGISTO DE EMAILS ENVIADOS (anti-duplicado) ----
// Uma linha por email enviado: (user_id, email_type, sent_at). É o que impede
// mandar o mesmo "bem-vindo" duas vezes, ou o resumo semanal duas vezes na
// mesma semana. A tabela é escrita SÓ pela service_role (SQL no README).
//
// Regra de ouro em caso de erro: na dúvida, NÃO enviar. Se a consulta ao
// registo falhar (tabela ainda não criada, rede), é mais seguro pular a pessoa
// do que arriscar spam — um email perdido incomoda menos que três repetidos.

const { _env } = require("./supa-admin");

// Já enviámos este tipo a esta pessoa depois de `sinceISO`? (sinceISO nulo =
// alguma vez na vida — usado pelo welcome e pelo activation, que são únicos.)
async function alreadySent(userId, type, sinceISO) {
  const { url, key } = _env();
  let q = url + "/rest/v1/email_log?user_id=eq." + encodeURIComponent(userId) +
          "&email_type=eq." + encodeURIComponent(type) + "&select=id";
  if (sinceISO) q += "&sent_at=gte." + encodeURIComponent(sinceISO);
  q += "&limit=1";
  const res = await fetch(q, { headers: { "apikey": key, "Authorization": "Bearer " + key } });
  if (!res.ok) throw new Error("email_log read " + res.status);
  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0;
}

// Grava que enviámos. Best-effort: se falhar, avisa no log mas não derruba o
// pedido — o email já saiu, e derrubar aqui só criaria confusão.
async function markSent(userId, type) {
  try {
    const { url, key } = _env();
    const res = await fetch(url + "/rest/v1/email_log", {
      method: "POST",
      headers: {
        "apikey": key, "Authorization": "Bearer " + key,
        "Content-Type": "application/json", "Prefer": "return=minimal",
      },
      body: JSON.stringify({ user_id: userId, email_type: type }),
    });
    if (!res.ok) console.warn("email_log write " + res.status + ": " + (await res.text()));
  } catch (e) {
    console.warn("email_log write falhou:", e && e.message ? e.message : e);
  }
}

module.exports = { alreadySent, markSent };
