// Deep-merges translation patches into locales/<locale>/*.json.
//   node scripts/i18n/apply.mjs te mr …
// A patch is scripts/i18n/<locale>.json (optionally split into
// <locale>.a.json, <locale>.b.json …) with any of:
//   common  → locales/<l>/common.json      (nested, like the English file)
//   console → locales/<l>/common.json .console
//   site    → locales/<l>/site.json
//   caseStudy → locales/<l>/caseStudy.json
//   data    → locales/<l>/data.json         ({ hash: translation })
// Objects merge; strings and arrays replace.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

function merge(base, patch) {
  if (!isObj(base) || !isObj(patch)) return patch;
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) out[k] = isObj(v) && isObj(base[k]) ? merge(base[k], v) : v;
  return out;
}

const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {});
const write = (p, obj) => writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");

for (const loc of process.argv.slice(2)) {
  const parts = readdirSync("scripts/i18n").filter((f) => f === `${loc}.json` || (f.startsWith(`${loc}.`) && f.endsWith(".json") && /^[a-z]+\.[a-z0-9]+\.json$/.test(f)));
  if (!parts.length) {
    console.log(`no patch for ${loc}`);
    continue;
  }
  for (const part of parts.sort()) {
    const patch = read(`scripts/i18n/${part}`);
    const dir = `locales/${loc}`;
    if (patch.common || patch.console) {
      let common = read(`${dir}/common.json`);
      if (patch.common) common = merge(common, patch.common);
      if (patch.console) common = merge(common, { console: patch.console });
      write(`${dir}/common.json`, common);
    }
    if (patch.site) write(`${dir}/site.json`, merge(read(`${dir}/site.json`), patch.site));
    if (patch.caseStudy) write(`${dir}/caseStudy.json`, merge(read(`${dir}/caseStudy.json`), patch.caseStudy));
    if (patch.data) write(`${dir}/data.json`, { ...read(`${dir}/data.json`), ...patch.data });
    console.log(`merged ${part}`);
  }
}
