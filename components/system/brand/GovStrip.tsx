"use client";

import { CaretDown, Globe, LockSimple, ShieldCheck, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";

import { siteMessages, useLocaleSwitch } from "@/components/providers/I18nProvider";
import { duration, ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";
import { TricolourGlyph } from "./TricolourRule";

const POINT_ICONS = [Globe, LockSimple, ShieldCheck];

/**
 * Masthead strip in the manner of the best government design systems:
 * a bilingual concept line (GIGW asks for Hindi + English) and an expandable
 * "How to identify official websites" panel — which also teaches citizens how
 * to avoid the fake portals our research participants feared most.
 */
export function GovStrip({ className }: { className?: string }) {
  const t = useTranslations("site.govStrip");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Second language: Hindi when reading English, English otherwise.
  const secondary = locale === "en" ? "विकसित भारत @2047 के लिए एक डिज़ाइन परिकल्पना" : siteMessages.en.govStrip.concept;
  const points = t.raw("points") as { title: string; body: string }[];

  return (
    <div className={cn("relative z-50 border-b border-line bg-surface text-ink-2", className)}>
      <div className="mx-auto flex h-9 max-w-page items-center gap-3 px-5 text-caption sm:px-8">
        <TricolourGlyph />
        <p className="min-w-0 truncate">
          <span className="font-medium text-ink">{t("concept")}</span>
          <span className="hidden text-ink-3 md:inline">
            <span className="mx-2 text-ink-4">·</span>
            <span lang={locale === "en" ? "hi" : "en"}>{secondary}</span>
          </span>
        </p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-medium text-navy-600 transition-colors hover:bg-navy-50"
        >
          <span className="hidden sm:inline">{t("identify")}</span>
          <span className="sm:hidden">
            <ShieldCheck size={16} weight="duotone" aria-label={t("identify")} />
          </span>
          <CaretDown
            size={12}
            weight="bold"
            className={cn("transition-transform duration-200 ease-out", open && "rotate-180")}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: duration.base, ease: ease.out }}
            className="overflow-hidden border-t border-line bg-page"
          >
            <div className="mx-auto max-w-page px-5 py-6 sm:px-8">
              <div className="flex items-start justify-between gap-6">
                <p className="text-label font-semibold text-ink">{t("identifyTitle")}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1 text-ink-3 transition-colors hover:bg-surface hover:text-ink"
                  aria-label={t("close")}
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                {points.map((p, i) => {
                  const Icon = POINT_ICONS[i] ?? ShieldCheck;
                  return (
                    <li key={p.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-tile bg-navy-50 text-navy-600">
                        <Icon size={18} weight="duotone" />
                      </span>
                      <span>
                        <span className="block text-label font-semibold text-ink">{p.title}</span>
                        <span className="mt-0.5 block text-label text-ink-2">{p.body}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-caption text-ink-3">{t("notOfficial")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
