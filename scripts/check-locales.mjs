// Reports translation keys present in English but missing (or still identical
// to English) in the other locales. Exit code 1 when anything is missing.
//   node scripts/check-locales.mjs            summary
//   node scripts/check-locales.mjs --list     every missing key path
//   node scripts/check-locales.mjs --dump hi  missing English values as JSON
//
// Every available locale covers common, site and caseStudy. The 13 review locales also
// carry a data dictionary (locales/xx/data.json, keyed by a hash of each
// English data string — see lib/i18n/dataDictionary.ts); translations for them
// are written as line files and merged with scripts/i18n/lines.mjs.
import { existsSync, readFileSync } from "node:fs";

const CORE = ["hi", "bn", "ta"];
const REVIEW = ["as", "gu", "kn", "kok", "mai", "ml", "mr", "ne", "or", "pa", "sd", "te", "ur"];
// Listed as "Coming soon" in lib/i18n/config.ts: not selectable, so not checked until translated.
const SOON = ["brx", "dgo", "ks", "mni", "sa", "sat"];
const args = process.argv.slice(2);
const only = args.find((a) => /^[a-z]{2,3}$/.test(a) && a !== "--dump");
const LOCALES = only ? [only] : [...CORE, ...REVIEW];

// Proper nouns and codes that legitimately stay the same in every language.
const SAME_OK = /^(Saathi|UIDAI · DigiLocker|साथी|UMANG|DigiLocker|UPI|Aadhaar|Bhashini|API Setu|CPGRAMS|PM-KISAN|PMMVY|PMAY-G|MGNREGA|PFMS|Knot|Atelier|eChallan|Sarathi|Vahan|NTA|SSC|RTO|ITMS|e-KYC|₹[\d,.]+.*|[\d.,:%+\-–\s/]+|[A-Z]{2,}[-\d]*|[A-Z0-9]+(-[A-Z0-9]+)+|#[0-9A-F]{6}|https?:\/\/.*|\/prototype.*|\/.*|.{0,2}|\{[a-z]+\}.*)$/;

// Keys whose value is meant to be identical in every language (IDs, app names,
// the code-switched research quote, links, the multilingual phrase set).
const SAME_KEYS = /^(hero\.secondary|ai\.demo\.(ask|doneRef)|pillars\.items\[\d\]\.(word|name|href)|languages\.phrases?(\..*)?|trust\.receipt\.(ref|amount)|problem\.(apps|quote).*|flows\.hrefs.*|me\.cscList\[\d\]\.distance|stats\.items\[\d\]\.value|footer\.sources\[\d\]\.url|rails\.figures\[\d\]\.(value|source)|journey\.items\[\d\]\.(year|target)|console\.colours.*|.*\.hex)$/;

function walk(en, other, path, out) {
  if (Array.isArray(en)) {
    if (!Array.isArray(other)) return out.push({ path, value: en });
    en.forEach((v, i) => walk(v, other[i], `${path}[${i}]`, out));
    return;
  }
  if (en && typeof en === "object") {
    for (const k of Object.keys(en)) walk(en[k], other?.[k], path ? `${path}.${k}` : k, out);
    return;
  }
  if (typeof en !== "string") return;
  if (other === undefined || (other === en && !SAME_OK.test(en.trim()) && !SAME_KEYS.test(path))) out.push({ path, value: en });
}

const read = (p) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {});

const hash = (s) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
};
const dataSource = read("scripts/i18n/data-source.json");

let total = 0;
const dumpLocale = args[0] === "--dump" ? args[1] : null;
const dump = {};

for (const loc of LOCALES) {
  const files = ["common", "site", "caseStudy"];
  for (const file of files) {
    const missing = [];
    walk(read(`locales/en/${file}.json`), read(`locales/${loc}/${file}.json`), "", missing);
    total += missing.length;
    if (!dumpLocale) console.log(`${loc}/${file}.json: ${missing.length} missing`);
    if (args.includes("--list")) missing.forEach((m) => console.log(`  ${m.path}`));
    if (dumpLocale === loc) dump[file] = Object.fromEntries(missing.map((m) => [m.path, m.value]));
  }
  if (REVIEW.includes(loc) && Array.isArray(dataSource)) {
    const dict = read(`locales/${loc}/data.json`);
    const missing = dataSource.filter((s) => !dict[hash(s)] && !SAME_OK.test(s.trim()));
    total += missing.length;
    if (!dumpLocale) console.log(`${loc}/data.json: ${missing.length} missing`);
    if (args.includes("--list")) missing.forEach((s) => console.log(`  ${hash(s)}\t${s}`));
    if (dumpLocale === loc) dump.data = Object.fromEntries(missing.map((s) => [hash(s), s]));
  }
}

if (dumpLocale) console.log(JSON.stringify(dump, null, 1));
else console.log(`total missing: ${total}`);
process.exit(total > 0 && !dumpLocale ? 1 : 0);
