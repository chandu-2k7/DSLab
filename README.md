# Data Science Laboratory — Interactive Digital Lab Record

A complete, responsive, **frontend-only** digital lab-record website for the course
**Data Science Laboratory** (Subject Code **220DS24**), built with plain **HTML5, CSS3
and vanilla JavaScript (ES6+)**. There is no backend, no build step and no framework —
just open a folder in a browser.

Every experiment loads its **real Python source code** from the student's `DS-codes`
folders into a full code editor (Monaco) inside the page, with an info panel, a
demonstration-video area and a Run button.

| Student profile | |
|---|---|
| Name | E. Vidya Sagar |
| Roll No | 24102A030024 |
| Branch | Data Science |
| Professor | S. Bosu Babu |
| Subject Code | 220DS24 |

---

## Features

- **Home page** — two-column hero (project intro + student profile card), live stats
  (modules / experiments / sub-experiments / code examples computed from the data),
  quick-access cards, Modules preview, Experiments preview, Quick Tools section and a
  proper footer.
- **Navigation** — collapsible hamburger sidebar (icons + labels when expanded), a
  mobile overlay drawer closable by overlay click or **Escape**, active-page highlight,
  smooth in-page scrolling, keyboard focus states, `aria` attributes.
- **Experiments** — all **7 experiments / 30 sub-experiments** driven by one JS data
  file (`js/data.js`), not hard-coded HTML. Listing page, detail page with breadcrumb,
  Overview button, side-by-side sub-experiment switching, and **deep-linkable URLs**
  (`experiment-details.html?experiment=1&sub=1a`). Back/forward history works.
- **Workspace** (experiment detail) — info panel with aim / problem statement /
  algorithm / input / expected output / sample I/O, a demonstration-video area with a
  **bundled sample clip for every sub-experiment** (`assets/videos/exp-*.webm`), the
  **Monaco editor** (dark by default, syntax highlighting, line numbers) with Copy /
  Reset / Run / Clear, editable, language-aware, and correct source per sub-experiment.
- **Run code that genuinely works** — JavaScript runs in a **sandboxed Web Worker**
  (no DOM access, forced timeout). **Python runs for real in the page** through
  **Pyodide (WebAssembly)**: numpy, pandas, matplotlib, seaborn, openpyxl and sqlite3
  execute in your browser and **matplotlib figures are rendered into the Result panel**
  (this is how Experiment 5's line / bar / histogram / scatter / box plots are produced).
  C / Java can still use the optional external service (see *Code execution*), and
  nothing is ever faked: if a runtime is unavailable the site shows the output recorded
  during the lab, including its figure, instead of pretending the code ran.
- **Modules** — five study modules, each opening a **PDF modal** (inline iframe preview,
  View PDF in a new tab, Download PDF, Close). An **Add Module** form validates input,
  catches duplicate module numbers, stores metadata in `localStorage` and the chosen PDF
  in **IndexedDB**, and lets you delete your own modules.
- **Tools page** — JavaScript Code Playground (Monaco + sandboxed worker), JSON
  Formatter/Validator, Text-to-CSV converter, Basic Calculator and a Console/Clear tool.
- **Centralised config & assets** — all paths and feature flags live in `js/config.js`;
  graceful handling when an image, video or PDF is missing; zero dead `href="#"` links;
  clean browser console; semantic HTML, focus management and `prefers-reduced-motion`
  support.

---

## Project structure

```
DS-project/
├── index.html                  Home (hero, student profile, stats, quick access)
├── experiments.html            Experiment listing (7 real experiments)
├── experiment-details.html     Workspace: info panel, video area, Monaco editor, Run
├── modules.html                Study modules + PDF viewer + Add Module form
├── tools.html                  Code playground, JSON, CSV, calculator, console
├── css/
│   ├── style.css               Base theme, cards, hero, layout, footer
│   ├── responsive.css          Mobile/tablet behaviour, sidebar drawer, overflow
│   └── editor.css              Monaco workbench, toolbar, console panel
├── js/
│   ├── config.js               Paths, CDN URLs, video manifest, execution flags, storage keys
│   ├── data.js                 MODULES + EXPERIMENTS (all 30 sub-experiments) content
│   ├── code-samples.js         AUTO-GENERATED offline fallback copies of the sources
│   ├── utils.js                Shared helpers (DOM, toast, modal, focus trap, storage)
│   ├── layout.js               Shared shell: sidebar, topbar, footer
│   ├── navigation.js           Drawer, hamburger toggle, smooth scrolling, active state
│   ├── runner.js               Worker sandbox + external (Piston) execution + Runtime dialog
│   ├── editor.js               Monaco loader + reusable code workbench (Copy/Reset/Run/Clear)
│   ├── modules.js              Module cards, PDF modal, Add Module (localStorage + IndexedDB)
│   ├── experiments.js          Experiment cards, details page, sub-experiment switching
│   ├── tools.js                The five utility tools
│   └── app.js                  Bootstraps each page
├── assets/
│   ├── images/                 logo.svg, avatar.svg, hero-illustration.svg
│   ├── icons/                  pdf.svg and friends
│   ├── pdfs/                   module-1..5.pdf  (valid but PLACEHOLDER — replace)
│   ├── videos/                 exp-*.webm — sample clip per sub-experiment
│   └── outputs/                exp-*.png — result image per sub-experiment
├── DS-codes/                   ORIGINAL student code — never modified
│   ├── FromOnline_exp1/ FromLocal/ Exp_2…Exp_7/   ← untouched originals
│   └── experiment-1..7/                            ← mapped copies the editor uses
├── tools/
│   ├── generate-code-samples.mjs  Regenerates js/code-samples.js (Node, no deps)
│   ├── export-data.mjs            Dumps js/data.js as JSON for build tools
│   └── generate-sample-media.py   Regenerates assets/videos + assets/outputs
└── README.md
```

> **`DS-codes/` is the student's own work.** The website only ever **reads** two things
> from it: the mapped copies under `DS-codes/experiment-1..7/` and, when reachable, the
> originals. It never writes to or overwrites any file in `DS-codes/`.
> Extra mapped folder `experiment-6` contains 7 files to match the 7 sub-experiments of
> Experiment 6.

---

## Run it locally

The site must be served over **HTTP(S)**. Opening `index.html` directly with
`file://` works for layout but the browser blocks `fetch`/iframes, so live source
loading and inline PDF previews need a server (the site falls back to embedded code
samples and offers View/Download PDF buttons instead).

From the project root:

```bash
# Option A — Python (any recent version)
python -m http.server 8765
# then open  http://127.0.0.1:8765   (or http://localhost:8765)

# Option B — Node
npx serve . -l 8765
# then open  http://localhost:8765

# Option C — VS Code "Live Server" extension, right-click index.html → Open with Live Server
```

Regenerate the offline code fallback after changing mapped sources:

```bash
node tools/generate-code-samples.mjs    # requires Node 18+, no dependencies
```

Regenerate the sample videos and result images (after editing source/output text):

```bash
python tools/generate-sample-media.py    # needs Node + numpy, pillow, opencv-python, matplotlib, pandas
```

---

## How to replace / add content

### Module PDFs
1. Create the real PDF (any valid PDF file).
2. **Easy path:** overwrite one of `assets/pdfs/module-1.pdf` … `module-5.pdf`
   (names already match the modules in `js/data.js`).
3. **Named path:** put `my-notes.pdf` in `assets/pdfs/`, then in `js/data.js` set that
   module's `pdf: "assets/pdfs/my-notes.pdf"`.
4. Students can also attach extra modules themselves with the **Add Module** form on
   `modules.html` (stored in this browser only — see *Storage limits*).

### Experiments & sub-experiments
Everything lives in **`js/data.js` → `EXPERIMENTS`**. Each experiment object has an
`id`, `number`, `title`, `objective`, `description`, `concepts`, `outcome`,
`image` and a `subExperiments` array. Each sub-experiment has:

```js
{
  id: "2a",                    // used in the URL: ?experiment=2&sub=2a
  title: "…",
  problem: "…",                // shown in Overview / info panel
  aim: "…",
  algorithm: ["step 1", …],
  input: "…",
  expectedOutput: "…",
  sampleI/O: [["in", "out"], …],
  source: "DS-codes/experiment-2/2a.py",   // file the editor loads
  video: "assets/videos/exp-2a.webm",       // sample clip; absent → placeholder
  recordedOutput: "…",         // optional text block showing the student's true run
  outputImage: "assets/outputs/exp-2a.png"  // optional; defaults to exp-<id>.png
}
```

Add/remove entries and the home stats, listing cards and detail page update
automatically. Sub-experiment switching is driven by the URL query
(`?experiment=N&sub=XY`), so links are shareable.

### Code mappings (editor sources)
1. Copy a lab program into `DS-codes/experiment-N/` (it is already there for all 30
   sub-experiments).
2. Point the sub-experiment's `source` at it from `js/data.js`.
3. Re-run `node tools/generate-code-samples.mjs` so direct `file://` opening keeps
   working.
4. The editor sets its language from the file extension (`.py` → python, `.c` → c,
   `.java` → java, etc.).

### Demonstration videos
A **sample clip is bundled for every one of the 30 sub-experiments**
(`assets/videos/exp-1a.webm` … `exp-7c.webm`). Each clip types out the real source
and then shows the recorded output; for Experiment 5 it shows the actual chart.
They are generated (no screen capture needed) by `tools/generate-sample-media.py`
and linked from each sub-experiment's `video` field, with
`js/config.js → videos.available = "auto"`.

To use your own footage: record a ~15 second VS Code clip and **overwrite** the
matching file (or point the sub-experiment's `video` field at your file). Nothing
else needs changing. If a file is missing, the video area falls back to a labelled
placeholder — the browser console stays clean.

### Result images
`assets/outputs/exp-<id>.png` holds one result image per sub-experiment — the real
matplotlib/seaborn **chart** for Experiment 5, otherwise a console snapshot of the
recorded output. The code editor shows it in the **Result** panel, so pressing
**Run** always produces something visible. Regenerate them together with the videos:

```bash
python tools/generate-sample-media.py    # needs Node, numpy, pillow, opencv-python, matplotlib, pandas
```

Set `js/config.js → outputs.available` to `""` to disable the fallback image, or give
a sub-experiment its own `outputImage` field in `js/data.js` to override it.

### Images
Replace the SVGs in `assets/images/` (or point `defaults.experimentImage` in
`js/config.js` at a new file). Keep filenames or update paths in `js/data.js`.

---

## Code execution

Three runtimes are wired in, and the runner picks the right one automatically:

1. **JavaScript** — runs locally in a **sandboxed Web Worker** (no DOM, 6 s timeout).
2. **Python — in the browser (default)** — **Pyodide** (CPython compiled to
   WebAssembly) runs the lab code for real: `numpy`, `pandas`, `matplotlib`,
   `sqlite3`, `requests`, plus `seaborn` and `openpyxl` installed from PyPI with
   micropip. **matplotlib figures are captured and shown in the Result panel**, so
   Experiment 5 really draws its plots in your browser. Network reads
   (`pd.read_csv("https://…")`, `requests.get`) are enabled via `pyodide-http`, and the
   lab's own sample data files are copied into Python's virtual filesystem so the
   file-I/O experiments work too.
   - First run downloads the runtime (~30 MB) from jsDelivr; the browser caches it
     afterwards. The console shows progress while it loads.
   - Configure it in `js/config.js → execution.pyodide` (or toggle it in the editor's
     **Runtime** dialog). Set `enabled: false` to fall back to the external service.
3. **External service (optional, for C / Java)** — defaults to the public **Piston**
   API (`https://emkc.org/api/v2/piston/execute`), **disabled by default** because it is
   rate-limited and often returns **HTTP 401 without an API key**.

- Open any experiment → press **Runtime** in the editor toolbar to toggle in-browser
  Python or enter an external endpoint and token. Settings live in `localStorage` on
  that machine only; nothing is hard-coded in the source.
- If a runtime cannot start (offline, disabled, blocked), the editor shows a clear
  explanation and displays the output — **including the figure** — recorded during the
  lab. **It never fakes a run or mislabels output.**

> Keep in mind that any token you type is stored in the browser and therefore visible
> to anyone using that browser.

---

## Browser-storage limits

- **`localStorage`** (added module metadata, editor theme, sidebar state, runtime
  settings): roughly **5 MB** per site.
- **IndexedDB** (the PDF files you attach to added modules): hundreds of MB in
  practice, but it is per-browser and can be evicted by the browser under storage
  pressure.
- All of this is **per browser and per machine** — it is not a server, it is not a
  "cloud share", and clearing site data removes it. Built-in modules/experiments are
  not affected because they are static files.

---

## Deploy / static hosting

Fully static — no build step. Upload the whole folder as-is to any static host:

- **GitHub Pages / Netlify / Vercel / Cloudflare Pages**: point at the folder (for
  GitHub Pages, push the folder's contents to the published branch).
- Keep the relative paths intact (all paths are relative to the site root).
- Serving over HTTPS matters for optional nicer PDF previews; the inline fixture works
  over plain HTTP too.

---

## Known limitations

- **CDN libraries** Monaco Editor and Lucide icons load from jsDelivr/unpkg, so a first
  visit needs internet. If Monaco fails to load, the editor falls back to a plain
  textarea and Copy/Reset/Run/Clear still work.
- **Inline PDF preview** uses an iframe; some browsers (especially with `file://`)
  refuse to render PDFs inline — the **View PDF** / **Download PDF** buttons cover this.
- **Module PDFs are valid but placeholder** documents until the official module notes
  are supplied.
- **Sample videos are generated** demonstration clips (not screen recordings); overwrite
  any `assets/videos/exp-*.webm` with your own footage when available.
- **In-browser Python needs internet on first use** to download the Pyodide runtime and,
  for seaborn/openpyxl, the wheels from PyPI. After that the browser caches them. If the
  CDN is unreachable, the editor shows the recorded output (and figure) instead.
- Parts of Experiments 1–2 and 7 that read from the internet depend on the remote host's
  CORS policy; if a request is blocked the traceback is shown along with the recorded
  result. C / Java still need the optional external service.
- Web Worker sandboxing means JS playground code has **no DOM access** and `fetch`
  inside the sandbox may be blocked by CORS (`alert`, `document`, … are unavailable).
- Added modules are browser-local and not shared between devices.

---

## Quality checks performed

Automated browser tests (CDP + headless Chrome) confirmed: no console errors on any
page; 36+ functional checks for the editor worker, JSON/CSV/calculator, PDF modal,
add-module validation + a real-PDF add through the file input, sub-experiment
switching, back/forward navigation, sidebar toggle, mobile drawer and overflow — all
passing. `aria` states, Escape-to-close, focus traps and reduced-motion styles are
included.

The Pyodide integration was verified end-to-end in headless Chrome: **all 30
sub-experiments run** (28 produce console text, the 5 Experiment-5 programs each render
a matplotlib figure), the Run button displays figures in the Result panel, the sample
`.webm` clips load, and every page reports **zero console/page errors**.