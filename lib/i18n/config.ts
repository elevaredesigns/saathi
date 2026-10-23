/**
 * Locale configuration for Saathi.
 *
 * Saathi is designed for English plus all 22 languages of the Eighth Schedule
 * of the Constitution of India. Four are "core": every screen, the website,
 * the case study and Saathi AI's scripts were authored in them. Thirteen more
 * ("review") cover every surface as machine-assisted translations marked for
 * native-speaker review before any real use. The remaining six ("soon") are
 * listed so people can see they are planned, but can't be picked yet.
 *
 * We deliberately do NOT use next-intl's URL-based routing: locale is held in
 * React state (I18nProvider), persisted in localStorage, and message files are
 * loaded on demand — a visitor downloads only the language they choose.
 */
export const locales = [
  "en", "hi", "bn", "ta",
  "as", "brx", "dgo", "gu", "kn", "ks", "kok", "mai", "ml", "mni", "mr", "ne", "or", "pa", "sa", "sat", "sd", "te", "ur",
] as const;
export type Locale = (typeof locales)[number];

/** Languages every surface (site, case study, AI scripts) was written in. */
export const coreLocales = ["en", "hi", "bn", "ta"] as const;
export type CoreLocale = (typeof coreLocales)[number];
export const isCoreLocale = (l: Locale): l is CoreLocale => (coreLocales as readonly string[]).includes(l);

export const defaultLocale: Locale = "en";

export type Script = "latn" | "deva" | "beng" | "taml" | "telu" | "gujr" | "knda" | "mlym" | "orya" | "guru" | "arab-nastaliq" | "arab-naskh" | "mtei";

export interface LocaleInfo {
  code: Locale;
  /** Name in English */
  label: string;
  /** Endonym — the language's name in its own script */
  native: string;
  /** Two-or-so letters for the compact language chip */
  short: string;
  /** A greeting, shown in the onboarding picker */
  greeting: string;
  script: Script;
  /** <html> class that selects the right font + leading for the script */
  langClass: string;
  dir: "ltr" | "rtl";
  /** CSS variable of the script's body face — renders each endonym in its own type */
  fontVar: string;
  /** CSS variable of the script's display face */
  displayVar: string;
  /** Tag for speech synthesis and date formatting */
  bcp47: string;
  /** core: authored · review: machine-assisted, awaiting review · soon: listed, not yet selectable */
  tier: "core" | "review" | "soon";
}

const SCRIPT_FONTS: Record<Script, { langClass: string; fontVar: string; displayVar: string }> = {
  latn: { langClass: "lang-en", fontVar: "--font-geist", displayVar: "--font-geist" },
  deva: { langClass: "lang-hi", fontVar: "--font-noto-deva", displayVar: "--font-anek-deva" },
  beng: { langClass: "lang-bn", fontVar: "--font-noto-beng", displayVar: "--font-anek-bangla" },
  taml: { langClass: "lang-ta", fontVar: "--font-noto-taml", displayVar: "--font-anek-tamil" },
  telu: { langClass: "lang-te", fontVar: "--font-noto-telu", displayVar: "--font-anek-telu" },
  gujr: { langClass: "lang-gu", fontVar: "--font-noto-gujr", displayVar: "--font-anek-gujr" },
  knda: { langClass: "lang-kn", fontVar: "--font-noto-knda", displayVar: "--font-anek-knda" },
  mlym: { langClass: "lang-ml", fontVar: "--font-noto-mlym", displayVar: "--font-anek-mlym" },
  orya: { langClass: "lang-or", fontVar: "--font-noto-orya", displayVar: "--font-anek-orya" },
  guru: { langClass: "lang-pa", fontVar: "--font-noto-guru", displayVar: "--font-anek-guru" },
  "arab-nastaliq": { langClass: "lang-ur", fontVar: "--font-nastaliq", displayVar: "--font-nastaliq" },
  "arab-naskh": { langClass: "lang-naskh", fontVar: "--font-naskh", displayVar: "--font-naskh" },
  mtei: { langClass: "lang-mni", fontVar: "--font-noto-mtei", displayVar: "--font-noto-mtei" },
};

type Entry = Omit<LocaleInfo, "code" | "langClass" | "fontVar" | "displayVar" | "bcp47" | "dir"> & { bcp47?: string; dir?: "rtl" };

const ENTRIES: Record<Locale, Entry> = {
  en: { label: "English", native: "English", short: "EN", greeting: "Hello", script: "latn", tier: "core", bcp47: "en-IN" },
  hi: { label: "Hindi", native: "हिन्दी", short: "हि", greeting: "नमस्ते", script: "deva", tier: "core" },
  bn: { label: "Bengali", native: "বাংলা", short: "বা", greeting: "নমস্কার", script: "beng", tier: "core" },
  ta: { label: "Tamil", native: "தமிழ்", short: "த", greeting: "வணக்கம்", script: "taml", tier: "core" },
  as: { label: "Assamese", native: "অসমীয়া", short: "অ", greeting: "নমস্কাৰ", script: "beng", tier: "review" },
  brx: { label: "Bodo", native: "बड़ो", short: "ब", greeting: "खुलुमबाय", script: "deva", tier: "review" },
  dgo: { label: "Dogri", native: "डोगरी", short: "डो", greeting: "नमस्ते", script: "deva", tier: "review" },
  gu: { label: "Gujarati", native: "ગુજરાતી", short: "ગુ", greeting: "નમસ્તે", script: "gujr", tier: "review" },
  kn: { label: "Kannada", native: "ಕನ್ನಡ", short: "ಕ", greeting: "ನಮಸ್ಕಾರ", script: "knda", tier: "review" },
  ks: { label: "Kashmiri", native: "کٲشُر", short: "ک", greeting: "آداب", script: "arab-naskh", tier: "review", dir: "rtl" },
  kok: { label: "Konkani", native: "कोंकणी", short: "कों", greeting: "नमस्कार", script: "deva", tier: "review" },
  mai: { label: "Maithili", native: "मैथिली", short: "मै", greeting: "प्रणाम", script: "deva", tier: "review" },
  ml: { label: "Malayalam", native: "മലയാളം", short: "മ", greeting: "നമസ്കാരം", script: "mlym", tier: "review" },
  mni: { label: "Manipuri", native: "ꯃꯤꯇꯩꯂꯣꯟ", short: "ꯃ", greeting: "ꯈꯨꯔꯨꯝꯖꯔꯤ", script: "mtei", tier: "review" },
  mr: { label: "Marathi", native: "मराठी", short: "म", greeting: "नमस्कार", script: "deva", tier: "review" },
  ne: { label: "Nepali", native: "नेपाली", short: "ने", greeting: "नमस्ते", script: "deva", tier: "review" },
  or: { label: "Odia", native: "ଓଡ଼ିଆ", short: "ଓ", greeting: "ନମସ୍କାର", script: "orya", tier: "review" },
  pa: { label: "Punjabi", native: "ਪੰਜਾਬੀ", short: "ਪੰ", greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", script: "guru", tier: "review" },
  sa: { label: "Sanskrit", native: "संस्कृतम्", short: "सं", greeting: "नमो नमः", script: "deva", tier: "review" },
  sat: { label: "Santali", native: "संताली", short: "सं", greeting: "जोहार", script: "deva", tier: "review" },
  sd: { label: "Sindhi", native: "سنڌي", short: "س", greeting: "ڀلي ڪري آيا", script: "arab-naskh", tier: "review", dir: "rtl" },
  te: { label: "Telugu", native: "తెలుగు", short: "తె", greeting: "నమస్కారం", script: "telu", tier: "review" },
  ur: { label: "Urdu", native: "اردو", short: "ار", greeting: "آداب", script: "arab-nastaliq", tier: "review", dir: "rtl" },
};

export const localeMeta = Object.fromEntries(
  locales.map((code) => {
    const e = ENTRIES[code];
    return [code, { ...e, code, ...SCRIPT_FONTS[e.script], dir: e.dir ?? "ltr", bcp47: e.bcp47 ?? `${code}-IN` }];
  }),
) as Record<Locale, LocaleInfo>;

/** Every distinct <html> script class, so switching can clear them all. */
export const LANG_CLASSES = Array.from(new Set(Object.values(SCRIPT_FONTS).map((f) => f.langClass)));

const byLabel = (a: Locale, b: Locale) => ENTRIES[a].label.localeCompare(ENTRIES[b].label);

/** Languages a person can switch to today. */
export const isAvailableLocale = (l: Locale) => ENTRIES[l].tier !== "soon";
export const availableLocales: Locale[] = locales.filter(isAvailableLocale);
/** Planned languages, shown as "Coming soon" but not selectable. */
export const soonLocales: Locale[] = locales.filter((l) => !isAvailableLocale(l)).sort(byLabel);

/** The app's language list: core four first, then the other available ones and the planned ones, each alphabetically by English name. */
export const orderedLocales: Locale[] = [...coreLocales, ...availableLocales.filter((l) => !isCoreLocale(l)).sort(byLabel), ...soonLocales];

export const LOCALE_STORAGE_KEY = "saathi.locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** A saved or requested locale that can actually be switched to. */
export function isSelectableLocale(value: string | null | undefined): value is Locale {
  return isLocale(value) && isAvailableLocale(value);
}
