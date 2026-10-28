/* ==========================================================================
   app.js - Application entry point
   Renders the shared shell, wires the home page and dispatches to the
   page-specific controllers based on <body data-page="...">.
   ========================================================================== */
(function () {
  "use strict";
  const DS = window.DS;
  const DATA = window.APP_DATA;

  /* ---------------------------- Statistics ------------------------------- */
  function animateCount(el, target) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || target <= 0) { el.textContent = String(target); return; }
    let current = 0;
    const step = Math.max(1, Math.round(target / 24));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = String(current);
    }, 28);
  }

  function renderStats() {
    const values = {
      modules: DATA.MODULES.length,
      experiments: DATA.EXPERIMENTS.length,
      subexperiments: DATA.totalSubExperiments(),
      code: DATA.allSubExperiments().filter((s) => s.source).length
    };
    DS.$$("[data-stat]").forEach((el) => animateCount(el, values[el.dataset.stat] || 0));
  }

  /* ----------------------------- Home page ------------------------------- */
  function initHome() {
    renderStats();
  }

  /* ------------------------------ Bootstrap ------------------------------ */
  function boot() {
    // 1. Shared shell
    DS.Layout.render();
    DS.Navigation.init();

    // 2. Re-run icon replacement after dynamic content later on
    DS.refreshIcons();

    // 3. Page-specific controllers
    DS.Modules.init();
    DS.Experiments.renderGrids();

    const page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "experiment-details") DS.Experiments.initDetails();
    if (page === "tools") DS.Tools.init();

    // 4. Safety net: some CDNs finish loading icons after boot.
    window.addEventListener("load", () => DS.refreshIcons());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
