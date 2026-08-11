(function () {
  var body = document.body;
  var btn = document.getElementById("langToggle");
  function setLang(l) {
    body.className = "lang-" + l;
    btn.textContent = (l === "en") ? "Português" : "English";
    try { localStorage.setItem("lang", l); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  var start = (saved === "pt" || saved === "en") ? saved
            : ((navigator.language || "en").toLowerCase().indexOf("pt") === 0 ? "pt" : "en");
  setLang(start);
  btn.onclick = function () { setLang(body.classList.contains("lang-en") ? "pt" : "en"); };
})();
