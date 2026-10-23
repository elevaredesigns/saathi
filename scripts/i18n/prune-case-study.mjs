// Drops case-study strings no component reads (left over from the first
// version of the page), so they aren't translated 22 times over.
import { readFileSync, writeFileSync } from "node:fs";

const USED = {
  accessibility: ["heading", "items"],
  brand: ["disclaimer"],
  flows: ["heading", "items", "hrefs"],
  lenses: ["heading", "caption", "items", "center"],
  multilingual: ["heading", "tiersLabel", "tiers", "compareAnnotations", "note"],
  personas: ["heading", "items", "tableTitle", "tableCols", "tableRows"],
  principles: ["heading", "items"],
  problem: ["heading", "body", "appsLabel", "apps", "quote", "quoteTranslation", "quoteAttr"],
  reflection: ["heading", "body", "aboutHeading", "aboutBody", "contact", "otherWork", "others"],
  research: ["heading", "body", "personas"],
  umang: ["heading", "intro", "umangLabel", "saathiLabel", "rows", "note"],
  cs: null,
};

for (const loc of process.argv.slice(2)) {
  const p = `locales/${loc}/caseStudy.json`;
  const json = JSON.parse(readFileSync(p, "utf8"));
  const out = {};
  for (const [k, keep] of Object.entries(USED)) {
    if (json[k] === undefined) continue;
    out[k] = keep ? Object.fromEntries(keep.filter((f) => json[k][f] !== undefined).map((f) => [f, json[k][f]])) : json[k];
  }
  writeFileSync(p, JSON.stringify(out, null, 2) + "\n");
  console.log(`pruned ${loc}`);
}
