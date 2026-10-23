/**
 * Eligibility check for every scheme in the prototype, from a few plain answers.
 * Each scheme returns yes / maybe / no with a reason code; the screen shows the
 * reason in the citizen's language. Rules are simplified versions of the public
 * scheme guidelines — the real check happens against official records on apply.
 */

export type AgeBand = "18-40" | "41-59" | "60+";
export type Income = "low" | "mid" | "high";
export type Work = "farmer" | "student" | "business" | "artisan" | "salaried" | "other";

export interface Answers {
  age: AgeBand;
  income: Income;
  work: Work;
  /** Farmland in your name. */
  ownsLand: boolean;
  /** Already owns a pucca (permanent) house. */
  puccaHouse: boolean;
  /** Pregnant, or a baby born in the last year. */
  pregnant: boolean;
  daughterUnder10: boolean;
  /** Pays income tax. */
  taxpayer: boolean;
}

export type Verdict = "yes" | "maybe" | "no";
export interface Result {
  verdict: Verdict;
  /** Key under eligibility.reasons.<schemeId>. */
  reason: string;
}

type Rule = (a: Answers) => Result;
const yes = (reason = "ok"): Result => ({ verdict: "yes", reason });
const maybe = (reason: string): Result => ({ verdict: "maybe", reason });
const no = (reason: string): Result => ({ verdict: "no", reason });

export const RULES: Record<string, Rule> = {
  pmkisan: (a) => (a.work !== "farmer" ? no("notFarmer") : !a.ownsLand ? no("noLand") : a.taxpayer ? no("taxpayer") : yes()),
  pmjay: (a) => (a.income === "low" ? yes() : a.income === "mid" ? maybe("secc") : no("income")),
  pmay: (a) => (a.puccaHouse ? no("hasHouse") : a.income === "high" ? no("income") : yes()),
  jsy: (a) => (!a.pregnant ? no("notPregnant") : a.income === "low" ? yes() : maybe("bpl")),
  sukanya: (a) => (a.daughterUnder10 ? yes() : no("noDaughter")),
  pmmvy: (a) => (a.pregnant ? yes() : no("notPregnant")),
  nsp: (a) => (a.work !== "student" ? no("notStudent") : a.income === "high" ? no("income") : yes()),
  apy: (a) => (a.taxpayer ? no("taxpayer") : a.age !== "18-40" ? no("age") : yes()),
  pmsby: (a) => (a.age === "60+" ? maybe("age70") : yes()),
  ignoaps: (a) => (a.age !== "60+" ? no("age") : a.income === "low" ? yes() : a.income === "mid" ? maybe("bpl") : no("income")),
  mudra: (a) => (a.work === "business" || a.work === "artisan" ? yes() : no("noBusiness")),
  vishwakarma: (a) => (a.work === "artisan" ? yes() : a.work === "business" ? maybe("trades") : no("notArtisan")),
};

export function checkScheme(id: string, a: Answers): Result {
  return RULES[id]?.(a) ?? maybe("unknown");
}

/** Sensible starting answers from what the person told Saathi during onboarding. */
export function answersFromContext(lifeContext: string[]): Answers {
  const has = (t: string) => lifeContext.includes(t);
  const work: Work = has("farmer") ? "farmer" : has("student") ? "student" : "business";
  return {
    age: has("senior") ? "60+" : "18-40",
    income: "low",
    work,
    ownsLand: work === "farmer",
    puccaHouse: !has("home"),
    pregnant: has("newBaby"),
    daughterUnder10: has("newBaby"),
    taxpayer: false,
  };
}

const ORDER: Record<Verdict, number> = { yes: 0, maybe: 1, no: 2 };
export function rankSchemes<T extends { id: string; benefit: number | null }>(schemes: T[], a: Answers) {
  return schemes
    .map((s) => ({ scheme: s, ...checkScheme(s.id, a) }))
    .sort((x, y) => ORDER[x.verdict] - ORDER[y.verdict] || (y.scheme.benefit ?? 0) - (x.scheme.benefit ?? 0));
}
