/* ==========================================================================
   editor.js - Monaco Editor loader + reusable code Workbench
   --------------------------------------------------------------------------
   DS.Editor    : loads Monaco from CDN (with a plain-textarea fallback) and
                  manages the editor theme.
   DS.Workbench : builds the full "editor + toolbar + console" panel used by
                  both the experiment workspace and the Tools playground.
   ========================================================================== */
(function () {
  "use strict";
  const DS = window.DS;
  const CFG = window.APP_CONFIG;

  let monacoPromise = null;
  const liveEditors = new Set(); // for theme switching

  function injectMonacoEnvironment(base) {
    // Documented workaround so Monaco's language workers load correctly from a CDN.
    // `base` points at the `vs` folder; the worker's `baseUrl` must be its parent.
    const workerBase = base.replace(/\/vs\/?$/, "/");
    window.MonacoEnvironment = {
      getWorkerUrl() {
        const proxy = "self.MonacoEnvironment={baseUrl:'" + workerBase + "'};" +
          "importScripts('" + base + "/base/worker/workerMain.js');";
        return "data:text/javascript;charset=utf-8," + encodeURIComponent(proxy);
      }
    };
  }

  function loadMonaco() {
    if (monacoPromise) return monacoPromise;
    monacoPromise = new Promise((resolve) => {
      if (window.monaco) return resolve(window.monaco);
      const base = CFG.cdn.monacoBase;
      injectMonacoEnvironment(base);
      const script = document.createElement("script");
      script.src = CFG.cdn.monacoLoader;
      script.onload = () => {
        if (!window.require) return resolve(null);
        try {
          window.require.config({ paths: { vs: base } });
          window.require(["vs/editor/editor.main"], () => resolve(window.monaco), () => resolve(null));
        } catch (_) { resolve(null); }
      };
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
    return monacoPromise;
  }

  function themeName() {
    return DS.storage.get(CFG.storageKeys.editorTheme, "dark") === "light" ? "vs" : "vs-dark";
  }

  DS.Editor = {
    loadMonaco,

    /** Create an editor inside `container`. Resolves to a small handle. */
    async create(container, opts = {}) {
      const monaco = await loadMonaco();

      if (!monaco) {
        // Graceful fallback: a styled textarea keeps the feature usable.
        const ta = DS.el("textarea", { class: "editor-fallback", spellcheck: "false", "aria-label": "Code editor (basic mode)" });
        ta.value = opts.value || "";
        container.appendChild(ta);
        return {
          fallback: true,
          getValue: () => ta.value,
          setValue: (v) => { ta.value = v; },
          setLanguage: () => {},
          format: () => {},
          focus: () => ta.focus(),
          dispose: () => ta.remove()
        };
      }

      const editor = monaco.editor.create(container, {
        value: opts.value || "",
        language: opts.language || "plaintext",
        theme: themeName(),
        automaticLayout: true,
        fontSize: 14,
        lineHeight: 21,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        tabSize: 4,
        insertSpaces: true,
        padding: { top: 12, bottom: 12 },
        wordWrap: "on",
        smoothScrolling: true,
        formatOnPaste: true,
        formatOnType: true,
        bracketPairColorization: { enabled: true },
        roundedSelection: true,
        renderLineHighlight: "all",
        fixedOverflowWidgets: true
      });
      liveEditors.add(editor);

      return {
        fallback: false,
        monaco,
        raw: editor,
        getValue: () => editor.getValue(),
        setValue: (v) => editor.setValue(v),
        setLanguage: (lang) => { try { monaco.editor.setModelLanguage(editor.getModel(), lang); } catch (_) {} },
        format: () => { try { return editor.getAction("editor.action.formatDocument").run(); } catch (_) { return Promise.resolve(); } },
        focus: () => editor.focus(),
        dispose: () => { liveEditors.delete(editor); editor.dispose(); }
      };
    },

    getTheme() { return DS.storage.get(CFG.storageKeys.editorTheme, "dark"); },

    setTheme(theme) {
      DS.storage.set(CFG.storageKeys.editorTheme, theme);
      const monaco = window.monaco;
      if (monaco) monaco.editor.setTheme(theme === "light" ? "vs" : "vs-dark");
      DS.$$(".editor-surface").forEach((s) => s.classList.toggle("is-light", theme === "light"));
      return theme;
    },

    toggleTheme() { return this.setTheme(this.getTheme() === "dark" ? "light" : "dark"); }
  };

  /* ======================================================================= *
   *  DS.Workbench - editor + toolbar + console in one reusable component
   * ======================================================================= */
  function lineEl(line) {
    const level = line.level || "log";
    const cls = level === "error" ? "line line-err"
      : level === "warn" ? "line line-warn"
        : level === "sys" ? "line line-sys"
          : level === "muted" ? "line line-muted"
            : level === "ok" ? "line line-ok"
              : level === "return" ? "line line-ok" : "line";
    const prefix = level === "error" ? "✖ " : level === "warn" ? "⚠ " : level === "sys" ? "» " : "";
    return DS.el("span", { class: cls, text: prefix + line.text });
  }

  DS.Workbench = {
    /**
     * @param {HTMLElement} mount  Container element for the whole workbench.
     * @param {object} cfg
     *   language, value, filename, recordedOutput, recordedLabel
     */
    async create(mount, cfg = {}) {
      const state = {
        original: cfg.value || "",
        language: cfg.language || "python",
        recorded: cfg.recordedOutput || "",
        recordedShown: false,
        outputImage: cfg.outputImage || "",
        outputLabel: cfg.outputLabel || "Expected output (recorded during the lab)"
      };

      /* ---- Build toolbar + editor surface ---- */
      const fileChip = DS.el("span", { class: "file-chip", title: cfg.filename || "", html:
        '<i data-lucide="file-code-2"></i><span class="file-name">' + DS.escapeHtml(cfg.filename || "untitled") + "</span>" });

      const btnCopy = DS.el("button", { class: "btn btn-secondary btn-sm", type: "button", "data-act": "copy", html: '<i data-lucide="copy"></i> Copy' });
      const btnReset = DS.el("button", { class: "btn btn-secondary btn-sm", type: "button", "data-act": "reset", html: '<i data-lucide="rotate-ccw"></i> Reset' });
      const btnFormat = DS.el("button", { class: "btn btn-ghost btn-sm", type: "button", "data-act": "format", html: '<i data-lucide="align-left"></i> Format' });
      const btnTheme = DS.el("button", { class: "btn btn-ghost btn-sm", type: "button", "data-act": "theme", "aria-label": "Toggle editor theme",
        html: '<i data-lucide="' + (DS.Editor.getTheme() === "dark" ? "sun" : "moon") + '"></i> Theme' });
      const btnRun = DS.el("button", { class: "btn btn-primary btn-sm", type: "button", "data-act": "run", html: '<i data-lucide="play"></i> Run code' });

      const toolbar = DS.el("div", { class: "editor-toolbar" }, [fileChip, btnFormat, btnTheme, btnCopy, btnReset, btnRun]);

      const loader = DS.el("div", { class: "editor-loading" }, [
        DS.el("span", { class: "spinner" }), DS.el("span", { text: "Loading editor…" })
      ]);
      const editorSurface = DS.el("div", { class: "editor-surface" });
      const monacoContainer = DS.el("div", { class: "monaco-container" });
      editorSurface.append(loader, monacoContainer);
      const editorCard = DS.el("section", { class: "card editor-card" }, [toolbar, editorSurface]);

      /* ---- Console panel ---- */
      const status = DS.el("span", { class: "status", "data-state": "idle", id: "console-status" }, [
        DS.el("i", { "data-lucide": "circle" }), DS.el("span", { class: "status-text", text: "Idle" })
      ]);
      const btnRuntime = DS.el("button", { class: "btn btn-ghost btn-sm", type: "button", "data-act": "runtime", title: "Configure the external code execution service",
        html: '<i data-lucide="settings-2"></i> Runtime' });
      const btnRecorded = DS.el("button", { class: "btn btn-ghost btn-sm", type: "button", "data-act": "recorded", html: '<i data-lucide="clipboard-list"></i> Recorded output' });
      const btnClear = DS.el("button", { class: "btn btn-ghost btn-sm", type: "button", "data-act": "clear", html: '<i data-lucide="eraser"></i> Clear' });
      const consoleHead = DS.el("div", { class: "console-head" }, [
        DS.el("span", { class: "panel-title", html: '<i data-lucide="terminal"></i> Console' }),
        status,
        DS.el("span", { class: "spacer" }), btnRuntime, btnRecorded, btnClear
      ]);
      const output = DS.el("pre", { class: "console-output", id: "console-output", tabindex: "0", "aria-live": "polite", "aria-label": "Program output" });

      /* Result / figure panel: shows rendered matplotlib figures (live run)
         or the recorded output image, so every run produces something visible. */
      const resultLabel = DS.el("span", { class: "console-result-label", text: "Output" });
      const resultHead = DS.el("div", { class: "console-result-head" }, [
        DS.el("i", { "data-lucide": "image" }),
        DS.el("span", { class: "panel-title", style: "margin:0", text: "Result" }),
        resultLabel
      ]);
      const resultBody = DS.el("div", { class: "console-result-body" });
      const resultPanel = DS.el("section", { class: "console-result", hidden: "hidden" }, [resultHead, resultBody]);

      const consoleCard = DS.el("section", { class: "card console-card" }, [consoleHead, output, resultPanel]);

      mount.append(editorCard, consoleCard);
      DS.refreshIcons();

      /* ---- Console helpers ---- */
      function clearConsole() { output.textContent = ""; }
      function writeLines(lines) {
        lines.forEach((l) => output.appendChild(lineEl(typeof l === "string" ? { text: l } : l)));
        output.scrollTop = output.scrollHeight;
      }
      function setStatus(st, label) {
        status.dataset.state = st;
        status.querySelector(".status-text").textContent = label;
      }
      /** Render one or more figures (data URLs or asset paths) in the result panel. */
      function showImages(sources, label) {
        resultBody.innerHTML = "";
        const list = (sources || []).filter(Boolean);
        if (!list.length) { resultPanel.hidden = true; return; }
        list.forEach((src, idx) => {
          const fig = DS.el("figure", { class: "console-figure" });
          const img = DS.el("img", { alt: "Program output figure " + (idx + 1), loading: "lazy" });
          img.addEventListener("error", () => { fig.remove(); if (!resultBody.children.length) resultPanel.hidden = true; });
          img.src = src;
          fig.appendChild(img);
          resultBody.appendChild(fig);
        });
        resultLabel.textContent = label || state.outputLabel;
        resultPanel.hidden = false;
      }
      function clearImages() { resultBody.innerHTML = ""; resultPanel.hidden = true; }
      function showRecorded() {
        clearConsole();
        setStatus("idle", "Recorded output");
        writeLines([
          { level: "sys", text: (cfg.recordedLabel || "Expected output recorded in the lab") + ":" },
          { level: "muted", text: "—".repeat(48) }
        ]);
        writeLines(state.recorded.split("\n").filter((l, i, a) => !(l === "" && i === a.length - 1)).map((text) => ({ level: "log", text })));
        if (state.outputImage) showImages([state.outputImage], state.outputLabel);
      }

      /* ---- Create editor ---- */
      const editor = await DS.Editor.create(monacoContainer, { value: state.original, language: state.language });
      loader.remove();
      if (editor.fallback) {
        DS.toast("Monaco Editor could not load from the CDN. A basic text editor is being used instead.", "warn", "Editor fallback");
      }

      /* ---- Toolbar actions ---- */
      async function doRun() {
        const code = editor.getValue();
        const capability = DS.Runner.capability(state.language);
        clearConsole();
        clearImages();

        if (!code.trim()) {
          setStatus("error", "Empty");
          writeLines([{ level: "error", text: "There is no code to run." }]);
          return;
        }

        setStatus("running", "Running…");
        const banner = [{ level: "sys", text: "Running " + state.language + " code…" }];
        writeLines(banner);

        const onProgress = (msg) => {
          clearConsole();
          writeLines(banner.concat([{ level: "muted", text: msg }]));
        };

        const result = await DS.Runner.run(state.language, code, { onProgress });
        const lines = [];
        let figures = [];
        let figureLabel = state.outputLabel;

        if (result.mode === "browser") {
          (result.lines || []).forEach((l) => lines.push(l));
          if (!lines.length && result.ok) lines.push({ level: "muted", text: "(no output)" });
        } else if (result.mode === "pyodide" && !result.unavailable) {
          if (result.stdout) result.stdout.replace(/\n$/, "").split("\n").forEach((t) => lines.push({ level: "log", text: t }));
          if (result.stderr) result.stderr.replace(/\n$/, "").split("\n").forEach((t) => lines.push({ level: "error", text: t }));
          if (!lines.length) lines.push({ level: "muted", text: "(no output)" });
          figures = result.images || [];
          if (figures.length) {
            figureLabel = "Figure output from this run (matplotlib, rendered in your browser)";
          } else if (!result.ok && state.outputImage) {
            figures = [state.outputImage];
            figureLabel = state.outputLabel;
            lines.push({ level: "muted", text: "" });
            lines.push({ level: "sys", text: "Showing the output recorded during the lab for comparison." });
          }
          lines.push({ level: "sys", text: "— finished (in-browser Python · Pyodide) —" });
        } else if (result.mode === "external" && !result.unavailable) {
          if (result.stdout) result.stdout.replace(/\n$/, "").split("\n").forEach((t) => lines.push({ level: "log", text: t }));
          if (result.stderr) result.stderr.replace(/\n$/, "").split("\n").forEach((t) => lines.push({ level: "error", text: t }));
          if (!lines.length) lines.push({ level: "muted", text: "(no output)" });
          lines.push({ level: "sys", text: "— finished with exit code " + result.exitCode + " —" });
        } else {
          // Honest reporting when no runnable runtime is available.
          clearConsole();
          setStatus("error", "Runtime not configured");
          writeLines([
            { level: "warn", text: state.language + " could not be executed here." },
            { level: "muted", text: capability === "none"
              ? "In-browser Python (Pyodide) is turned off and no external service is configured. Open the \u201cRuntime\u201d button above to enable one, or see the README."
              : "The runtime could not be started or reached (offline, blocked, or it rejected the request). Check the Runtime settings." }
          ]);
          if (state.recorded) {
            writeLines([{ level: "muted", text: "" }, { level: "sys", text: "Showing the output recorded during the lab instead:" }]);
            state.recorded.split("\n").forEach((t) => lines.push({ level: "log", text: t }));
          }
          if (state.outputImage) figures = [state.outputImage];
        }

        writeLines(lines);
        if (figures.length) showImages(figures, figureLabel);

        const failed = result.mode === "browser" ? !result.ok
          : result.mode === "pyodide" ? (result.unavailable || !result.ok)
            : (result.stderr && !result.ok) || result.unavailable;
        setStatus(failed ? "error" : "success", failed ? "Finished with errors" : "Success");
      }

      toolbar.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        const act = btn.dataset.act;
        if (act === "copy") {
          const code = editor.getValue();
          try {
            await navigator.clipboard.writeText(code);
            DS.toast("Code copied to the clipboard.", "success");
          } catch (_) {
            // Fallback for browsers/contexts without the async clipboard API.
            const ta = DS.el("textarea", {}, []); ta.value = code;
            document.body.appendChild(ta); ta.select();
            try { document.execCommand("copy"); DS.toast("Code copied to the clipboard.", "success"); }
            catch (e2) { DS.toast("Copy failed - please select and copy manually.", "error"); }
            ta.remove();
          }
        }
        if (act === "reset") {
          editor.setValue(state.original);
          clearConsole();
          setStatus("idle", "Reset to original");
          DS.toast("Editor reset to the original code.", "info");
        }
        if (act === "format") { await editor.format(); }
        if (act === "theme") {
          const next = DS.Editor.toggleTheme();
          btn.innerHTML = '<i data-lucide="' + (next === "dark" ? "sun" : "moon") + '"></i> Theme';
          DS.refreshIcons();
        }
        if (act === "run") { await doRun(); }
      });

      consoleHead.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        if (btn.dataset.act === "clear") { clearConsole(); clearImages(); setStatus("idle", "Cleared"); }
        if (btn.dataset.act === "runtime") { DS.Runtime.openSettings(); }
        if (btn.dataset.act === "recorded") {
          if (!state.recorded) { DS.toast("No recorded output is available for this item.", "warn"); return; }
          showRecorded();
        }
      });

      // Show the recorded output once so a student sees the expected result.
      if (state.recorded) showRecorded(); else setStatus("idle", "Ready");

      return {
        editor,
        run: doRun,
        clear: () => { clearConsole(); clearImages(); },
        setCode: (code, { resetOriginal = false } = {}) => {
          editor.setValue(code);
          if (resetOriginal) state.original = code;
          if (state.recorded) showRecorded();
        },
        setLanguage: (lang) => { state.language = lang; editor.setLanguage(lang); },
        setRecorded: (text, label) => { state.recorded = text || ""; cfg.recordedLabel = label; },
        setFilename: (name) => { fileChip.querySelector(".file-name").textContent = name || "untitled"; fileChip.title = name || ""; },
        dispose: () => editor.dispose()
      };
    }
  };
})();
