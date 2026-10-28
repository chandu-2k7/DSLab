/* ==========================================================================
   experiments.js - Experiment cards + the Experiment Details page
   --------------------------------------------------------------------------
   * Cards are generated from APP_DATA.EXPERIMENTS (never hand-written HTML).
   * The details page reads ?experiment=..&sub=.. so the view survives refresh
     and back/forward navigation.
   * Selecting a sub-experiment loads its real source file, its recorded
     output, its video mapping and the Monaco workbench.
   ========================================================================== */
(function () {
  "use strict";
  const DS = window.DS;
  const DATA = window.APP_DATA;

  /* --------------------------- Card rendering ---------------------------- */
  function experimentCard(exp) {
    const count = exp.subExperiments.length;
    const img = exp.image || window.APP_CONFIG.defaults.experimentImage;
    return DS.el("article", { class: "card card-hover exp-card" }, [
      DS.el("div", { class: "card-image" }, [
        DS.el("img", { src: img, alt: "Illustration for experiment " + exp.number, loading: "lazy" })
      ]),
      DS.el("div", { class: "card-body" }, [
        DS.el("div", { class: "card-top" }, [
          DS.el("span", { class: "badge badge-accent", text: "Experiment " + exp.number }),
          DS.el("span", { class: "badge", html: '<i data-lucide="git-branch"></i> ' + count + (count === 1 ? " part" : " parts") })
        ]),
        DS.el("h3", { text: exp.title }),
        DS.el("p", { class: "muted", text: exp.short }),
        DS.el("div", { class: "card-foot" }, [
          DS.el("span", { class: "muted text-sm", text: count + " sub-experiments" }),
          DS.el("a", { class: "btn btn-primary btn-sm", href: "experiment-details.html?experiment=" + exp.id,
            html: '<i data-lucide="play-circle"></i> Open Experiment' })
        ])
      ])
    ]);
  }

  function renderGrids() {
    DS.$$("[data-experiments-grid]").forEach((grid) => {
      const limit = parseInt(grid.dataset.experimentsLimit || "0", 10);
      const list = limit > 0 ? DATA.EXPERIMENTS.slice(0, limit) : DATA.EXPERIMENTS;
      grid.innerHTML = "";
      list.forEach((exp) => grid.appendChild(experimentCard(exp)));
    });
    DS.refreshIcons();
  }

  /* ------------------------- Details page rendering ---------------------- */
  function breadcrumbs(exp) {
    return [
      DS.el("a", { href: "index.html", text: "Home" }),
      DS.el("span", { class: "sep", text: "/" }),
      DS.el("a", { href: "experiments.html", text: "Experiments" }),
      DS.el("span", { class: "sep", text: "/" }),
      DS.el("span", { class: "current", text: "Experiment " + exp.number })
    ];
  }

  function detailHeader(exp) {
    const chips = DS.el("div", { class: "chips" });
    (exp.concepts || []).slice(0, 6).forEach((c) => chips.appendChild(DS.el("span", { class: "badge badge-accent", text: c })));
    return DS.el("section", { class: "card detail-header" }, [
      DS.el("span", { class: "badge badge-success", html: '<i data-lucide="flask-conical"></i> Experiment ' + exp.number }),
      DS.el("h1", { text: exp.title }),
      DS.el("p", { text: exp.description }),
      chips
    ]);
  }

  function buildSubnav(exp, activeSub) {
    const nav = DS.el("div", { class: "subnav", role: "tablist", "aria-label": "Experiment views" });
    const isOverview = !activeSub;
    nav.appendChild(DS.el("button", {
      class: "subnav-btn overview" + (isOverview ? " active" : ""), type: "button", role: "tab",
      "aria-selected": String(isOverview), "data-sub": "",
      html: '<i data-lucide="layout-dashboard"></i> Overview'
    }));
    exp.subExperiments.forEach((sub) => {
      const active = activeSub && sub.id === activeSub.id;
      nav.appendChild(DS.el("button", {
        class: "subnav-btn" + (active ? " active" : ""), type: "button", role: "tab",
        "aria-selected": String(!!active), "data-sub": sub.id,
        title: sub.title, html: DS.escapeHtml(sub.label)
      }));
    });
    return nav;
  }

  function renderOverview(exp) {
    const wrap = DS.el("div", { class: "card card-pad" });
    wrap.appendChild(DS.el("div", { class: "panel-title", html: '<i data-lucide="layout-dashboard"></i> Overview' }));
    wrap.appendChild(DS.el("p", { class: "muted", text: exp.short }));

    const grid = DS.el("div", { class: "info-grid mt-2" });

    grid.appendChild(DS.el("div", { class: "info-block" }, [
      DS.el("h3", { html: '<i data-lucide="target"></i> Objective' }),
      DS.el("p", { class: "muted", text: exp.objective })
    ]));

    grid.appendChild(DS.el("div", { class: "info-block" }, [
      DS.el("h3", { html: '<i data-lucide="boxes"></i> Required concepts' }),
      DS.el("ul", {}, (exp.concepts || []).map((c) => DS.el("li", { text: c })))
    ]));

    grid.appendChild(DS.el("div", { class: "info-block" }, [
      DS.el("h3", { html: '<i data-lucide="graduation-cap"></i> Expected outcome' }),
      DS.el("p", { class: "muted", text: exp.outcome })
    ]));

    const listBlock = DS.el("div", { class: "info-block" }, [
      DS.el("h3", { html: '<i data-lucide="list-ordered"></i> Sub-experiments' })
    ]);
    const list = DS.el("ul", { class: "meta-list" });
    exp.subExperiments.forEach((sub) => {
      list.appendChild(DS.el("li", {}, [
        DS.el("i", { "data-lucide": "chevron-right" }),
        DS.el("span", { html: `<strong>${DS.escapeHtml(sub.label)}</strong> — ${DS.escapeHtml(sub.title)}` })
      ]));
    });
    listBlock.appendChild(list);
    grid.appendChild(listBlock);

    wrap.appendChild(grid);
    wrap.appendChild(DS.el("div", { class: "notice notice-info mt-3" }, [
      DS.el("i", { "data-lucide": "info" }),
      DS.el("span", { html: "Pick a sub-experiment above to open its problem statement, " +
        "recorded output, demonstration video and the live code editor. Source files load from the " +
        "<code>DS-codes/</code> folder." })
    ]));
    return wrap;
  }

  function videoAvailable(path) {
    const avail = window.APP_CONFIG.videos && window.APP_CONFIG.videos.available;
    if (avail === "auto") return true;
    return Array.isArray(avail) && avail.includes(path);
  }

  /* Result image written by tools/generate-sample-media.py:
     the real matplotlib figure for Experiment 5, otherwise a console snapshot. */
  const OUTPUTS_DIR = (window.APP_CONFIG.paths && window.APP_CONFIG.paths.outputs) || "assets/outputs/";
  function resultImageFor(sub) {
    if (sub.outputImage) return sub.outputImage;
    const cfg = window.APP_CONFIG.outputs || {};
    if (cfg.available === "auto") return OUTPUTS_DIR + "exp-" + sub.id + ".png";
    return "";
  }

  function videoPanel(sub) {
    const frame = DS.el("div", { class: "video-frame" });
    const mapped = sub.video || "";
    const expected = mapped || ("assets/videos/exp-" + sub.id + ".webm");

    const placeholder = DS.el("div", { class: "video-placeholder" }, [
      DS.el("i", { "data-lucide": "video-off" }),
      DS.el("strong", { text: "Demonstration clip" }),
      DS.el("p", { html: "A bundled sample clip plays here. To use your own ~15 second VS Code recording, " +
        `replace <code>${DS.escapeHtml(expected)}</code> with your file - no other change is needed.` })
    ]);
    frame.appendChild(placeholder);

    if (mapped && videoAvailable(mapped)) {
      const video = DS.el("video", { controls: true, preload: "metadata", playsinline: true });
      video.src = mapped;
      video.addEventListener("loadeddata", () => { placeholder.remove(); });
      video.addEventListener("error", () => {
        video.remove();
        placeholder.querySelector("strong").textContent = "Video could not be loaded";
      });
      frame.appendChild(video);
    }
    return frame;
  }

  function renderWorkspace(exp, sub) {
    const wrap = DS.el("div", { class: "workspace" });

    /* --- Row: info + video --- */
    const infoCard = DS.el("section", { class: "card card-pad" }, [
      DS.el("div", { class: "panel-head" }, [
        DS.el("div", {}, [
          DS.el("span", { class: "badge badge-accent", text: "Experiment " + sub.label }),
          DS.el("h2", { class: "mt-2", style: "margin-bottom:2px", text: sub.title }),
          DS.el("p", { class: "muted mb-0", text: sub.summary })
        ])
      ]),
      DS.el("div", { class: "info-grid" }, [
        DS.el("div", { class: "info-block" }, [
          DS.el("h3", { html: '<i data-lucide="circle-help"></i> Problem statement' }),
          DS.el("p", { class: "muted", text: sub.problem })
        ]),
        DS.el("div", { class: "info-block" }, [
          DS.el("h3", { html: '<i data-lucide="target"></i> Aim' }),
          DS.el("p", { class: "muted", text: sub.aim })
        ]),
        DS.el("div", { class: "info-block" }, [
          DS.el("h3", { html: '<i data-lucide="list-ordered"></i> Algorithm / procedure' }),
          DS.el("ol", {}, (sub.algorithm || []).map((s) => DS.el("li", { text: s })))
        ]),
        DS.el("div", { class: "info-block" }, [
          DS.el("h3", { html: '<i data-lucide="log-in"></i> Input format' }),
          DS.el("p", { class: "muted", text: sub.inputFormat }),
          DS.el("h3", { html: '<i data-lucide="log-out"></i> Expected output' }),
          DS.el("p", { class: "muted", text: sub.expectedOutput })
        ])
      ]),
      sub.sampleInput ? DS.el("div", { class: "mt-3" }, [
        DS.el("h3", { html: '<i data-lucide="arrow-right-left"></i> Sample input' }),
        DS.el("div", { class: "pre-box", text: sub.sampleInput })
      ]) : null,
      sub.sampleOutput ? DS.el("div", { class: "mt-2" }, [
        DS.el("h3", { html: '<i data-lucide="braces"></i> Sample output' }),
        DS.el("div", { class: "pre-box", text: sub.sampleOutput })
      ]) : null
    ]);

    const videoCard = DS.el("section", { class: "card card-pad" }, [
      DS.el("div", { class: "panel-head" }, [
        DS.el("div", {}, [
          DS.el("div", { class: "panel-title", html: '<i data-lucide="monitor-play"></i> Code demonstration' }),
          DS.el("p", { class: "muted mb-0", text: "Short VS Code walkthrough for " + sub.label + "." })
        ])
      ]),
      videoPanel(sub),
      DS.el("p", { class: "video-caption", html: sub.video
        ? "Mapped video file: <code>" + DS.escapeHtml(sub.video) + "</code>"
        : "No video is mapped for this sub-experiment yet." })
    ]);

    const topGrid = DS.el("div", { class: "workspace-grid" }, [infoCard, videoCard]);
    wrap.appendChild(topGrid);

    /* --- Notes --- */
    const notes = [];
    if (sub.isSample) notes.push("This part includes a clearly-labelled sample implementation.");
    if (sub.note) notes.push(sub.note);
    if (notes.length) {
      wrap.appendChild(DS.el("div", { class: "notice" }, [
        DS.el("i", { "data-lucide": "triangle-alert" }),
        DS.el("span", { text: notes.join(" ") })
      ]));
    }

    /* --- Editor + console (async) --- */
    const mount = DS.el("div", { class: "workspace-editor" }, [
      DS.el("div", { class: "card card-pad" }, [
        DS.el("div", { class: "flex items-center gap-2" }, [DS.el("span", { class: "spinner" }),
          DS.el("span", { class: "muted", text: "Loading source file from " + sub.source + "…" })]),
        DS.el("div", { class: "skeleton mt-2", style: "height:120px" })
      ])
    ]);
    wrap.appendChild(mount);
    DS.refreshIcons();

    DS.loadCode(sub.source).then((res) => {
      mount.innerHTML = "";
      const filename = sub.source.split("/").pop();
      DS.Workbench.create(mount, {
        language: sub.language || "python",
        value: res.code,
        filename: sub.source,
        recordedOutput: sub.recordedOutput || "",
        recordedLabel: "Expected output recorded during the lab",
        outputImage: resultImageFor(sub),
        outputLabel: "Expected output recorded during the lab"
      }).then((wb) => {
        currentWorkbench = wb;
        if (res.source === "embedded") {
          DS.toast("Loaded the embedded copy of " + filename + " (live fetch unavailable).", "info", "Source loaded");
        } else if (res.source === "missing") {
          DS.toast("Source file " + sub.source + " was not found.", "warn");
        }
      });
    });

    return wrap;
  }

  /* --------------------------- Page controller --------------------------- */
  let currentWorkbench = null;
  let currentExp = null;

  function renderDetails(exp, sub) {
    const crumbs = DS.$("#exp-breadcrumbs");
    const view = DS.$("#exp-view");
    if (!view) return;

    if (currentWorkbench) { currentWorkbench.dispose(); currentWorkbench = null; }

    if (crumbs) { crumbs.innerHTML = ""; breadcrumbs(exp).forEach((n) => crumbs.appendChild(n)); }

    view.innerHTML = "";
    view.appendChild(detailHeader(exp));
    view.appendChild(buildSubnav(exp, sub));
    const stage = DS.el("div", { class: "mt-3" });
    view.appendChild(stage);
    stage.appendChild(sub ? renderWorkspace(exp, sub) : renderOverview(exp));

    DS.refreshIcons();
  }

  function currentSubFromUrl(exp) {
    const q = DS.query();
    if (!q.sub || q.sub === "overview") return null;
    return exp.subExperiments.find((s) => s.id.toLowerCase() === q.sub.toLowerCase()) || null;
  }

  function navigate(expId, subId, push) {
    const url = "experiment-details.html?experiment=" + encodeURIComponent(expId) +
      (subId ? "&sub=" + encodeURIComponent(subId) : "");
    if (push) history.pushState({ experiment: expId, sub: subId || null }, "", url);
    const exp = DATA.findExperiment(expId);
    if (!exp) { renderMissing(); return; }
    currentExp = exp;
    const sub = subId ? exp.subExperiments.find((s) => s.id.toLowerCase() === String(subId).toLowerCase()) : null;
    renderDetails(exp, sub);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderMissing() {
    const view = DS.$("#exp-view");
    if (!view) return;
    view.innerHTML = "";
    view.appendChild(DS.el("div", { class: "card empty-state" }, [
      DS.el("i", { "data-lucide": "search-x" }),
      DS.el("h3", { text: "Experiment not found" }),
      DS.el("p", { class: "muted", text: "The experiment you requested does not exist." }),
      DS.el("a", { class: "btn btn-primary mt-2", href: "experiments.html", html: '<i data-lucide="arrow-left"></i> Back to experiments' })
    ]));
    DS.refreshIcons();
  }

  DS.Experiments = {
    renderGrids,

    initDetails() {
      const root = DS.$("#exp-view");
      if (!root) return;

      const q = DS.query();
      const exp = DATA.findExperiment(q.experiment || "1");
      if (!exp) { renderMissing(); return; }
      currentExp = exp;

      // Initial state from the URL (survives refresh / direct links).
      if (q.experiment == null) {
        history.replaceState({ experiment: exp.id, sub: null }, "", "experiment-details.html?experiment=" + exp.id);
      }
      const sub = currentSubFromUrl(exp);
      renderDetails(exp, sub);

      // Event delegation for the overview + sub-experiment buttons.
      document.addEventListener("click", (e) => {
        const btn = e.target.closest(".subnav-btn");
        if (!btn) return;
        const subId = btn.dataset.sub || "";
        navigate(exp.id, subId || null, true);
      });

      window.addEventListener("popstate", () => {
        const e2 = DATA.findExperiment(DS.query().experiment || "1");
        if (!e2) { renderMissing(); return; }
        currentExp = e2;
        renderDetails(e2, currentSubFromUrl(e2));
      });
    }
  };
})();
