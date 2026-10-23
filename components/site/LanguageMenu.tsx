"use client";

import { Check, Translate } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { isAvailableLocale, localeMeta } from "@/lib/i18n/config";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

/** Compact language picker for the site header. */
export function LanguageMenu() {
  const { locale, setLocale, locales } = useLocaleSwitch();
  const tSoon = useTranslations("languageSoon");
  const firstSoon = locales.findIndex((l) => !isAvailableLocale(l));
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Language: ${localeMeta[locale].native}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full pl-2.5 pr-3 text-ink-2 ring-1 ring-inset transition-colors duration-150 hover:bg-surface",
          open ? "bg-surface ring-line-strong" : "ring-line",
        )}
      >
        <Translate size={16} weight="bold" />
        <span className="text-[13.5px] font-semibold text-ink" style={{ fontFamily: `var(${localeMeta[locale].fontVar}), var(--font-geist)` }}>
          {localeMeta[locale].native}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, transform: "translateY(-6px) scale(0.98)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(-4px) scale(0.98)" }}
            transition={{ duration: 0.18, ease: ease.out }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 max-h-[min(70vh,560px)] w-60 overflow-y-auto overscroll-contain rounded-[16px] bg-white p-1.5 shadow-[0_24px_60px_-20px_rgba(11,13,20,0.35)] ring-1 ring-line"
          >
            {locales.map((l, i) =>
              !isAvailableLocale(l) ? (
                <li key={l} role="none" className={cn(i === firstSoon && "mt-1.5 border-t border-line pt-1.5")}>
                  {i === firstSoon && <p className="px-3 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">{tSoon("label")}</p>}
                  <span role="menuitem" aria-disabled className="flex w-full cursor-default items-center justify-between rounded-[11px] px-3 py-2 text-left">
                    <span>
                      <span className="block text-[15px] font-semibold text-ink-3" dir={localeMeta[l].dir} lang={l} style={{ fontFamily: `var(${localeMeta[l].fontVar}), var(--font-geist)` }}>
                        {localeMeta[l].native}
                      </span>
                      <span className="block text-[12px] text-ink-3">{localeMeta[l].label}</span>
                    </span>
                  </span>
                </li>
              ) : (
              <li key={l} className={cn(i === 4 && "mt-1.5 border-t border-line pt-1.5")}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={l === locale}
                  onClick={() => {
                    setLocale(l);
                    setOpen(false);
                  }}
                  className={cn("flex w-full items-center justify-between rounded-[11px] px-3 py-2 text-left transition-colors", l === locale ? "bg-navy-50" : "hover:bg-surface")}
                >
                  <span>
                    <span className="block text-[15px] font-semibold text-ink" dir={localeMeta[l].dir} lang={l} style={{ fontFamily: `var(${localeMeta[l].fontVar}), var(--font-geist)` }}>
                      {localeMeta[l].native}
                    </span>
                    <span className="block text-[12px] text-ink-3">{localeMeta[l].label}</span>
                  </span>
                  {l === locale && <Check size={16} weight="bold" className="text-navy-600" />}
                </button>
              </li>
              ),
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
