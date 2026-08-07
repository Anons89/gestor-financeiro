// ---- CONFERENTE DE IDENTIDADE (compartilhado pelas funções) ----
// Recebe o token que o navegador mandou e confere com o Supabase:
//   1) esse token é de uma pessoa logada de verdade?
//   2) essa pessoa tem assinatura viva (teste grátis ou ativa)?
// Assim nenhuma função de IA pode ser usada por quem não é assinante —
// e ninguém consegue gastar a chave da NVIDIA de fora do app.
//
// Este arquivo NÃO vira endpoint (fica na pasta lib/), é só um ajudante.

async function verifyUser(accessToken) {
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!supaUrl || !supaKey) return { ok: false, code: 500, error: "Server not configured" };
  if (!accessToken) return { ok: false, code: 401, error: "Not signed in" };

  // 1) Pergunta ao Supabase de quem é este token
  const who = await fetch(supaUrl + "/auth/v1/user", {
    headers: { "apikey": supaKey, "Authorization": "Bearer " + accessToken },
  });
  if (!who.ok) return { ok: false, code: 401, error: "Invalid session" };
  const user = await who.json();
  if (!user || !user.id) return { ok: false, code: 401, error: "Invalid session" };

  // 2) Busca o status da assinatura na tabela subscriptions (com a chave-mestra)
  let status = null;
  try {
    const res = await fetch(
      supaUrl + "/rest/v1/subscriptions?user_id=eq." + encodeURIComponent(user.id) +
      "&select=status&order=updated_at.desc&limit=1",
      { headers: { "apikey": supaKey, "Authorization": "Bearer " + supaKey } }
    );
    const rows = res.ok ? await res.json() : [];
    status = rows && rows[0] ? rows[0].status : null;
  } catch (e) {}

  const subscribed = status === "trialing" || status === "active";
  return { ok: true, userId: user.id, email: user.email || "", subscribed: subscribed, status: status };
}

module.exports = { verifyUser };
