// Google Analytics 4 (gtag.js) + os eventos do funil de conversão.
//
// Este arquivo existe porque a CSP do site não tem 'unsafe-inline' em
// script-src: o bloco que o Google manda colar direto no <head> seria
// bloqueado pelo navegador. Aqui o mesmo código mora em um arquivo próprio,
// servido do nosso domínio, e passa sem precisar afrouxar a CSP.
//
// Carrega ANTES do gtag.js (que é async): assim o dataLayer já existe quando
// o script do Google acorda e vai procurar por ele.

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());

// O app agora também mede — precisamos de saber onde as pessoas desistem, e
// metade do funil (login, paywall, pagamento) acontece lá dentro. Mas SEM
// page_view: uso interno do produto não é tráfego de marketing, e contá-lo
// como visita inflaria as visitas do site com quem já é cliente. Só os
// eventos do funil, que são disparados à mão pelo app.js, saem daqui.
var noApp = /(^|\/)app\.html$/.test(location.pathname) || location.pathname === "/app";
gtag("config", "G-6MR9LCFFJ4", noApp ? { send_page_view: false } : {});

// ---- Funil: o que só existe na landing ----
if (!noApp) {
  // Delegado no document (e não um listener por botão) porque este script roda
  // no <head>, antes de os botões existirem. Sem onclick inline: a CSP barra.
  document.addEventListener("click", function (e) {
    var alvo = e.target && e.target.closest
      ? e.target.closest('a[href*="app.html"], .btn-primary, .nav-cta')
      : null;
    if (!alvo) return;
    gtag("event", "cta_click", {
      button_text: (alvo.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50),
      page: "landing",
    });
  });
}

// ---- Funil: compra confirmada, chegue ela onde chegar ----
// O Stripe devolve a pessoa para "?paid=1". Este bloco fica FORA do teste da
// landing de propósito: o destino do success_url já mudou uma vez (era "/",
// agora é "/app.html"), e amarrar a medição da compra a uma página específica
// faria o evento desaparecer em silêncio na próxima vez que mudasse.
try {
  if (new URLSearchParams(location.search).get("paid") === "1"
      && !sessionStorage.getItem("ga_purchase_sent")) {
    // Marca ANTES de enviar: se a pessoa recarregar a página com o ?paid=1
    // ainda na barra de endereço, a compra não é contada duas vezes.
    sessionStorage.setItem("ga_purchase_sent", "1");
    gtag("event", "purchase", { method: "stripe", value: 2.99, currency: "GBP" });
  }
} catch (err) {}
