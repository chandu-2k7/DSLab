/* ==========================================================================
   export-data.mjs - Dump APP_DATA.EXPERIMENTS from js/data.js as JSON
   --------------------------------------------------------------------------
   js/data.js is a browser script (it assigns window.APP_DATA). This tiny Node
   helper evaluates it against a fake `window` and prints the EXPERIMENTS array
   as JSON so build/dev tools can consume the *single* source of truth instead
   of duplicating the content.

   Usage:  node tools/export-data.mjs
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.resolve(here, "../js/data.js");
const source = fs.readFileSync(file, "utf8");

// Direct eval sees this local `window` variable that data.js writes to.
const window = {};
eval(source);

if (!window.APP_DATA || !Array.isArray(window.APP_DATA.EXPERIMENTS)) {
  console.error("Could not read APP_DATA.EXPERIMENTS from " + file);
  process.exit(1);
}

process.stdout.write(JSON.stringify(window.APP_DATA.EXPERIMENTS));
