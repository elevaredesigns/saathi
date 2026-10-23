"use client";

import { Check, MagnifyingGlass, X } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { isAvailableLocale, localeMeta, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** Suggested first for a citizen in Uttar Pradesh: the state's official languages, then English. */
const SUGGESTED: Locale[] = ["hi", "ur", "en"];

/**
 * English and the 22 languages of the Eighth Schedule as a searchable list.
 * Each name is set in its own script; the list searches English names,
 * endonyms and codes alike. Picking a language applies it at once, so the
 * rest of the screen previews the choice. Planned languages sit at the end,
 * marked "Coming soon" and not selectable.
 */
export function LanguageList({ onPick, className }: { onPick?: (l: Locale) => void; className?: string }) {
  const { locale, setLocale, locales } = useLocaleSwitch();
  const t = useTranslations("language");
  const tSoon = useTranslations("languageSoon");
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () => (q ? locales.filter((l) => `${localeMeta[l].label} ${localeMeta[l].native} ${l}`.toLowerCase().includes(q)) : locales.filter((l) => !SUGGESTED.includes(l))),
    [q, locales],
  );
  const ready = matches.filter(isAvailableLocale);
  const soon = matches.filter((l) => !isAvailableLocale(l));
  const availableCount = locales.filter(isAvailableLocale).length;

  const pick = (l: Locale) => {
    setLocale(l);
    onPick?.(l);
  };

  const Row = ({ l, i }: { l: Locale; i: number }) => {
    const meta = localeMeta[l];
    const selected = l === locale;
    const motionProps = { initial: reduce ? false : { opacity: 0, transform: "translateY(6px)" }, animate: { opacity: 1, transform: "translateY(0px)" }, transition: { duration: 0.25, delay: Math.min(i * 0.015, 0.25) } };
    if (!isAvailableLocale(l)) {
      return (
        <motion.li {...motionProps} lang={l} aria-disabled className="flex items-center gap-3 rounded-[16px] bg-surface px-3.5 py-3">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-left text-[19px] font-semibold leading-tight text-ink-3" dir={meta.dir} style={{ fontFamily: `var(${meta.displayVar}), var(--font-geist)` }}>
              {meta.native}
            </span>
            <span className="mt-0.5 block text-[12.5px] text-ink-3" lang="en">
              {meta.label}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ink-2 ring-1 ring-inset ring-line">{tSoon("label")}</span>
        </motion.li>
      );
    }
    return (
      <motion.li {...motionProps}>
        <button
          type="button"
          onClick={() => pick(l)}
          aria-pressed={selected}
          lang={l}
          className={cn(
            "flex w-full items-center gap-3 rounded-[16px] px-3.5 py-3 text-left transition-[background-color,box-shadow] duration-150 active:scale-[0.99]",
            selected ? "bg-navy-50 ring-2 ring-inset ring-navy-600" : "bg-white ring-1 ring-inset ring-line hover:bg-surface",
          )}
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-left text-[19px] font-semibold leading-tight text-ink" dir={meta.dir} style={{ fontFamily: `var(${meta.displayVar}), var(--font-geist)` }}>
              {meta.native}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-ink-3">
              <span lang="en">{meta.label}</span>
              {meta.tier === "review" && <span className="rounded-full bg-surface2 px-1.5 py-px text-[10.5px] font-semibold text-ink-3">{t("reviewTag")}</span>}
            </span>
          </span>
          <span className="shrink-0 text-[13px] text-ink-3" dir={meta.dir} style={{ fontFamily: `var(${meta.fontVar}), var(--font-geist)` }}>
            {meta.greeting}
          </span>
          <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors", selected ? "bg-navy-600 text-white" : "ring-1 ring-inset ring-line-strong")}>
            {selected && <Check size={13} weight="bold" />}
          </span>
        </button>
      </motion.li>
    );
  };

  return (
    <div className={className}>
      <label className="flex h-11 items-center gap-2 rounded-[14px] bg-surface px-3 ring-1 ring-inset ring-transparent focus-within:bg-white focus-within:ring-2 focus-within:ring-navy-600">
        <MagnifyingGlass size={17} className="text-ink-3" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} aria-label={t("search")} className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3" />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label={t("clear")} className="flex h-6 w-6 items-center justify-center rounded-full bg-surface2 text-ink-3">
            <X size={12} weight="bold" />
          </button>
        )}
      </label>

      {!q && (
        <>
          <p className="mb-2 mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-3">{t("suggested")}</p>
          <ul className="space-y-2">
            {SUGGESTED.map((l, i) => (
              <Row key={l} l={l} i={i} />
            ))}
          </ul>
          <p className="mb-2 mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-3">{t("all", { count: availableCount })}</p>
        </>
      )}
      <ul className={cn("space-y-2", q && "mt-3")}>
        {ready.map((l, i) => (
          <Row key={l} l={l} i={i} />
        ))}
      </ul>
      {soon.length > 0 && (
        <>
          <p className="mb-2 mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            {tSoon("label")} · {soon.length}
          </p>
          <ul className="space-y-2">
            {soon.map((l, i) => (
              <Row key={l} l={l} i={ready.length + i} />
            ))}
          </ul>
        </>
      )}
      {matches.length === 0 && <p className="py-8 text-center text-[14px] text-ink-3">{t("noMatch")}</p>}
      <p className="mt-4 text-[12px] leading-relaxed text-ink-3">{t("reviewNote")}</p>
    </div>
  );
}
