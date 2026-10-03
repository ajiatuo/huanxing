/* 「定」主题：只做一件事 —— 白天 / 夜晚切换，记住读者的选择。 */
(function () {
  var KEY = "ding-theme";

  function isDark() {
    var a = document.documentElement.getAttribute("data-theme");
    if (a) return a === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function apply(dark) {
    if (dark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    try { localStorage.setItem(KEY, dark ? "dark" : "light"); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    }
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () { apply(!isDark()); });
    });
  });
})();

/* 「定」主题：滚动显现 —— 内容随滚动温和浮现。
   纯渐进增强：无 JS 或不支持时内容直接可见。 */
(function () {
  function init() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var els = document.querySelectorAll(
      ".section-head, .cards .card, .voice-list blockquote, .news-list li, .contact-cards li, .footer-inner"
    );
    if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    els.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 6, 5) * 0.07) + "s";
      io.observe(el);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
