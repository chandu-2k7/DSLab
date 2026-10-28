/* ==========================================================================
   runner.js - Safe code execution
   --------------------------------------------------------------------------
   JavaScript  -> runs in a sandboxed Web Worker (no DOM access), with a
                  timeout guard so an infinite loop cannot freeze the page.
   Python      -> runs in the page through Pyodide (WebAssembly); stdout is
                  captured and every matplotlib figure is returned as a PNG.
   Java/C/etc. -> optional external service (Piston). When nothing can run we
                  report it honestly and show the output recorded in the lab
                  instead of pretending the code ran.
   ========================================================================== */
(function () {
  "use strict";
  const DS = window.DS;
  const CFG = window.APP_CONFIG;

  /* Language id used by the external runner -> Piston runtime. */
  const EXTERNAL_LANGS = ["python", "java", "c", "cpp", "csharp", "go", "php", "ruby", "rust"];

  /* -------------------------------------------------------------------- *
   *  DS.Runtime - effective execution settings (config + user overrides)
   * -------------------------------------------------------------------- */
  const RT_KEY = "dslab.execution.v1";
  DS.Runtime = {
    base() { return CFG.execution.external; },
    overrides() { return DS.storage.get(RT_KEY, {}) || {}; },
    settings() { return Object.assign({}, this.base(), this.overrides()); },
    save(partial) { DS.storage.set(RT_KEY, Object.assign({}, this.overrides(), partial)); },
    reset() { DS.storage.remove(RT_KEY); },
    isEnabled() { const s = this.settings(); return !!s.enabled && !!s.endpoint; },
    /** Whether in-browser Python (Pyodide) is allowed. Default comes from config. */
    pyodideEnabled() {
      const o = this.overrides();
      if (typeof o.pyodideEnabled === "boolean") return o.pyodideEnabled;
      return !!(CFG.execution.pyodide && CFG.execution.pyodide.enabled);
    },
    /** Modal that lets the student configure an execution service without editing source. */
    openSettings() {
      const s = this.settings();
      const body = `
        <div class="notice notice-info mb-0" style="margin-bottom:16px">
          <span>Python runs entirely in this page through Pyodide (WebAssembly) - no server needed. Java, C and
          C++ cannot run in a browser, so you can point this app at an online code-execution service (for example
          a self-hosted or paid Piston/Judge0 endpoint). Credentials you enter here are stored only in this browser
          (localStorage) and are <strong>visible to anyone who inspects this page</strong> — never use a secret you
          care about.</span>
        </div>
        <div class="field">
          <label class="flex items-center gap-2" style="gap:8px">
            <input type="checkbox" id="rt-enabled" ${s.enabled ? "checked" : ""} /> Enable external code execution
          </label>
        </div>
        <div class="field">
          <label class="flex items-center gap-2" style="gap:8px">
            <input type="checkbox" id="rt-pyodide" ${this.pyodideEnabled() ? "checked" : ""} /> Run Python in the browser (Pyodide / WebAssembly)
          </label>
          <div class="hint">Runs numpy, pandas, matplotlib and seaborn locally in this page. Needs internet on first use to download the runtime (~30&#8239;MB), then it is cached.</div>
        </div>
        <div class="field">
          <label for="rt-endpoint">Execution endpoint URL</label>
          <input class="input" id="rt-endpoint" type="url" value="${DS.escapeHtml(s.endpoint || "")}" placeholder="https://your-service.example/api/execute" />
          <div class="hint">The service must accept a JSON POST described in the README and allow CORS from this page.</div>
        </div>
        <div class="field">
          <label for="rt-key">API key / bearer token (optional)</label>
          <input class="input" id="rt-key" type="password" value="${DS.escapeHtml(s.apiKey || "")}" placeholder="leave blank if not required" autocomplete="off" />
        </div>`;
      const footer = `
        <button class="btn btn-ghost" type="button" data-rt="reset">Reset to defaults</button>
        <button class="btn btn-primary" type="button" data-rt="save"><i data-lucide="save"></i> Save settings</button>`;
      const handle = DS.openModal({ title: "Code execution runtime", subtitle: "In-browser Python (Pyodide) and an optional external runner", body, footer });
      handle.footer.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-rt]");
        if (!btn) return;
        if (btn.dataset.rt === "reset") { this.reset(); handle.close(); DS.toast("Runtime settings reset.", "info"); return; }
        this.save({
          enabled: handle.body.querySelector("#rt-enabled").checked,
          pyodideEnabled: handle.body.querySelector("#rt-pyodide").checked,
          endpoint: handle.body.querySelector("#rt-endpoint").value.trim(),
          apiKey: handle.body.querySelector("#rt-key").value.trim()
        });
        handle.close();
        DS.toast(this.isEnabled() ? "External execution enabled." : "External execution disabled.", "success");
      });
      return handle;
    }
  };

  const WORKER_SOURCE = `
    // Sandboxed worker: only console + pure JS. No DOM, no page access.
    function formatArg(a) {
      if (typeof a === "string") return a;
      if (a instanceof Error) return a.stack || String(a);
      if (typeof a === "function") return "[function " + (a.name || "anonymous") + "]";
      if (typeof a === "undefined") return "undefined";
      try { return JSON.stringify(a); } catch (e) { return String(a); }
    }
    self.onmessage = function (event) {
      const code = event.data.code;
      const logs = [];
      const emit = (level, args) => logs.push({ level: level, text: Array.prototype.map.call(args, formatArg).join(" ") });
      ["log", "info", "warn", "error", "debug"].forEach(function (name) {
        console[name] = function () { emit(name === "debug" ? "log" : name, arguments); };
      });
      console.clear = function () {};
      console.table = function (data) { emit("log", [data]); };
      try {
        const value = (0, eval)(code);
        if (typeof value !== "undefined") logs.push({ level: "return", text: "=> " + formatArg(value) });
        self.postMessage({ done: true, logs: logs });
      } catch (err) {
        logs.push({ level: "error", text: (err && err.stack) ? err.stack : String(err) });
        self.postMessage({ done: true, logs: logs, failed: true });
      }
    };
  `;

  function runInWorker(code, timeoutMs) {
    return new Promise((resolve) => {
      let workerUrl;
      try {
        workerUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "application/javascript" }));
      } catch (e) {
        resolve({ ok: false, stdout: "", stderr: "Web Worker is unavailable in this browser.", lines: [] });
        return;
      }
      const worker = new Worker(workerUrl);
      let settled = false;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        resolve({
          ok: false, timedOut: true, stdout: "", stderr: "",
          lines: [{ level: "error", text: `Execution stopped: exceeded the ${timeoutMs / 1000}s time limit (possible infinite loop).` }]
        });
      }, timeoutMs);

      worker.onmessage = (event) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        const data = event.data || {};
        const lines = data.logs || [];
        resolve({
          ok: !data.failed,
          lines,
          stdout: lines.filter((l) => l.level !== "error").map((l) => l.text).join("\n"),
          stderr: lines.filter((l) => l.level === "error").map((l) => l.text).join("\n")
        });
      };
      worker.onerror = (event) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        resolve({ ok: false, lines: [], stdout: "", stderr: event.message || "Worker error" });
      };
      worker.postMessage({ code });
    });
  }

  /* -------------------------------------------------------------------- *
   *  In-browser Python via Pyodide (WebAssembly)
   *  numpy / pandas / matplotlib run inside the page, so the Run button
   *  produces real output - including rendered matplotlib figures.
   * -------------------------------------------------------------------- */
  const PY = { instance: null, loading: null };

  function loadScriptOnce(src, marker) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-loader="' + marker + '"]');
      if (existing) {
        if (existing.dataset.loaded === "1") return resolve();
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Could not load " + src)));
        return;
      }
      const s = document.createElement("script");
      s.src = src; s.async = true; s.dataset.loader = marker;
      s.onload = () => { s.dataset.loaded = "1"; resolve(); };
      s.onerror = () => reject(new Error("Could not load " + src));
      document.head.appendChild(s);
    });
  }

  /** Install pure-Python wheels from PyPI using micropip. */
  async function micropipInstall(py, names) {
    if (!names || !names.length) return;
    await py.loadPackage("micropip");
    await py.runPythonAsync("import micropip\nawait micropip.install(" + JSON.stringify(names) + ")\n");
  }

  /** Base64-encode bytes without blowing the call stack on large files. */
  function bytesToBase64(bytes) {
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  /** Copy the lab's own data files into Python's virtual filesystem. */
  async function preloadDataFiles(py) {
    const files = (CFG.execution.pyodide && CFG.execution.pyodide.dataFiles) || [];
    if (!files.length) return;
    // Create missing directories and write bytes via Python (works for any path).
    await py.runPythonAsync([
      "import os, base64",
      "def _lab_write(path, b64):",
      "    d = os.path.dirname(path)",
      "    if d:",
      "        os.makedirs(d, exist_ok=True)",
      "    with open(path, 'wb') as f:",
      "        f.write(base64.b64decode(b64))"
    ].join("\n"));
    for (const f of files) {
      try {
        const res = await fetch(f.url, { cache: "no-store" });
        if (!res.ok) continue;
        const bytes = new Uint8Array(await res.arrayBuffer());
        py.globals.set("_lab_path", f.fs);
        py.globals.set("_lab_b64", bytesToBase64(bytes));
        py.runPython("_lab_write(_lab_path, _lab_b64)");
      } catch (_) { /* best-effort only */ }
    }
  }

  /* Python executed in the page. Captures stdout, turns every open matplotlib
     figure into a base64 PNG, and never lets an exception escape. */
  const PY_HARNESS = [
    "import sys, io, json, base64, traceback",
    "_has_mpl = False",
    "try:",
    "    import matplotlib",
    "    matplotlib.use('Agg')",
    "    import matplotlib.pyplot as plt",
    "    plt.show = lambda *a, **k: None",
    "    _has_mpl = True",
    "except Exception:",
    "    pass",
    "_buf = io.StringIO()",
    "_old = sys.stdout",
    "sys.stdout = _buf",
    "_ok = True",
    "_err = ''",
    "try:",
    "    exec(compile(__USER_CODE__, '<lab>', 'exec'), {'__name__': '__main__'})",
    "except SystemExit:",
    "    pass",
    "except BaseException:",
    "    _ok = False",
    "    _err = traceback.format_exc()",
    "finally:",
    "    sys.stdout = _old",
    "_imgs = []",
    "if _has_mpl:",
    "    for _n in plt.get_fignums():",
    "        try:",
    "            _fig = plt.figure(_n)",
    "            _b = io.BytesIO()",
    "            _fig.savefig(_b, format='png', bbox_inches='tight', dpi=110)",
    "            _imgs.append(base64.b64encode(_b.getvalue()).decode('ascii'))",
    "        except Exception:",
    "            pass",
    "    plt.close('all')",
    "json.dumps({'ok': _ok, 'stdout': _buf.getvalue(), 'stderr': _err, 'images': _imgs})"
  ].join("\n");

  async function getPyodide(onProgress) {
    if (PY.instance) return PY.instance;
    if (PY.loading) return PY.loading;
    const cfg = CFG.execution.pyodide || {};
    const say = (m) => { if (typeof onProgress === "function") onProgress(m); };
    PY.loading = (async () => {
      if (!window.loadPyodide) {
        say("Downloading the Python runtime (Pyodide)… one moment");
        await loadScriptOnce(cfg.loader, "pyodide-loader");
      }
      if (!window.loadPyodide) throw new Error("The Pyodide loader did not become available.");
      say("Starting the Python interpreter…");
      const py = await window.loadPyodide({ indexURL: cfg.indexURL });
      say("Loading numpy, pandas and matplotlib…");
      await py.loadPackage(cfg.packages || []);
      if (cfg.httpPatch) {
        try {
          say("Enabling network reads for pandas…");
          await micropipInstall(py, ["pyodide-http"]);
          py.runPython("import pyodide_http\npyodide_http.patch_all()\n");
        } catch (_) { /* offline/file URLs still work; network parts stay off */ }
      }
      if (cfg.pythonPackages && cfg.pythonPackages.length) {
        try {
          say("Installing " + cfg.pythonPackages.join(", ") + "…");
          await micropipInstall(py, cfg.pythonPackages);
        } catch (_) { /* those imports will raise a clear ImportError if needed */ }
      }
      say("Copying the lab's sample data files…");
      await preloadDataFiles(py);
      PY.instance = py;
      return py;
    })();
    try { return await PY.loading; }
    finally { PY.loading = null; }
  }

  async function runPython(code, onProgress) {
    const py = await getPyodide(onProgress);
    py.globals.set("__USER_CODE__", code);
    const raw = await py.runPythonAsync(PY_HARNESS);
    let data;
    try { data = JSON.parse(raw); } catch (_) { data = { ok: false, stdout: String(raw || ""), stderr: "", images: [] }; }
    return {
      ok: !!data.ok,
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      images: (data.images || []).map((b64) => "data:image/png;base64," + b64),
      lines: []
    };
  }

  async function runExternal(language, code) {
    const cfg = DS.Runtime.settings();
    const runtime = cfg.runtimes[language];
    if (!runtime) throw new Error(`No external runtime is configured for "${language}".`);

    const headers = Object.assign({ "Content-Type": "application/json" }, cfg.requestHeaders || {});
    if (cfg.apiKey) headers["Authorization"] = "Bearer " + cfg.apiKey;

    const res = await fetch(cfg.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        language: runtime.language,
        version: runtime.version || "*",
        files: [{ name: "main", content: code }],
        stdin: ""
      })
    });
    if (!res.ok) throw new Error(`Execution service returned HTTP ${res.status}.`);
    const data = await res.json();
    if (data.message) throw new Error(data.message);
    const compile = data.compile || {};
    const run = data.run || {};
    const stdout = [compile.stdout, run.stdout].filter(Boolean).join("");
    const stderr = [compile.output && !compile.stdout ? compile.output : "", compile.stderr, run.stderr].filter(Boolean).join("");
    return {
      ok: (run.code === 0 || run.code == null) && !stderr,
      stdout,
      stderr,
      exitCode: run.code,
      lines: []
    };
  }

  DS.Runner = {
    /** How can this language be executed? */
    capability(language) {
      if (language === "javascript" || language === "js") return "browser";
      if ((language === "python" || language === "python3") && DS.Runtime.pyodideEnabled()) return "pyodide";
      if (DS.Runtime.isEnabled() && EXTERNAL_LANGS.includes(language)) return "external";
      return "none";
    },

    /** Is the Pyodide runtime already warm in this session? */
    pyodideReady() { return !!PY.instance; },

    /**
     * Execute code and resolve with a normalised result object.
     * @param {string} language
     * @param {string} code
     * @param {{onProgress?:Function}} [opts]
     * @returns {Promise<{ok:boolean, stdout:string, stderr:string, images?:string[], lines?:Array, timedOut?:boolean, mode:string}>}
     */
    async run(language, code, opts = {}) {
      const mode = this.capability(language);
      if (mode === "browser") {
        const result = await runInWorker(code, CFG.execution.jsTimeoutMs);
        return { ...result, mode };
      }
      if (mode === "pyodide") {
        try {
          const result = await runPython(code, opts.onProgress);
          return { ...result, mode };
        } catch (err) {
          return { ok: false, mode, unavailable: true, stdout: "", stderr: "", lines: [], images: [], error: err };
        }
      }
      if (mode === "external") {
        try {
          const result = await runExternal(language, code);
          return { ...result, mode };
        } catch (err) {
          return { ok: false, mode, unavailable: true, stdout: "", stderr: "", lines: [], error: err };
        }
      }
      return { ok: false, mode: "none", stdout: "", stderr: "", lines: [] };
    }
  };
})();
