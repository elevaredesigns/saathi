"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  NextIntlClientProvider,
  useTranslations,
  type AbstractIntlMessages,
} from "next-intl";

import { deepMerge } from "@/lib/i18n/merge";
import {
  coreLocales,
  defaultLocale,
  isSelectableLocale,
  LANG_CLASSES,
  Locale,
  localeMeta,
  locales,
  LOCALE_STORAGE_KEY,
  orderedLocales,
} from "@/lib/i18n/config";
import { registerDataDictionary } from "@/lib/i18n/dataDictionary";

import commonEn from "@/locales/en/common.json";
import caseStudyEn from "@/locales/en/caseStudy.json";
import siteEn from "@/locales/en/site.json";

// Every locale falls back to English per key until translated. (Cast through
// unknown: next-intl supports arrays at runtime, but its AbstractIntlMessages
// type only models nested string records.)
const build = (common: unknown, caseStudy: unknown, site: unknown) =>
  ({
    ...deepMerge(commonEn, common),
    caseStudy: deepMerge(caseStudyEn, caseStudy),
    site: deepMerge(siteEn, site),
  }) as unknown as AbstractIntlMessages;

const english = build(commonEn, caseStudyEn, siteEn);

/**
 * Non-English message files load on demand — each language is its own chunk,
 * so a visitor downloads only what they read.
 */
const cache = new Map<Locale, AbstractIntlMessages>([["en", english]]);

async function loadLocale(locale: Locale): Promise<AbstractIntlMessages> {
  const hit = cache.get(locale);
  if (hit) return hit;
  const [common, site, caseStudy, data] = await Promise.all([
    import(`../../locales/${locale}/common.json`).then((m) => m.default),
    import(`../../locales/${locale}/site.json`).then((m) => m.default),
    import(`../../locales/${locale}/caseStudy.json`).then((m) => m.default),
    import(`../../locales/${locale}/data.json`).then((m) => m.default as Record<string, string>),
  ]);
  registerDataDictionary(locale, data);
  const messages = build(common, caseStudy, site);
  cache.set(locale, messages);
  return messages;
}

/** English site copy — for bilingual surfaces that show a second language line. */
export const siteMessages = { en: siteEn };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  /** All 23 languages, core four first. */
  locales: readonly Locale[];
  /** The four languages the website, case study and AI scripts were written in. */
  coreLocales: readonly Locale[];
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Read + change the active language anywhere under the provider. */
export function useLocaleSwitch(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocaleSwitch must be used within <I18nProvider>");
  }
  return ctx;
}

/** Swap the <html> script class, lang + dir (drives font, leading, direction). */
function applyHtmlLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  LANG_CLASSES.forEach((c) => el.classList.remove(c));
  el.classList.add(localeMeta[locale].langClass);
  el.lang = locale;
  el.dir = localeMeta[locale].dir;
}

/** Visually-hidden polite live region — announces language changes to AT. */
function LocaleAnnouncer({ token }: { token: number }) {
  const t = useTranslations("language");
  return (
    <div role="status" aria-live="polite" className="sr-only">
      {token > 0 ? `${t("changed")}: ${t("current")}` : ""}
    </div>
  );
}

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<AbstractIntlMessages>(english);
  const [fading, setFading] = useState(false);
  const [announceToken, setAnnounceToken] = useState(0);

  const localeRef = useRef<Locale>(defaultLocale);
  const fadeTimer = useRef<number | null>(null);
  const request = useRef(0);

  const activate = useCallback(async (next: Locale) => {
    const id = ++request.current;
    let loaded: AbstractIntlMessages = english;
    try {
      loaded = await loadLocale(next);
    } catch {
      next = defaultLocale; // a missing chunk should never leave the page blank
    }
    if (id !== request.current) return false; // a newer choice won
    localeRef.current = next;
    setMessages(loaded);
    setLocaleState(next);
    applyHtmlLocale(next);
    return true;
  }, []);

  // Hydrate the saved choice once on the client. (Server always renders
  // English, so the first client render matches — no hydration mismatch.)
  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isSelectableLocale(stored) && stored !== defaultLocale) void activate(stored);
    else applyHtmlLocale(defaultLocale);
    return () => {
      if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
    };
  }, [activate]);

  // Another tab switched language — follow it.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCALE_STORAGE_KEY && isSelectableLocale(e.newValue) && e.newValue !== localeRef.current) void activate(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [activate]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (!isSelectableLocale(next)) return; // "coming soon" languages are listed, not switchable
      const changed = localeRef.current !== next;
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        /* storage may be unavailable (private mode) — non-fatal */
      }
      if (!changed) return;
      // Brief, non-destructive dip — the spec's 200ms language-swap fade.
      // (Disabled automatically under prefers-reduced-motion via globals.css.)
      setFading(true);
      void activate(next).then(() => {
        if (fadeTimer.current) window.clearTimeout(fadeTimer.current);
        fadeTimer.current = window.setTimeout(() => setFading(false), 140);
        setAnnounceToken((n) => n + 1);
      });
    },
    [activate],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, locales: orderedLocales, coreLocales }}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Asia/Kolkata"
        now={new Date(2026, 4, 24)}
      >
        <div
          style={{
            transition: "opacity 200ms ease",
            opacity: fading ? 0.5 : 1,
          }}
        >
          {children}
        </div>
        <LocaleAnnouncer token={announceToken} />
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export { locales };
