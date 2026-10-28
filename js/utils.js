/* ==========================================================================
   utils.js - Small shared helpers used across the whole site
   ========================================================================== */
(function () {
  "use strict";

  const DS = (window.DS = window.DS || {});

  /* ---- DOM helpers ------------------------------------------------------ */
  DS.$ = (sel, root = document) => root.querySelector(sel);
  DS.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Create an element with attributes/children in one call. */
  DS.el = function (tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k === "dataset") Object.assign(node.dataset, v);
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    }
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  };

  /** Escape untrusted text before inserting it as HTML. */
  DS.escapeHtml = function (str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  /* ---- Icons (Lucide with graceful fallback) ---------------------------- */
  DS.refreshIcons = function () {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      try {
        window.lucide.createIcons({ attrs: { "stroke-width": 2 } });
        document.documentElement.classList.remove("no-lucide");
        return;
      } catch (_) { /* ignore */ }
    }
    // CDN unavailable: hide decorative icon placeholders so no empty box shows.
    document.documentElement.classList.add("no-lucide");
  };

  /* ---- Storage (safe wrappers) ------------------------------------------ */
  DS.storage = {
    get(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (_) { return false; }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (_) { /* ignore */ }
    }
  };

  /* ---- Misc ------------------------------------------------------------- */
  DS.uid = (prefix = "id") => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  DS.debounce = (fn, wait = 250) => {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };
  DS.formatBytes = (bytes) => {
    if (!bytes && bytes !== 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0, n = bytes;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
  };

  /* ---- Toasts ----------------------------------------------------------- */
  DS.toast = function (message, type = "info", title = "", timeout = 4800) {
    let container = DS.$(".toast-container");
    if (!container) {
      container = DS.el("div", { class: "toast-container", role: "status", "aria-live": "polite" });
      document.body.appendChild(container);
    }
    const titles = { success: "Success", error: "Error", warn: "Notice", info: "Info" };
    const toast = DS.el("div", { class: `toast toast-${type}` }, [
      DS.el("div", { html: `<strong>${DS.escapeHtml(title || titles[type] || "")}</strong><p>${DS.escapeHtml(message)}</p>` }),
      DS.el("button", { class: "toast-close", "aria-label": "Dismiss notification", html: "&times;",
        onClick: () => toast.remove() })
    ]);
    container.appendChild(toast);
    if (timeout) setTimeout(() => toast.remove(), timeout);
    return toast;
  };

  /* ---- Fetch a source file with an offline fallback --------------------- */
  /**
   * Loads a mapped code file. Over http(s) it fetches the live file from
   * DS-codes/. Under file:// (where fetch is blocked) it returns the embedded
   * copy from code-samples.js so the editor still works.
   * @returns {Promise<{code:string, source:'file'|'embedded'|'missing'}>}
   */
  DS.loadCode = async function (path) {
    const embedded = (window.CODE_SAMPLES && window.CODE_SAMPLES[path]) || null;
    if (location.protocol === "file:") {
      return { code: embedded || "// Source file not available.\n", source: embedded ? "embedded" : "missing" };
    }
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { code: await res.text(), source: "file" };
    } catch (_) {
      return { code: embedded || "// Source file not available.\n", source: embedded ? "embedded" : "missing" };
    }
  };

  /* ---- Query string helpers --------------------------------------------- */
  DS.query = function () {
    const params = new URLSearchParams(location.search);
    const out = {};
    params.forEach((v, k) => (out[k] = v));
    return out;
  };

  /* ---- Modal dialog ----------------------------------------------------- */
  /**
   * Opens an accessible modal dialog.
   * @param {{title:string, subtitle?:string, body:string, footer?:string,
   *          size?:'sm'|'lg', onMount?:Function, onClose?:Function}} opts
   * @returns {{close:Function, root:HTMLElement, body:HTMLElement, footer:HTMLElement}}
   */
  DS.openModal = function (opts) {
    const backdrop = DS.el("div", { class: "modal-backdrop", role: "presentation" });
    const modal = DS.el("div", {
      class: "modal" + (opts.size ? " modal-" + opts.size : ""),
      role: "dialog", "aria-modal": "true", "aria-label": opts.title || "Dialog"
    });

    const closeBtn = DS.el("button", {
      class: "modal-close", type: "button", "aria-label": "Close dialog",
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line></svg>'
    });

    const header = DS.el("div", { class: "modal-header" }, [
      DS.el("div", { html: `<h2>${DS.escapeHtml(opts.title || "")}</h2>` +
        (opts.subtitle ? `<p class="modal-sub">${DS.escapeHtml(opts.subtitle)}</p>` : "") }),
      closeBtn
    ]);
    const body = DS.el("div", { class: "modal-body", html: opts.body || "" });
    const footer = DS.el("div", { class: "modal-footer", html: opts.footer || "" });

    modal.append(header, body);
    if (opts.footer) modal.appendChild(footer);
    backdrop.appendChild(modal);

    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      backdrop.classList.remove("open");
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      setTimeout(() => backdrop.remove(), 220);
      if (typeof opts.onClose === "function") opts.onClose();
    }
    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else DS.trapFocus(modal, e);
    }

    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("mousedown", (e) => { if (e.target === backdrop) close(); });
    document.addEventListener("keydown", onKey);

    document.body.appendChild(backdrop);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => backdrop.classList.add("open"));
    setTimeout(() => {
      const firstField = modal.querySelector("input, textarea, select, button:not(.modal-close)");
      (firstField || closeBtn).focus();
    }, 60);

    const handle = { close, root: backdrop, body, footer };
    if (typeof opts.onMount === "function") opts.onMount(handle);
    return handle;
  };

  /* ---- Focus trap used by modals ---------------------------------------- */
  DS.trapFocus = function (container, event) {
    if (event.key !== "Tab") return;
    const focusables = DS.$$(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      container
    ).filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
})();
