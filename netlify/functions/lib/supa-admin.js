// ---- ACESSO ADMIN AO SUPABASE (só servidor) ----
// Ajudantes usados pelas funções agendadas (activation, weekly). Tudo com a
// chave-mestra (service_role) — passa por cima do RLS, então SÓ pode viver no
// servidor. As buscas nunca recebem id vindo de fora: quem agenda é o cron.

function env() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) throw new Error("Supabase env ausente");
  return { url, key };
}
function headers() {
  const { key } = env();
  return { "apikey": key, "Authorization": "Bearer " + key };
}

// Lista TODAS as contas (a API de admin é paginada). Base pequena: alguns
// milhares cabem em poucas páginas. Cada conta traz id, email e created_at.
async function listAllUsers() {
  const { url } = env();
  const out = [];
  const perPage = 1000;
  for (let page = 1; page <= 50; page++) {   // teto de segurança: 50k contas
    const res = await fetch(
      url + "/auth/v1/admin/users?page=" + page + "&per_page=" + perPage,
      { headers: headers() }
    );
    if (!res.ok) throw new Error("admin/users " + res.status);
    const data = await res.json();
    const users = (data && data.users) || [];
    for (const u of users) out.push(u);
    if (users.length < perPage) break;   // última página
  }
  return out;
}

// Conta gastos de uma pessoa (HEAD + Prefer:count — não baixa as linhas).
async function expenseCount(userId) {
  const { url } = env();
  const res = await fetch(
    url + "/rest/v1/expenses?user_id=eq." + encodeURIComponent(userId) + "&select=id",
    { method: "HEAD", headers: Object.assign(headers(), { "Prefer": "count=exact", "Range": "0-0" }) }
  );
  if (!res.ok && res.status !== 206) throw new Error("expenses count " + res.status);
  const cr = res.headers.get("content-range") || "";   // ex.: "0-0/42" ou "*/0"
  const total = cr.split("/")[1];
  return Number(total) || 0;
}

// Gastos de uma pessoa a partir de uma data (pro resumo semanal).
async function expensesSince(userId, sinceISO) {
  const { url } = env();
  const res = await fetch(
    url + "/rest/v1/expenses?user_id=eq." + encodeURIComponent(userId) +
    "&date=gte." + encodeURIComponent(sinceISO) +
    "&select=date,amount,category,cur",
    { headers: headers() }
  );
  if (!res.ok) throw new Error("expenses since " + res.status);
  return res.json();
}

module.exports = { listAllUsers, expenseCount, expensesSince, _headers: headers, _env: env };
