/* ==========================================================================
   generate-code-samples.mjs
   --------------------------------------------------------------------------
   Regenerates js/code-samples.js from the mapped source files inside
   DS-codes/experiment-1 .. experiment-7.

   Why this exists
   ---------------
   The Lab website normally loads each experiment's source from DS-codes/
   through the web server. When the site is opened directly with file://
   (where the browser blocks fetch of local files), the editor falls back to
   the embedded copy in js/code-samples.js. Keep that copy in sync by running:

       node tools/generate-code-samples.mjs

   from the project root. The original student files in DS-codes/ are only
   read, never modified.

   No third-party packages are required - this uses the Node standard library.
   ========================================================================== */

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const codesDir = join(root, "DS-codes");
const outFile = join(root, "js", "code-samples.js");

function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

/** Collect every readable file under an experiment folder (one level deep). */
function collectExperimentFiles(expDir, expName) {
  const out = [];
  for (const entry of readdirSync(expDir).sort()) {
    const full = join(expDir, entry);
    if (!isDir(full) && /\.py$/i.test(entry)) {
      out.push({ key: "DS-codes/" + expName + "/" + entry, full });
    }
  }
  return out;
}

function main() {
  if (!isDir(codesDir)) {
    console.error("Cannot find DS-codes/ next to tools/. Run this from the project root.");
    process.exit(1);
  }

  const expDirs = readdirSync(codesDir)
    .filter((n) => /^experiment-\d+$/i.test(n) && isDir(join(codesDir, n)))
    .sort((a, b) => {
      const na = parseInt(a.replace(/\D+/g, ""), 10);
      const nb = parseInt(b.replace(/\D+/g, ""), 10);
      return na - nb;
    });

  if (!expDirs.length) {
    console.error("No DS-codes/experiment-* folders were found.");
    process.exit(1);
  }

  const entries = [];
  for (const name of expDirs) {
    entries.push(...collectExperimentFiles(join(codesDir, name), name));
  }

  const lines = entries.map(({ key, full }, i) => {
    const content = readFileSync(full, "utf8").replace(/\r\n/g, "\n");
    return "  " + JSON.stringify(key) + ": " + JSON.stringify(content) +
      (i === entries.length - 1 ? "" : ",");
  });

  const header = `/* ==========================================================================
   code-samples.js - Offline fallback copy of every mapped experiment source.
   --------------------------------------------------------------------------
   The editor normally fetches the live file from DS-codes/ through the web
   server. When the page is opened directly with file:// (where fetch is
   blocked by the browser), it falls back to this embedded copy so the code
   still loads. Regenerate it after editing files in DS-codes with:
       node tools/generate-code-samples.mjs
   This file is auto-generated - do not hand-edit.
   ========================================================================== */
`;

  const body = "window.CODE_SAMPLES = {\n" + lines.join("\n") + "\n};\n";
  writeFileSync(outFile, header + body, "utf8");

  console.log(
    "Wrote " + relative(root, outFile).replace(/\\/g, "/") +
    " with " + entries.length + " code sample(s) from " + expDirs.length + " experiment folder(s)."
  );
}

main();
