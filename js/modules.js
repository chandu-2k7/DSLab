/* ==========================================================================
   modules.js - Module cards, PDF viewer modal and Add Module form
   --------------------------------------------------------------------------
   Built-in modules come from data.js. Modules added by the student are kept
   in localStorage (metadata) and IndexedDB (the selected PDF file). This is a
   browser-only store: it lives on THIS computer and THIS browser only.
   ========================================================================== */
(function () {
  "use strict";
  const DS = window.DS;
  const CFG = window.APP_CONFIG;

  /* ------------------------- IndexedDB (PDF files) ----------------------- */
  const IDB = {
    _db: null,
    name: "dslab-files",
    store: "pdfs",
    available() { return typeof indexedDB !== "undefined"; },
    open() {
      if (this._db) return Promise.resolve(this._db);
      return new Promise((resolve, reject) => {
        const req = indexedDB.open(this.name, 1);
        req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(this.store)) req.result.createObjectStore(this.store); };
        req.onsuccess = () => { this._db = req.result; resolve(req.result); };
        req.onerror = () => reject(req.error);
      });
    },
    async put(key, blob) {
      const db = await this.open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.store, "readwrite");
        tx.objectStore(this.store).put(blob, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    },
    async get(key) {
      const db = await this.open();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.store, "readonly");
        const r = tx.objectStore(this.store).get(key);
        r.onsuccess = () => resolve(r.result || null);
        r.onerror = () => reject(r.error);
      });
    },
    async remove(key) {
      const db = await this.open();
      return new Promise((resolve) => {
        const tx = db.transaction(this.store, "readwrite");
        tx.objectStore(this.store).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    }
  };

  /* --------------------------- Module collection ------------------------- */
  function userModules() {
    return DS.storage.get(CFG.storageKeys.modules, []) || [];
  }
  function saveUserModules(list) {
    DS.storage.set(CFG.storageKeys.modules, list);
  }
  function allModules() {
    // Built-in first, then any modules the student added (newest first).
    return [...window.APP_DATA.MODULES, ...userModules().slice().reverse()];
  }
  function findModule(id) {
    return allModules().find((m) => m.id === id) || null;
  }

  /* ------------------------------- Rendering ----------------------------- */
  function moduleCard(mod) {
    const isUser = !!mod.userAdded;

    return DS.el("article", { class: "card card-hover module-card", dataset: { moduleId: mod.id } }, [
      DS.el("div", { class: "card-body" }, [
        DS.el("div", { class: "card-top" }, [
          DS.el("div", { class: "module-num", text: String(mod.number) }),
          DS.el("span", { class: "badge badge-accent", text: "22DS102006" })
        ]),
        DS.el("div", { class: "module-title-wrap" }, [
          DS.el("h3", { text: mod.title }),
          DS.el("div", { class: "module-sub", text: mod.code || ("Module " + mod.number + (isUser ? " · Added by you" : " · Specialization Elective")) })
        ]),
        DS.el("p", { class: "muted", text: mod.description || "" }),
        DS.el("div", { class: "card-foot" }, [
          DS.el("button", { class: "btn btn-primary btn-sm", type: "button",
            "data-action": "open-module", "data-id": mod.id,
            html: '<i data-lucide="book-open"></i> Open module' }),
          isUser
            ? DS.el("button", { class: "btn btn-ghost btn-sm", type: "button",
                "data-action": "delete-module", "data-id": mod.id, title: "Delete this module",
                html: '<i data-lucide="trash-2"></i> Remove' })
            : null
        ])
      ])
    ]);
  }

  function renderGrid(container) {
    const limit = parseInt(container.dataset.modulesLimit || "0", 10);
    const mods = allModules();
    const shown = limit > 0 ? mods.slice(0, limit) : mods;
    container.innerHTML = "";
    shown.forEach((m) => container.appendChild(moduleCard(m)));
    DS.refreshIcons();

    // "Add Module" buttons inside the same section
    const section = container.closest("section") || document;
    const addBtn = section.querySelector("[data-add-module]");
    if (addBtn) addBtn.onclick = openAddModule;
  }

  /* ----------------------------- PDF dialog ------------------------------ */
  async function resolvePdfUrl(mod) {
    if (mod.userAdded && mod.storeKey && IDB.available()) {
      const blob = await IDB.get(mod.storeKey);
      if (blob) return { url: URL.createObjectURL(blob), revoke: true };
    }
    if (mod.pdf) return { url: mod.pdf, revoke: false };
    return null;
  }

  async function openModule(id) {
    const mod = findModule(id);
    if (!mod) return;

    const isFileProtocol = location.protocol === "file:";
    const pdf = await resolvePdfUrl(mod);

    let bodyHtml = "";
    if (pdf) {
      bodyHtml =
        `<iframe class="pdf-frame" title="Preview of ${DS.escapeHtml(mod.title)}" src="${pdf.url}"></iframe>` +
        '<div class="flex items-center justify-between mt-2"><span class="text-sm muted">Official Curriculum Document · Subject Code 22DS102006</span></div>';
    } else {
      bodyHtml =
        '<div class="empty-state" style="padding:28px">' +
        '<i data-lucide="file-x"></i><h3>No PDF document attached</h3>' +
        '<p>This module does not have a PDF document uploaded yet. You can upload a PDF using the "Add Module" button.</p></div>';
    }

    const footerHtml =
      (pdf ? `<button class="btn btn-secondary" type="button" data-action="view-pdf"><i data-lucide="external-link"></i> View PDF</button>
              <button class="btn btn-secondary" type="button" data-action="download-pdf"><i data-lucide="download"></i> Download PDF</button>` : "") +
      `<button class="btn btn-primary" type="button" data-action="close-modal"><i data-lucide="check"></i> Close</button>`;

    const handle = DS.openModal({
      title: `Module ${mod.number} — ${mod.title}`,
      subtitle: mod.description || "",
      body: bodyHtml,
      footer: footerHtml,
      size: "lg",
      onClose: () => { if (pdf && pdf.revoke) URL.revokeObjectURL(pdf.url); }
    });
    DS.refreshIcons();

    handle.footer.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]");
      if (!action) return;
      if (action.dataset.action === "close-modal") handle.close();
      if (action.dataset.action === "view-pdf" && pdf) window.open(pdf.url, "_blank", "noopener");
      if (action.dataset.action === "download-pdf" && pdf) {
        const a = DS.el("a", { href: pdf.url, download: `module-${mod.number}.pdf` });
        document.body.appendChild(a); a.click(); a.remove();
        DS.toast(`Downloading module ${mod.number} PDF.`, "success");
      }
    });
  }

  /* --------------------------- Add Module modal -------------------------- */
  function openAddModule() {
    const bodyHtml = `
      <form id="add-module-form" novalidate>
        <div class="field" data-field="title">
          <label for="am-title">Module title *</label>
          <input class="input" id="am-title" name="title" type="text" placeholder="e.g. Introduction to Data Wrangling" autocomplete="off" />
          <div class="error">Please enter a module title.</div>
        </div>
        <div class="field" data-field="number">
          <label for="am-number">Module number *</label>
          <input class="input" id="am-number" name="number" type="number" min="1" step="1" placeholder="e.g. 6" />
          <div class="error">Enter a unique positive module number.</div>
        </div>
        <div class="field" data-field="description">
          <label for="am-desc">Short description *</label>
          <textarea class="textarea" id="am-desc" name="description" placeholder="One or two lines describing the module."></textarea>
          <div class="error">Please add a short description.</div>
        </div>
        <div class="field" data-field="pdf">
          <label for="am-pdf">Module PDF (optional)</label>
          <input class="input" id="am-pdf" name="pdf" type="file" accept="application/pdf,.pdf" />
          <div class="hint">The PDF is saved inside this browser only (IndexedDB). It is not uploaded anywhere and cannot be shared with other students.</div>
        </div>
      </form>`;

    const footerHtml = `
      <button class="btn btn-ghost" type="button" data-action="cancel">Cancel</button>
      <button class="btn btn-primary" type="button" data-action="save"><i data-lucide="plus"></i> Add module</button>`;

    const handle = DS.openModal({ title: "Add Module", subtitle: "Create a new module card with an optional PDF", body: bodyHtml, footer: footerHtml });

    const form = handle.body.querySelector("#add-module-form");
    const saveBtn = handle.footer.querySelector('[data-action="save"]');

    function setInvalid(name, invalid) {
      const wrap = form.querySelector(`[data-field="${name}"]`);
      if (wrap) wrap.classList.toggle("invalid", invalid);
    }

    async function save() {
      const title = form.title.value.trim();
      const number = form.number.value.trim();
      const description = form.description.value.trim();
      const file = form.pdf.files[0] || null;
      const numberTaken = allModules().some((m) => String(m.number) === number);

      setInvalid("title", !title);
      setInvalid("description", !description);
      setInvalid("number", !number || Number(number) < 1 || numberTaken);

      if (!title || !description || !number || Number(number) < 1 || numberTaken) {
        DS.toast(numberTaken ? "That module number already exists." : "Please complete the required fields.", "error");
        return;
      }
      if (file && file.type && file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
        DS.toast("Please choose a PDF file.", "error");
        setInvalid("pdf", true);
        return;
      }

      saveBtn.disabled = true;
      const module = {
        id: DS.uid("um"),
        number: Number(number),
        title,
        description,
        pdf: null,
        userAdded: true,
        hasPdf: false,
        fileName: file ? file.name : null,
        fileSize: file ? file.size : 0
      };

      try {
        if (file && IDB.available()) {
          const key = "pdf-" + module.id;
          await IDB.put(key, file);
          module.storeKey = key;
          module.hasPdf = true;
        } else if (file) {
          DS.toast("This browser cannot store files, so the PDF was not saved.", "warn");
        }
        const list = userModules();
        list.push(module);
        saveUserModules(list);
        handle.close();
        DS.$$("[data-modules-grid]").forEach(renderGrid);
        DS.toast(`Module "${title}" was added.`, "success");
        // Offer to open it straight away.
        setTimeout(() => openModule(module.id), 260);
      } catch (err) {
        console.error(err);
        DS.toast("Could not save the module: " + (err && err.message ? err.message : "unknown error"), "error");
      } finally {
        saveBtn.disabled = false;
      }
    }

    handle.footer.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]");
      if (!action) return;
      if (action.dataset.action === "cancel") handle.close();
      if (action.dataset.action === "save") save();
    });
    form.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") { e.preventDefault(); save(); } });
  }

  /* --------------------------- Delete user module ------------------------ */
  async function deleteModule(id) {
    const mod = findModule(id);
    if (!mod || !mod.userAdded) return;
    if (!confirm(`Remove the module "${mod.title}"? This cannot be undone.`)) return;
    if (mod.storeKey && IDB.available()) await IDB.remove(mod.storeKey);
    saveUserModules(userModules().filter((m) => m.id !== id));
    DS.$$("[data-modules-grid]").forEach(renderGrid);
    DS.toast("Module removed.", "info");
  }

  /* ------------------------------- Public API ---------------------------- */
  DS.Modules = {
    init() {
      const grids = DS.$$("[data-modules-grid]");
      if (!grids.length) return;
      grids.forEach(renderGrid);

      // Event delegation for all module actions.
      document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const id = btn.dataset.id;
        if (btn.dataset.action === "open-module") openModule(id);
        if (btn.dataset.action === "delete-module") deleteModule(id);
      });
    },
    all: allModules,
    open: openModule,
    add: openAddModule
  };
})();
