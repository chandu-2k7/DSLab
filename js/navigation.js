/* ==========================================================================
   navigation.js - Sidebar drawer, hamburger toggle and smooth scrolling
   ========================================================================== */
(function () {
  "use strict";
  const DS = window.DS;

  const MOBILE_QUERY = "(max-width: 1023px)";

  function isMobile() {
    return window.matchMedia(MOBILE_QUERY).matches;
  }

  function setExpanded(expanded) {
    document.body.classList.toggle("sidebar-expanded", expanded);
    const burger = DS.$("#hamburger");
    if (burger) burger.setAttribute("aria-expanded", String(expanded));
    const sidebar = DS.$("#sidebar");
    if (sidebar) sidebar.setAttribute("aria-hidden", String(!expanded && isMobile()));
  }

  function toggle() {
    setExpanded(!document.body.classList.contains("sidebar-expanded"));
  }

  function close() {
    setExpanded(false);
  }

  function initSmoothScroll() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Move focus for keyboard/screen-reader users without an extra jump.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      history.replaceState(null, "", hash);
      if (isMobile()) close();
    });
  }

  DS.Navigation = {
    init() {
      setExpanded(false);

      document.addEventListener("click", (event) => {
        if (event.target.closest("#hamburger")) { toggle(); return; }
        if (event.target.closest("#sidebar-collapse")) { close(); return; }
        if (event.target.closest("#sidebar-overlay")) { close(); return; }
        // Close the mobile drawer after choosing a destination.
        const navLink = event.target.closest(".sidebar .nav-item");
        if (navLink && isMobile()) close();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && document.body.classList.contains("sidebar-expanded") && isMobile()) {
          close();
          const burger = DS.$("#hamburger");
          if (burger) burger.focus();
        }
      });

      // Reset the drawer state when crossing the mobile/desktop breakpoint.
      const mq = window.matchMedia(MOBILE_QUERY);
      const onChange = () => setExpanded(false);
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);

      initSmoothScroll();
    },
    close,
    toggle
  };
})();
