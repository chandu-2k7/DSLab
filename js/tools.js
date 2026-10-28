/* ==========================================================================
   tools.js - Frontend-only utilities for the Tools page
   --------------------------------------------------------------------------
   1. Code Editor Playground  (JavaScript, sandboxed Web Worker)
   2. JSON Formatter & Validator
   3. Text to CSV Converter
   4. Basic Calculator
   5. Console utility
   Everything runs locally in the browser.
   ========================================================================== */
(function () {
  "use strict";
  const DS = window.DS;

  /* --------------------------- Tab controller ---------------------------- */
  function initTabs() {
    const tabs = DS.$$(".tool-tab");
    const panels = DS.$$(".tool-panel");
    if (!tabs.length) return;

    function activate(name) {
      tabs.forEach((t) => {
        const on = t.dataset.tool === name;
        t.classList.toggle("active", on);
        t.setAttribute("aria-selected", String(on));
      });
      panels.forEach((p) => p.classList.toggle("active", p.dataset.toolPanel === name));
      document.dispatchEvent(new CustomEvent("tool:activate", { detail: { name } }));
    }

    tabs.forEach((t) => t.addEventListener("click", () => activate(t.dataset.tool)));
    // Respect a #hash like tools.html#calculator
    const wanted = (location.hash || "").replace("#", "");
    activate(tabs.some((t) => t.dataset.tool === wanted) ? wanted : tabs[0].dataset.tool);
  }

  /* ======================= 1. Code Editor Playground ===================== */
  function initPlayground() {
    const mount = DS.$("#playground-mount");
    if (!mount) return;
    let started = false;

    async function start() {
      if (started) return;
      started = true;
      mount.innerHTML = "";
      const sample =
        "// JavaScript playground - runs in a sandboxed Web Worker.\n" +
        "// console.log output appears in the Console panel below.\n\n" +
        "const numbers = [3, 1, 4, 1, 5, 9, 2, 6];\n" +
        "const sorted = [...numbers].sort((a, b) => a - b);\n\n" +
        "console.log('Original:', numbers);\n" +
        "console.log('Sorted  :', sorted);\n" +
        "console.log('Sum     :', numbers.reduce((a, b) => a + b, 0));\n" +
        "console.log('Max     :', Math.max(...numbers));\n\n" +
        "const stats = (arr) => ({\n" +
        "  count: arr.length,\n" +
        "  mean: arr.reduce((a, b) => a + b, 0) / arr.length\n" +
        "});\n" +
        "console.log('Stats   :', stats(numbers));\n";
      await DS.Workbench.create(mount, {
        language: "javascript", value: sample, filename: "playground.js"
      });
    }

    // Start immediately (the tab is visible) but also on first activation.
    start();
    document.addEventListener("tool:activate", (e) => { if (e.detail.name === "playground") start(); });
  }

  /* ====================== 2. JSON Formatter / Validator ================== */
  function initJsonTool() {
    const input = DS.$("#json-input");
    if (!input) return;
    const output = DS.$("#json-output");
    const status = DS.$("#json-status");

    function setStatus(msg, ok) {
      status.textContent = msg;
      status.className = "tool-output-status " + (ok ? "ok" : "err");
    }
    function parse() {
      if (!input.value.trim()) throw new Error("Input is empty.");
      return JSON.parse(input.value);
    }

    DS.$("#json-format").addEventListener("click", () => {
      try {
        const obj = parse();
        output.value = JSON.stringify(obj, null, 2);
        setStatus("Valid JSON · formatted.", true);
      } catch (e) { output.value = ""; setStatus("Invalid JSON: " + e.message, false); }
    });

    DS.$("#json-minify").addEventListener("click", () => {
      try {
        const obj = parse();
        output.value = JSON.stringify(obj);
        setStatus("Valid JSON · minified.", true);
      } catch (e) { output.value = ""; setStatus("Invalid JSON: " + e.message, false); }
    });

    DS.$("#json-validate").addEventListener("click", () => {
      try {
        const obj = parse();
        const type = Array.isArray(obj) ? "array" : typeof obj;
        const size = Array.isArray(obj) ? obj.length : Object.keys(obj).length;
        setStatus(`Valid JSON · root is an ${type} with ${size} entr${size === 1 ? "y" : "ies"}.`, true);
      } catch (e) { setStatus("Invalid JSON: " + e.message, false); }
    });

    DS.$("#json-sample").addEventListener("click", () => {
      input.value = JSON.stringify({
        student: "E. Vidya Sagar", roll: "24102A030024", branch: "Data Science",
        subjects: ["220DS24"], marks: { lab: 95, theory: 88 }, active: true
      }, null, 2);
      setStatus("Sample loaded.", true);
    });

    DS.$("#json-copy").addEventListener("click", () => {
      if (!output.value) { setStatus("Nothing to copy - format or minify first.", false); return; }
      copyText(output.value).then((ok) => setStatus(ok ? "Output copied." : "Copy failed.", ok));
    });

    DS.$("#json-clear").addEventListener("click", () => { input.value = ""; output.value = ""; setStatus("", true); });
  }

  /* ====================== 3. Text to CSV Converter ====================== */
  function detectDelimiter(text) {
    const first = (text.split("\n").find((l) => l.trim()) || "");
    const candidates = [["\t", (first.match(/\t/g) || []).length], [",", (first.match(/,/g) || []).length],
      [";", (first.match(/;/g) || []).length], ["|", (first.match(/\|/g) || []).length],
      [" ", (first.match(/ /g) || []).length]];
    candidates.sort((a, b) => b[1] - a[1]);
    return candidates[0][1] > 0 ? candidates[0][0] : ",";
  }

  function csvEscape(value) {
    const v = String(value == null ? "" : value);
    return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }

  function initCsvTool() {
    const input = DS.$("#csv-input");
    if (!input) return;
    const output = DS.$("#csv-output");
    const status = DS.$("#csv-status");
    const delimSel = DS.$("#csv-delim");
    const firstHeader = DS.$("#csv-header");

    function setStatus(msg, ok) { status.textContent = msg; status.className = "tool-output-status " + (ok ? "ok" : "err"); }

    function convert() {
      const text = input.value.replace(/\r\n/g, "\n");
      if (!text.trim()) { output.value = ""; setStatus("Enter some text to convert.", false); return; }

      const map = { tab: "\t", comma: ",", semicolon: ";", pipe: "|", space: " ", newline: "\n" };
      let delim = delimSel.value === "auto" ? detectDelimiter(text) : map[delimSel.value] || ",";

      const rows = text.split("\n").filter((l) => l.length > 0)
        .map((line) => (delim === "\n" ? [line] : line.split(delim).map((c) => c.trim())));
      const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
      output.value = csv;

      const label = delim === "\t" ? "Tab" : delim === "\n" ? "Newline" : `"${delim}"`;
      setStatus(`Converted ${rows.length} row${rows.length === 1 ? "" : "s"} using ${label}` +
        (firstHeader.checked ? " (first row kept as header)." : "."), true);
    }

    DS.$("#csv-convert").addEventListener("click", convert);
    DS.$("#csv-sample").addEventListener("click", () => {
      input.value = "Roll\tName\tMarks\n101\tVidya\t95\n102\tSagar\t88\n103\tKiran\t76";
      delimSel.value = "tab";
      convert();
    });
    DS.$("#csv-copy").addEventListener("click", () => {
      if (!output.value) { setStatus("Nothing to copy yet.", false); return; }
      copyText(output.value).then((ok) => setStatus(ok ? "CSV copied." : "Copy failed.", ok));
    });
    DS.$("#csv-download").addEventListener("click", () => {
      if (!output.value) { setStatus("Nothing to download yet.", false); return; }
      const blob = new Blob([output.value], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = DS.el("a", { href: url, download: "converted.csv" });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      DS.toast("CSV file downloaded.", "success");
    });
  }

  /* ========================= 4. Basic Calculator ========================= */
  function createExpressionEvaluator() {
    // Small recursive-descent parser - no eval(), safe and predictable.
    function tokenize(src) {
      const tokens = [];
      let i = 0;
      while (i < src.length) {
        const c = src[i];
        if (c === " ") { i++; continue; }
        if (/[0-9.]/.test(c)) {
          let num = "";
          while (i < src.length && /[0-9.]/.test(src[i])) num += src[i++];
          if ((num.match(/\./g) || []).length > 1) throw new Error("Malformed number: " + num);
          tokens.push({ type: "num", value: parseFloat(num) });
          continue;
        }
        if ("+-*/%^()".includes(c)) { tokens.push({ type: c }); i++; continue; }
        throw new Error("Unexpected character: " + c);
      }
      return tokens;
    }
    function evaluate(src) {
      const tokens = tokenize(src);
      let pos = 0;
      const peek = () => tokens[pos];
      function parseExpression() {
        let left = parseTerm();
        while (peek() && (peek().type === "+" || peek().type === "-")) {
          const op = tokens[pos++].type;
          const right = parseTerm();
          left = op === "+" ? left + right : left - right;
        }
        return left;
      }
      function parseTerm() {
        let left = parseUnary();
        while (peek() && (peek().type === "*" || peek().type === "/" || peek().type === "%")) {
          const op = tokens[pos++].type;
          const right = parseUnary();
          if ((op === "/" || op === "%") && right === 0) throw new Error("Division by zero");
          left = op === "*" ? left * right : op === "/" ? left / right : left % right;
        }
        return left;
      }
      function parseUnary() {
        if (peek() && (peek().type === "-" || peek().type === "+")) {
          const op = tokens[pos++].type;
          const val = parseUnary();
          return op === "-" ? -val : val;
        }
        return parsePower();
      }
      function parsePower() {
        const base = parsePrimary();
        if (peek() && peek().type === "^") {
          pos++;
          return Math.pow(base, parseUnary()); // right associative
        }
        return base;
      }
      function parsePrimary() {
        const t = peek();
        if (!t) throw new Error("Unexpected end of expression");
        if (t.type === "num") { pos++; return t.value; }
        if (t.type === "(") {
          pos++;
          const val = parseExpression();
          if (!peek() || peek().type !== ")") throw new Error("Missing closing bracket");
          pos++;
          return val;
        }
        throw new Error("Unexpected token: " + (t.type === "num" ? t.value : t.type));
      }
      const result = parseExpression();
      if (pos < tokens.length) throw new Error("Unexpected token after expression");
      if (!isFinite(result)) throw new Error("Result is not finite");
      return result;
    }
    return { evaluate };
  }

  function initCalculator() {
    const display = DS.$("#calc-display");
    if (!display) return;
    const exprEl = display.querySelector(".calc-expr");
    const resultEl = display.querySelector(".calc-result");
    const parser = createExpressionEvaluator();
    let expr = "";

    function update(preview) {
      exprEl.textContent = expr || "0";
      if (preview !== undefined) { resultEl.textContent = preview; return; }
      if (!expr) { resultEl.textContent = ""; return; }
      try { resultEl.textContent = "= " + parser.evaluate(expr); }
      catch (_) { resultEl.textContent = ""; }
    }
    function press(value) {
      if (value === "C") { expr = ""; update(); return; }
      if (value === "back") { expr = expr.slice(0, -1); update(); return; }
      if (value === "=") {
        if (!expr) return;
        try { const v = parser.evaluate(expr); resultEl.textContent = String(v); exprEl.textContent = expr; expr = String(v); }
        catch (e) { resultEl.textContent = "Error: " + e.message; }
        return;
      }
      expr += value;
      update();
    }

    DS.$("#calc-grid").addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-key]");
      if (!btn) return;
      press(btn.dataset.key);
    });

    document.addEventListener("keydown", (e) => {
      const panel = DS.$('[data-tool-panel="calculator"]');
      if (!panel || !panel.classList.contains("active")) return;
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (/^[0-9+\-*/%.()]$/.test(e.key)) { press(e.key); e.preventDefault(); }
      else if (e.key === "Enter") { press("="); e.preventDefault(); }
      else if (e.key === "Backspace") { press("back"); e.preventDefault(); }
      else if (e.key === "Escape") { press("C"); e.preventDefault(); }
    });
    update();
  }

  /* ========================= 5. Console utility ========================= */
  function initConsoleTool() {
    const out = DS.$("#util-console-output");
    const inputEl = DS.$("#util-console-input");
    if (!out || !inputEl) return;

    function append(text, level) {
      const time = new Date().toLocaleTimeString();
      out.appendChild(DS.el("span", { class: "line " + (level === "error" ? "line-err" : level === "sys" ? "line-sys" : ""),
        text: `[${time}] ${text}` }));
      out.scrollTop = out.scrollHeight;
    }
    function submit() {
      const text = inputEl.value.trim();
      if (!text) return;
      append(text, "log");
      inputEl.value = "";
    }
    DS.$("#util-console-log").addEventListener("click", submit);
    inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
    DS.$("#util-console-clear").addEventListener("click", () => { out.textContent = ""; append("Console cleared.", "sys"); });
    DS.$("#util-console-time").addEventListener("click", () => append("Current time: " + new Date().toString(), "log"));
    append("Console ready. Type a message and press Enter.", "sys");
  }

  /* ------------------------------ Shared --------------------------------- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
    }
    return Promise.resolve(legacyCopy(text));
  }
  function legacyCopy(text) {
    const ta = DS.el("textarea", {});
    ta.value = text; document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
    ta.remove();
    return ok;
  }

  DS.Tools = {
    init() {
      if (!DS.$(".tool-tabs")) return;
      initTabs();
      initPlayground();
      initJsonTool();
      initCsvTool();
      initCalculator();
      initConsoleTool();
      DS.refreshIcons();
    }
  };
})();
