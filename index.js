(function () {
  try {
    var raw = localStorage.getItem("sb-efytffndatdkvbzeoxgm-auth-token");
    if (!raw) return;
    var s = JSON.parse(raw);
    if (s && s.access_token) window.location.replace("/app.html");
  } catch (e) {}
})();

// Entrada suave ao rolar. A classe "js" garante: sem JavaScript, nada fica escondido.
document.documentElement.classList.add("js");
(function () {
  var els = document.querySelectorAll(".reveal");
  function mostrarTudo() {
    for (var i = 0; i < els.length; i++) els[i].classList.add("in");
  }
  // Navegador sem IntersectionObserver: mostra tudo de uma vez, sem animação.
  if (!("IntersectionObserver" in window)) { mostrarTudo(); return; }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  for (var i = 0; i < els.length; i++) io.observe(els[i]);

  // REDE DE SEGURANÇA: o texto começa invisível (opacity 0) e só aparece quando o
  // observer avisa. Se o observer falhar — navegador exótico, extensão, aba em
  // segundo plano — a página ficaria em branco pra sempre. Passados 3 segundos,
  // mostra o que ainda não apareceu. Conteúdo invisível é pior que sem animação.
  setTimeout(mostrarTudo, 3000);
})();
