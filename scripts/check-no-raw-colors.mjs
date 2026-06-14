// Fails if raw colors appear in app/ or components/ outside the allowlist.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOTS = ["app", "components"];
const EXfiles = new Set([
  "app/styles/tokens.generated.css",
  "app/globals.css",
  "app/hero.ts",
  "app/icon.svg",
  "app/apple-icon.svg",
]);
// Legacy files awaiting rewrite — tagged DESIGN-DEBT. Allowed to keep raw colors for now.
const LEGACY = new Set([
  "components/FeatureModal.tsx",   // DESIGN-DEBT: uses gray-300/gray-800 — full DS migration pending
  "components/Modal.tsx",          // DESIGN-DEBT: uses cyan-400 hover — full DS migration pending
  "components/Navigation.tsx",     // DESIGN-DEBT: uses cyan-400/gray-300 — full DS migration pending
]);
const RAW = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|\b(?:bg|text|border|from|via|to|fill|stroke|ring|shadow|decoration|outline|divide)-\[#|\b(?:bg|text|border|from|via|to|fill|stroke|ring|shadow|decoration|outline|divide)-(?:slate|gray|zinc|stone|red|orange|yellow|lime|green|emerald|cyan|sky|blue|indigo|violet|fuchsia|pink|rose|purple)-[0-9]/;
const exts = new Set([".ts", ".tsx", ".css"]);

const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (exts.has(extname(p))) files.push(p);
  }
};
ROOTS.forEach((r) => walk(r));

const offenders = [];
for (const f of files) {
  const rel = f.replaceAll("\\", "/");
  if (EXfiles.has(rel) || LEGACY.has(rel)) continue;
  const txt = readFileSync(f, "utf8");
  txt.split("\n").forEach((line, i) => {
    if (RAW.test(line)) offenders.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`);
  });
}

if (offenders.length) {
  console.error("Raw colors found (use design tokens instead):\n" + offenders.join("\n"));
  process.exit(1);
}
console.log(`Color guard passed (${files.length} files scanned, ${LEGACY.size} legacy files allowlisted).`);
