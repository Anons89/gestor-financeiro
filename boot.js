// ---- Evita o "piscar" da tela de login ----
// Roda no <head>, ANTES da página desenhar qualquer coisa.
//
// O problema: a tela de login vem visível no HTML, e só depois o JS pergunta ao
// Supabase se a pessoa está logada. Quem já estava logado via o login aparecer
// por um instante antes do app.
//
// A solução: espiar aqui, de forma síncrona, a chave que o Supabase guarda no
// próprio navegador. Se existe sessão, marcamos o <html> e o CSS já nasce com a
// tela de login escondida — nada pisca.
//
// Por que não escondemos a página inteira: se o CDN do Supabase demorasse ou o
// JS quebrasse, a pessoa ficaria olhando uma tela branca sem saída. Aqui, no
// pior caso, ela vê a tela de login — que é o comportamento antigo, não uma
// tela morta.
(function () {
  try {
    var raw = localStorage.getItem("sb-efytffndatdkvbzeoxgm-auth-token");
    if (!raw) return;
    var s = JSON.parse(raw);
    if (s && s.access_token) document.documentElement.classList.add("has-session");
  } catch (e) {}

  // REDE DE SEGURANÇA: se em 6 segundos o app não tiver decidido nada (JS
  // quebrado, CDN fora do ar), devolvemos a tela de login. Melhor pedir pra
  // entrar de novo do que deixar a pessoa presa numa tela vazia.
  setTimeout(function () {
    document.documentElement.classList.remove("has-session");
  }, 6000);
})();

// ---- Registra o service worker (necessário pra instalar como app) ----
// Vai aqui num arquivo externo de propósito: a CSP do projeto não permite
// <script> inline. Falha em silêncio — se o navegador não suportar ou o
// registro der errado, o site continua funcionando igual.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
  });
}
