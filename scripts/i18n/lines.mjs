// Line-based translation workflow for the review-tier locales.
//
//   node scripts/i18n/lines.mjs export
//     Flattens every English string that needs translating into
//     scripts/i18n/src/<part>.txt as "id<TAB>English" (parts: common, console,
//     site, caseStudy, data) and records where each id lives in index.json.
//
//   node scripts/i18n/lines.mjs apply te mr …
//     Reads scripts/i18n/tr/<locale>/<part>.txt ("id<TAB>translation"),
//     checks placeholders, and rebuilds locales/<locale>/*.json with the same
//     shape as English. Values that are identical in every language (codes,
//     links, the multilingual phrase set) are copied from English.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const write = (p, obj) => writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");

// Same in every language: product names kept in Latin script, codes, numbers, links.
const INVARIANT = /^(UMANG|DigiLocker|UPI|Bhashini|API Setu|CPGRAMS|PM-KISAN|PMMVY|PMAY-G|MGNREGA|PFMS|Knot|Atelier|eChallan|Sarathi|Vahan|NTA|SSC|RTO|ITMS|e-KYC|₹[\d,.]+|[\d.,:%+\-–\s/]+|[A-Z]{2,}[-\d]*|[A-Z0-9]+(-[A-Z0-9]+)+|#[0-9A-Fa-f]{6}|https?:\/\/.*|\/.*|.?)$/;
const SAME_KEYS = /^(hero\.secondary|ai\.demo\.(ask|doneRef)|pillars\.items\[\d\]\.(word|name|href)|languages\.phrases?(\..*)?|trust\.receipt\.(ref|amount)|problem\.(apps|quote).*|flows\.hrefs.*|me\.cscList\[\d\]\.distance|stats\.items\[\d\]\.value|footer\.sources\[\d\]\.url|rails\.figures\[\d\]\.(value|source)|journey\.items\[\d\]\.(year|target)|console\.colours.*|.*\.hex)$/;

const isInvariant = (path, value) => SAME_KEYS.test(path) || INVARIANT.test(value.trim());

function leaves(node, path, out) {
  if (Array.isArray(node)) node.forEach((v, i) => leaves(v, `${path}[${i}]`, out));
  else if (node && typeof node === "object") for (const k of Object.keys(node)) leaves(node[k], path ? `${path}.${k}` : k, out);
  else if (typeof node === "string") out.push([path, node]);
  return out;
}

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
const unesc = (s) => s.replace(/\\(n|t|\\)/g, (_, c) => (c === "n" ? "\n" : c === "t" ? "\t" : "\\"));

const PART_FILE = { common: "common", console: "common", site: "site", caseStudy: "caseStudy" };

function sources() {
  const parts = { common: [], console: [], site: [], caseStudy: [], data: [] };
  for (const file of ["common", "site", "caseStudy"]) {
    for (const [path, value] of leaves(read(`locales/en/${file}.json`), "", [])) {
      if (isInvariant(path, value)) continue;
      const part = file === "common" && path.startsWith("console.") ? "console" : file;
      parts[part].push({ path, value });
    }
  }
  const hash = (s) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(36);
  };
  for (const s of read("scripts/i18n/data-source.json")) if (!INVARIANT.test(s.trim())) parts.data.push({ path: hash(s), value: s });
  return parts;
}

// {name} and {count, plural, …} arguments must survive translation.
const args = (s) => [...s.matchAll(/\{(\w+)(?=[,}])/g)].map((m) => m[1]).filter((n, i, a) => a.indexOf(n) === i).sort().join(",");

const [cmd, ...locs] = process.argv.slice(2);

if (cmd === "export") {
  mkdirSync("scripts/i18n/src", { recursive: true });
  const parts = sources();
  for (const [part, items] of Object.entries(parts)) {
    writeFileSync(`scripts/i18n/src/${part}.txt`, items.map((it, i) => `${i + 1}\t${esc(it.value)}`).join("\n") + "\n");
    console.log(`${part}: ${items.length} strings, ${items.reduce((n, it) => n + it.value.length, 0)} chars`);
  }
} else if (cmd === "apply") {
  const parts = sources();
  let failed = false;
  for (const loc of locs) {
    const dir = `scripts/i18n/tr/${loc}`;
    const tr = { common: new Map(), console: new Map(), site: new Map(), caseStudy: new Map(), data: new Map() };
    const problems = [];
    if (existsSync(dir)) {
      for (const f of readdirSync(dir).filter((f) => f.endsWith(".txt")).sort()) {
        const part = f.split(".")[0];
        if (!tr[part]) throw new Error(`${dir}/${f}: unknown part`);
        for (const line of readFileSync(`${dir}/${f}`, "utf8").replace(/^﻿/, "").split(/\r?\n/)) {
          if (!line.trim()) continue;
          const m = line.match(/^(\d+)\t(.*)$/);
          if (!m) {
            problems.push(`${f}: bad line "${line.slice(0, 60)}"`);
            continue;
          }
          const id = Number(m[1]);
          const src = parts[part][id - 1];
          if (!src) {
            problems.push(`${f}: id ${id} out of range`);
            continue;
          }
          // Keep English's leading/trailing spaces (templates that continue inline).
          const value = src.value.match(/^\s*/)[0] + unesc(m[2]).trim() + src.value.match(/\s*$/)[0];
          if (args(src.value) !== args(value)) problems.push(`${part}#${id}: placeholders {${args(src.value)}} ≠ {${args(value)}}`);
          if (!value) problems.push(`${part}#${id}: empty`);
          tr[part].set(src.path, value);
        }
      }
    }

    // Rebuild each JSON file in English's shape.
    for (const file of ["common", "site", "caseStudy"]) {
      const en = read(`locales/en/${file}.json`);
      const prev = existsSync(`locales/${loc}/${file}.json`) ? read(`locales/${loc}/${file}.json`) : {};
      const at = (obj, path) => path.split(/\.|\[(\d+)\]/).filter(Boolean).reduce((o, k) => o?.[k], obj);
      const build = (node, path) => {
        if (Array.isArray(node)) return node.map((v, i) => build(v, `${path}[${i}]`));
        if (node && typeof node === "object") {
          const out = {};
          for (const k of Object.keys(node)) {
            const v = build(node[k], path ? `${path}.${k}` : k);
            if (v !== undefined) out[k] = v;
          }
          return out;
        }
        if (typeof node !== "string") return node;
        const part = file === "common" && path.startsWith("console.") ? "console" : file;
        if (tr[part].has(path)) return tr[part].get(path);
        if (isInvariant(path, node)) return node;
        const old = at(prev, path);
        return typeof old === "string" && old !== node ? old : undefined;
      };
      write(`locales/${loc}/${file}.json`, build(en, ""));
    }
    const dataPath = `locales/${loc}/data.json`;
    const data = existsSync(dataPath) ? read(dataPath) : {};
    for (const [hash, value] of tr.data) data[hash] = value;
    write(dataPath, data);

    const missing = Object.entries(parts).map(([part, items]) => {
      const file = part === "data" ? null : PART_FILE[part];
      const have = file ? leaves(read(`locales/${loc}/${file}.json`), "", []) : null;
      const haveMap = have && new Map(have);
      const n = items.filter((it) => (part === "data" ? !data[it.path] : !haveMap.has(it.path) || (haveMap.get(it.path) === it.value && !isInvariant(it.path, it.value)))).length;
      return `${part} ${n}`;
    });
    console.log(`${loc}: missing ${missing.join(", ")}`);
    if (problems.length) {
      failed = true;
      problems.forEach((p) => console.log(`  ! ${p}`));
    }
  }
  process.exit(failed ? 1 : 0);
} else {
  console.log("usage: lines.mjs export | apply <locale>…");
}
