/**
 * On-device search across everything a citizen can reach: life moments,
 * services, service tasks and schemes. Matches the active language *and*
 * English, so "PM-KISAN" works from a Hindi screen and "जन्म" finds the birth
 * certificate. Results are titled in the active language.
 */
import type { Locale } from "@/lib/i18n/config";
import { LIFE_MOMENTS, SCHEMES, SERVICES, loc, type L } from "@/lib/mockData";

export type SearchKind = "task" | "scheme" | "service" | "moment";

export interface SearchHit {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

interface Entry {
  kind: SearchKind;
  id: string;
  name: L;
  sub: L;
  keywords: string;
  href: string;
}

/** Lower-case and strip Latin diacritics only (Indic vowel signs must survive). */
const COMBINING_LATIN = new RegExp("[\\u0300-\\u036f]", "g");
const norm = (s: string) => s.normalize("NFD").replace(COMBINING_LATIN, "").toLowerCase().trim();

const KIND_ORDER: Record<SearchKind, number> = { task: 0, scheme: 1, service: 2, moment: 3 };

/** Tasks that duplicate another service's task (same flow) — indexed once. */
const DUPLICATE_TASKS = new Set(["land_tax"]);

let INDEX: Entry[] | null = null;

function buildIndex(): Entry[] {
  const entries: Entry[] = [];
  for (const s of SERVICES) {
    entries.push({ kind: "service", id: s.id, name: s.name, sub: s.blurb, keywords: "", href: `/prototype/service/?id=${s.id}` });
    for (const t of s.tasks) {
      if (DUPLICATE_TASKS.has(t.id)) continue;
      entries.push({ kind: "task", id: t.id, name: t.name, sub: s.name, keywords: "", href: `/prototype/apply/?id=${t.id}` });
    }
  }
  for (const sc of SCHEMES) {
    entries.push({ kind: "scheme", id: sc.id, name: sc.name, sub: sc.desc, keywords: sc.id, href: `/prototype/scheme/?id=${sc.id}` });
  }
  for (const m of LIFE_MOMENTS) {
    const sub = m.services
      .map((id) => SERVICES.find((s) => s.id === id)?.name)
      .filter((n): n is L => !!n);
    const joined = {
      en: sub.map((n) => n.en).join(" · "),
      hi: sub.map((n) => n.hi).join(" · "),
      bn: sub.map((n) => n.bn).join(" · "),
      ta: sub.map((n) => n.ta).join(" · "),
    };
    entries.push({ kind: "moment", id: m.id, name: m.name, sub: joined, keywords: "", href: `/prototype/moment/?id=${m.id}` });
  }
  return entries;
}

export function search(query: string, locale: Locale, limit = 12): SearchHit[] {
  const q = norm(query);
  if (!q) return [];
  INDEX ??= buildIndex();

  const scored: { entry: Entry; score: number }[] = [];
  for (const e of INDEX) {
    const hay = [loc(e.name, locale), e.name.en, e.keywords].map(norm);
    let score = -1;
    for (const h of hay) {
      if (!h) continue;
      if (h.startsWith(q)) score = Math.max(score, 3);
      else if (h.split(/[\s\-·&,]+/).some((w) => w.startsWith(q))) score = Math.max(score, 2);
      else if (h.includes(q)) score = Math.max(score, 1);
    }
    if (score < 0) {
      const sub = [loc(e.sub, locale), e.sub.en].map(norm);
      if (sub.some((h) => h.includes(q))) score = 0;
    }
    if (score >= 0) scored.push({ entry: e, score });
  }

  scored.sort((a, b) => b.score - a.score || KIND_ORDER[a.entry.kind] - KIND_ORDER[b.entry.kind]);

  return scored.slice(0, limit).map(({ entry }) => ({
    kind: entry.kind,
    id: entry.id,
    title: loc(entry.name, locale),
    subtitle: loc(entry.sub, locale),
    href: entry.href,
  }));
}
