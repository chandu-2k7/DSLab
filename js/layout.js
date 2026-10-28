/* ==========================================================================
   layout.js - Renders the shared shell (sidebar, topbar, footer)
   Keeping the shell in one file means every page stays in sync.
   ========================================================================== */
(function () {
  "use strict";
  const DS = window.DS;

  const HAMBURGER_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line>' +
    '<line x1="4" y1="17" x2="20" y2="17"></line></svg>';

  const NAV_ITEMS = [
    { id: "home", label: "Home", icon: "home", href: "index.html" },
    { id: "experiments", label: "Experiments", icon: "flask-conical", href: "experiments.html" },
    { id: "modules", label: "Modules", icon: "library-big", href: "modules.html" },
    { id: "tools", label: "Tools", icon: "wand-sparkles", href: "tools.html" }
  ];

  function activeId() {
    const page = document.body.dataset.page || "home";
    return page === "experiment-details" ? "experiments" : page;
  }

  function buildSidebar() {
    const active = activeId();
    const brand = DS.el("a", { class: "sidebar-brand", href: "index.html" }, [
      DS.el("img", { src: "assets/images/logo.svg", alt: "Data Science Laboratory logo" }),
      DS.el("span", { class: "sidebar-brand-text" }, [
        DS.el("strong", { text: "Data Science Lab" }),
        DS.el("span", { text: "Digital Lab Record" })
      ])
    ]);

    const nav = DS.el("nav", { class: "sidebar-nav", "aria-label": "Primary" });
    NAV_ITEMS.forEach((item) => {
      nav.appendChild(DS.el("a", {
        class: "nav-item" + (item.id === active ? " active" : ""),
        href: item.href,
        "aria-current": item.id === active ? "page" : null,
        title: item.label
      }, [
        DS.el("span", { class: "nav-icon", html: `<i data-lucide="${item.icon}"></i>` }),
        DS.el("span", { class: "nav-label", text: item.label })
      ]));
    });

    const footer = DS.el("div", { class: "sidebar-footer" }, [
      DS.el("strong", { text: "E. Vidya Sagar" }),
      DS.el("span", { text: "Roll No 24102A030024" })
    ]);

    const collapse = DS.el("button", {
      class: "sidebar-collapse", id: "sidebar-collapse", type: "button",
      "aria-label": "Collapse sidebar", html:
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
        '<polyline points="15 6 9 12 15 18"></polyline></svg>'
    });

    return DS.el("aside", { class: "sidebar", id: "sidebar", "aria-label": "Site navigation" }, [
      DS.el("div", { class: "sidebar-header" }, [brand, collapse]),
      nav,
      footer
    ]);
  }

  function buildTopbar() {
    const title = document.body.dataset.title || "Data Science Laboratory";
    const crumb = document.body.dataset.crumb || "Interactive Digital Lab Record";

    return DS.el("header", { class: "topbar" }, [
      DS.el("button", {
        class: "hamburger", id: "hamburger", type: "button",
        "aria-label": "Toggle sidebar navigation", "aria-expanded": "false",
        "aria-controls": "sidebar", html: HAMBURGER_SVG
      }),
      DS.el("div", { class: "topbar-heading" }, [
        DS.el("div", { class: "topbar-title", text: title }),
        DS.el("div", { class: "topbar-crumbs", text: crumb })
      ]),
      DS.el("div", { class: "topbar-actions" }, [
        DS.el("span", { class: "topbar-pill", html: '<i data-lucide="graduation-cap"></i> 220DS24 · Data Science' })
      ])
    ]);
  }

  function buildFooter() {
    return DS.el("footer", { class: "site-footer" }, [
      DS.el("div", { class: "footer-inner" }, [
        DS.el("div", { html: '<strong>Data Science Laboratory</strong> — Interactive Digital Lab Record' }),
        DS.el("div", { text: "E. Vidya Sagar · Roll No 24102A030024 · Branch: Data Science" }),
        DS.el("div", { text: "Professor: S. Bosu Babu · Subject Code: 220DS24" })
      ])
    ]);
  }

  DS.Layout = {
    render() {
      const sidebarRoot = DS.$("#sidebar-root");
      const topbarRoot = DS.$("#topbar-root");
      const footerRoot = DS.$("#footer-root");

      if (sidebarRoot) sidebarRoot.replaceWith(buildSidebar());
      else document.body.prepend(buildSidebar());

      if (topbarRoot) topbarRoot.replaceWith(buildTopbar());
      if (footerRoot) footerRoot.replaceWith(buildFooter());

      // Overlay for the mobile drawer
      const overlay = DS.el("div", { class: "sidebar-overlay", id: "sidebar-overlay", "aria-hidden": "true" });
      document.body.appendChild(overlay);
    }
  };
})();
