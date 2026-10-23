import { localeMeta, type Locale } from "@/lib/i18n/config";

/** Intl tag per language (falls back to English month names where a runtime lacks the locale). */
const LOCALE_TAG = new Proxy({} as Record<Locale, string>, { get: (_t, l: string) => localeMeta[l as Locale]?.bcp47 ?? "en-IN" });

/** DD MMM YYYY with a localized month name, Latin digits (e.g. "24 मई 2026"). */
export function formatDate(date: string | Date, locale: Locale = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    numberingSystem: "latn",
  }).format(d);
}

/** The prototype's "now" — matches the sample data (status bar reads 9:41). */
export const PROTOTYPE_TODAY = new Date(2026, 4, 24, 9, 41);

/**
 * "Now" inside the demo: the prototype's date with the real time of day, so
 * actions taken during a session land on 24 May 2026 and still sort in order.
 */
export function prototypeNow(): Date {
  const real = new Date();
  const d = new Date(PROTOTYPE_TODAY);
  d.setHours(real.getHours(), real.getMinutes(), real.getSeconds(), real.getMilliseconds());
  return d;
}

/** Weekday + day + month in the reader's language, e.g. "Sunday, 24 May". */
export function formatLongDay(date: Date, locale: Locale = "en"): string {
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    weekday: "long",
    day: "numeric",
    month: "long",
    numberingSystem: "latn",
  }).format(date);
}

/** Day + short month, e.g. "22 May". */
export function formatShortDay(date: string | Date, locale: Locale = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], { day: "numeric", month: "short", numberingSystem: "latn" }).format(d);
}
