/**
 * Translations for data strings (service names, form fields, scheme text…)
 * in the languages beyond the four authored inline. Data objects carry
 * { en, hi, bn, ta }; for any other locale, `loc()` looks the English source
 * up here. Dictionaries are keyed by a short hash of the English text, so a
 * language file stays small and survives new strings being added.
 * They are registered by I18nProvider when a language loads.
 */
import type { Locale } from "./config";

const dictionaries: Partial<Record<Locale, Record<string, string>>> = {};

/** FNV-1a (32-bit) in base 36 — the key for an English source string. */
export function dataKey(english: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < english.length; i++) {
    h ^= english.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

export function registerDataDictionary(locale: Locale, dictionary: Record<string, string>) {
  dictionaries[locale] = dictionary;
}

export function lookupData(locale: Locale, english: string): string | undefined {
  const dict = dictionaries[locale];
  return dict ? dict[dataKey(english)] : undefined;
}
