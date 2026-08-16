// Google Analytics 4 (gtag.js) — só nas páginas públicas.
//
// Este arquivo existe porque a CSP do site não tem 'unsafe-inline' em
// script-src: o bloco que o Google manda colar direto no <head> seria
// bloqueado pelo navegador. Aqui o mesmo código mora em um arquivo próprio,
// servido do nosso domínio, e passa sem precisar afrouxar a CSP.
//
// Carrega ANTES do gtag.js (que é async): assim o dataLayer já existe quando
// o script do Google acorda e vai procurar por ele.
//
// O app (app.html) fica de fora de propósito — uso interno do produto não é
// tráfego de marketing e só sujaria os números.

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag("js", new Date());
gtag("config", "G-6MR9LCFFJ4");
