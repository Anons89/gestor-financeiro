// ---- Service worker do Algent ----
// Existe por dois motivos: a Play Store exige um pra empacotar o site como app
// (TWA), e é ele que faz o app abrir em tela cheia, sem barra de navegador.
//
// A REGRA AQUI É "REDE PRIMEIRO", de propósito.
// Um service worker guloso guardaria respostas do Supabase, do Stripe e das
// nossas funções — e aí a pessoa veria saldo velho, sessão expirada tratada
// como válida, ou um pagamento que "não aconteceu". Num app de dinheiro isso é
// pior que ficar sem offline. Então: sempre tenta a rede; o cache só entra
// quando a rede falha, e só pra páginas/arquivos nossos.

const CACHE = "algent-v1";

// Endereços que NUNCA entram no cache: são dados vivos ou dinheiro.
function podeGuardar(req) {
  if (req.method !== "GET") return false;                 // POST nunca
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return false;    // só o nosso domínio
  if (u.pathname.startsWith("/.netlify/functions/")) return false; // IA, Stripe, assinatura
  return true;
}

self.addEventListener("install", () => {
  self.skipWaiting();   // versão nova assume na hora, sem esperar fechar as abas
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    // limpa caches de versões antigas
    const nomes = await caches.keys();
    await Promise.all(nomes.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;

  if (!podeGuardar(req)) return;   // deixa passar direto, sem o service worker no meio

  e.respondWith((async () => {
    try {
      const resposta = await fetch(req);
      // guarda uma cópia só pra emergência (rede fora)
      if (resposta && resposta.ok) {
        const copia = resposta.clone();
        caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {});
      }
      return resposta;
    } catch (err) {
      // sem rede: devolve o que tiver guardado; se não tiver, deixa falhar normal
      const guardado = await caches.match(req);
      if (guardado) return guardado;
      throw err;
    }
  })());
});
