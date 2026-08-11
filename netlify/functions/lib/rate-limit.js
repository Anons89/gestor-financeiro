// ---- FREIO DE USO (rate limiting) ----
// Sem isto, UMA pessoa assinante (£2,99/mês) pode chamar a IA num laço infinito
// e queimar a fatura inteira da NVIDIA. Este arquivo põe dois freios:
//
//   1) FREIO DE RAJADA (na memória do servidor) — funciona SEMPRE, sem instalar nada.
//      Segura o laço infinito, que é o abuso realista: a mesma pessoa martelando
//      o endpoint cai quase sempre no mesmo container quente da função.
//
//   2) COTA DIÁRIA (no Supabase) — funciona depois que você rodar o SQL do README.
//      Segura o abuso distribuído/lento, que o freio de memória não pega.
//
// Se o Supabase estiver fora do ar ou a função SQL ainda não existir, a cota
// diária libera a passagem (pra uma pane no banco não derrubar o app) — mas o
// freio de rajada continua de pé de qualquer jeito.

// ---------- 1) Freio de rajada, por pessoa, na memória do container ----------
// "Balde de fichas": cada chamada gasta 1 ficha; o balde enche de volta sozinho.
const buckets = new Map();
const MAX_TRACKED = 5000; // trava de memória: nunca guarda mais que isso

function burstLimit(userId, capacity, refillPerSec) {
  const now = Date.now() / 1000;
  let b = buckets.get(userId);
  if (!b) {
    // Limpeza preguiçosa: se o mapa cresceu demais, joga fora os baldes cheios (inativos)
    if (buckets.size >= MAX_TRACKED) {
      for (const [k, v] of buckets) {
        if (v.tokens + (now - v.last) * refillPerSec >= capacity) buckets.delete(k);
        if (buckets.size < MAX_TRACKED / 2) break;
      }
    }
    b = { tokens: capacity, last: now };
    buckets.set(userId, b);
  }
  // Enche o balde proporcionalmente ao tempo que passou desde a última chamada
  b.tokens = Math.min(capacity, b.tokens + (now - b.last) * refillPerSec);
  b.last = now;
  if (b.tokens < 1) {
    return { allowed: false, retryAfter: Math.ceil((1 - b.tokens) / refillPerSec) };
  }
  b.tokens -= 1;
  return { allowed: true };
}

// ---------- 2) Cota diária, por pessoa, guardada no Supabase ----------
// Usa uma função SQL que soma +1 e devolve se ainda cabe — tudo numa tacada só,
// pra duas chamadas ao mesmo tempo não furarem a cota.
async function dailyQuota(userId, bucketName, limit) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return { allowed: true, skipped: true };
  try {
    const res = await fetch(url + "/rest/v1/rpc/bump_ai_usage", {
      method: "POST",
      headers: {
        "apikey": key,
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_user: userId, p_bucket: bucketName, p_limit: limit }),
    });
    // Função ainda não instalada (404) ou banco com problema: deixa passar.
    // O freio de rajada acima continua protegendo.
    if (!res.ok) return { allowed: true, skipped: true };
    const under = await res.json();
    return { allowed: under === true, skipped: false };
  } catch (e) {
    return { allowed: true, skipped: true };
  }
}

// ---------- Porta única usada pelas funções ----------
// Devolve null se pode passar, ou a resposta HTTP 429 pronta se travou.
async function checkLimits(userId, opts) {
  const burst = burstLimit(userId, opts.burstCapacity, opts.burstRefillPerSec);
  if (!burst.allowed) {
    return {
      statusCode: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(burst.retryAfter) },
      body: JSON.stringify({ ok: false, error: "rate limited" }),
    };
  }
  const daily = await dailyQuota(userId, opts.bucket, opts.dailyLimit);
  if (!daily.allowed) {
    return {
      statusCode: 429,
      headers: { "Content-Type": "application/json", "Retry-After": "3600" },
      body: JSON.stringify({ ok: false, error: "daily limit reached" }),
    };
  }
  return null;
}

// `_burstLimit` e `_reset` são expostos só pros testes de segurança.
// As funções do Netlify usam apenas `checkLimits`.
module.exports = {
  checkLimits,
  _burstLimit: burstLimit,
  _reset: () => buckets.clear(),
};
