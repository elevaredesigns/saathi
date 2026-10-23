import { describe, expect, it } from "vitest";

import bn from "../locales/bn/common.json";
import en from "../locales/en/common.json";
import hi from "../locales/hi/common.json";
import ta from "../locales/ta/common.json";
import { answersFromContext, checkScheme, rankSchemes, RULES, type AgeBand, type Answers, type Income, type Work } from "./eligibility";
import { SCHEMES } from "./mockData";

const base: Answers = answersFromContext([]);

// Every combination of answers, to find every reason a rule can give.
function allAnswers(): Answers[] {
  const out: Answers[] = [];
  const ages: AgeBand[] = ["18-40", "41-59", "60+"];
  const incomes: Income[] = ["low", "mid", "high"];
  const works: Work[] = ["business", "farmer", "student", "artisan", "salaried", "other"];
  const bools = [true, false];
  for (const age of ages) for (const income of incomes) for (const work of works)
    for (const ownsLand of bools) for (const puccaHouse of bools) for (const pregnant of bools) for (const daughterUnder10 of bools) for (const taxpayer of bools)
      out.push({ age, income, work, ownsLand, puccaHouse, pregnant, daughterUnder10, taxpayer });
  return out;
}

describe("eligibility", () => {
  it("has a rule for every scheme in the app", () => {
    for (const s of SCHEMES) expect(RULES[s.id], s.id).toBeTypeOf("function");
  });

  it("explains every possible verdict in English, Hindi, Bengali and Tamil", () => {
    const seen = new Set<string>();
    for (const a of allAnswers()) for (const s of SCHEMES) seen.add(`${s.id}.${checkScheme(s.id, a).reason}`);
    for (const key of Array.from(seen)) {
      const [id, reason] = key.split(".");
      for (const [name, msgs] of Object.entries({ en, hi, bn, ta })) {
        const text = (msgs as { eligibility: { reasons: Record<string, Record<string, string>> } }).eligibility.reasons[id]?.[reason];
        expect(text, `${name}: ${key}`).toBeTruthy();
      }
    }
  });

  it("finds the new-baby schemes for a new parent", () => {
    const a = answersFromContext(["newBaby"]);
    for (const id of ["jsy", "sukanya", "pmmvy"]) expect(checkScheme(id, a).verdict, id).toBe("yes");
  });

  it("gives PM-KISAN only to farmers with land in their name who don't pay tax", () => {
    expect(checkScheme("pmkisan", { ...base, work: "farmer", ownsLand: true }).verdict).toBe("yes");
    expect(checkScheme("pmkisan", { ...base, work: "farmer", ownsLand: false }).reason).toBe("noLand");
    expect(checkScheme("pmkisan", { ...base, work: "farmer", ownsLand: true, taxpayer: true }).reason).toBe("taxpayer");
    expect(checkScheme("pmkisan", { ...base, work: "student" }).verdict).toBe("no");
  });

  it("lists every scheme, qualifying ones first", () => {
    const ranked = rankSchemes(SCHEMES, answersFromContext(["newBaby"]));
    expect(ranked).toHaveLength(SCHEMES.length);
    const order = ranked.map((r) => r.verdict);
    expect(order).toEqual([...order].sort((x, y) => ["yes", "maybe", "no"].indexOf(x) - ["yes", "maybe", "no"].indexOf(y)));
  });
});
