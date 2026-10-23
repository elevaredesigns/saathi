// Copies values that are identical in every language (reference numbers, the
// multilingual phrase set, the Hindi demo request, prototype links) from
// English into hi / bn / ta wherever they are missing.
import { readFileSync, writeFileSync } from "node:fs";

const PATHS = {
  site: ["hero.secondary", "ai.demo.ask", "ai.demo.doneRef", "languages.phrase", "languages.phrases", "trust.receipt.ref", "trust.receipt.amount"],
  caseStudy: ["flows.hrefs", "problem.apps", "problem.quote"],
};

const get = (obj, path) => path.split(".").reduce((o, k) => o?.[k], obj);
function set(obj, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const parent = keys.reduce((o, k) => (o[k] ??= {}), obj);
  if (parent[last] === undefined) parent[last] = value;
}

for (const [file, paths] of Object.entries(PATHS)) {
  const en = JSON.parse(readFileSync(`locales/en/${file}.json`, "utf8"));
  for (const loc of ["hi", "bn", "ta"]) {
    const p = `locales/${loc}/${file}.json`;
    const json = JSON.parse(readFileSync(p, "utf8"));
    for (const path of paths) if (get(en, path) !== undefined) set(json, path, get(en, path));
    writeFileSync(p, JSON.stringify(json, null, 2) + "\n");
  }
}
console.log("invariants filled");
