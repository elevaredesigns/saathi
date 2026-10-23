"use client";

import { HandTap } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { siteMessages, useLocaleSwitch } from "@/components/providers/I18nProvider";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { localeMeta } from "@/lib/i18n/config";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";
import { LivePhone } from "../LivePhone";

export function Hero() {
  const t = useTranslations("site.hero");
  const reduce = useReducedMotion();
  const { locale, setLocale, coreLocales: locales } = useLocaleSwitch();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);

  // The second language line: Hindi under English, English under everything else.
  const secondary = locale === "en" ? t("secondary") : siteMessages.en.hero.title;
  const secondaryIsDeva = locale === "en";

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(14px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 0.8, ease: ease.cinematic, delay },
    // Same timing for the CSS entrance that paints before JavaScript arrives.
    style: { "--d": `${delay}s` } as React.CSSProperties,
  });

  return (
    <section ref={ref} id="top" data-hero className="relative overflow-hidden">
      <div className="mx-auto grid max-w-page items-center gap-10 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6 lg:pb-24 lg:pt-16">
        <div className="relative z-10">
          <motion.p data-reveal {...rise(0)} className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1.5 text-[13.5px] font-semibold text-navy-700">
            <span className="h-1.5 w-1.5 rounded-full bg-navy-600" />
            {t("badge")}
          </motion.p>

          <TextReveal
            immediate
            as="h1"
            key={locale}
            delay={0.08}
            text={t("title")}
            className="mt-6 max-w-[var(--hero-measure,14ch)] text-[length:calc(clamp(44px,5.6vw,88px)*var(--hero-scale,1))] font-semibold leading-[var(--lh-tight)] tracking-[var(--track-display)] text-ink"
          />

          <motion.p
            data-reveal
            key={`sec-${locale}`}
            {...rise(0.55)}
            lang={secondaryIsDeva ? "hi" : "en"}
            className={cn(
              "mt-5 text-[clamp(26px,2.9vw,44px)] leading-[1.25] text-ink-3",
              secondaryIsDeva ? "font-wordmark" : "font-geist font-medium tracking-[-0.02em]",
            )}
          >
            {secondary}
          </motion.p>

          <motion.p data-reveal {...rise(0.7)} className="mt-7 max-w-[52ch] text-[18px] leading-[var(--lh-body-x)] text-ink-2">
            {t("lede")}
          </motion.p>

          <motion.div data-reveal {...rise(0.82)} className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/prototype/"
              className="inline-flex h-14 items-center rounded-full bg-navy-600 px-7 text-[17px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_14px_30px_-14px_rgba(31,67,184,0.7)] transition-[transform,background-color] duration-150 hover:bg-navy-700 active:scale-[0.97]"
            >
              {t("primary")}
            </Link>
            <Link
              href="/case-study/"
              className="inline-flex h-14 items-center rounded-full px-6 text-[17px] font-semibold text-ink ring-1 ring-inset ring-line-strong transition-[transform,background-color] duration-150 hover:bg-surface active:scale-[0.97]"
            >
              {t("secondaryCta")}
            </Link>
          </motion.div>

          <motion.div data-reveal {...rise(0.95)} className="mt-10">
            <p className="text-[13.5px] font-medium text-ink-3">{t("languagesLabel")}</p>
            <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label={t("languagesLabel")}>
              {locales.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  aria-pressed={l === locale}
                  className={cn(
                    "h-10 rounded-full px-4 text-[15px] font-semibold transition-[background-color,color,box-shadow] duration-200 active:scale-[0.97]",
                    l === locale ? "bg-ink text-white" : "text-ink-2 ring-1 ring-inset ring-line hover:bg-surface",
                  )}
                  style={{ fontFamily: `var(${localeMeta[l].fontVar}), var(--font-geist)` }}
                >
                  {localeMeta[l].native}
                </button>
              ))}
              <a href="#languages" className="flex h-10 items-center rounded-full px-4 text-[14px] font-semibold text-navy-600 ring-1 ring-inset ring-navy-100 transition-colors hover:bg-navy-50">
                {t("moreLanguages")}
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          data-reveal
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(60px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ type: "spring", duration: 1.2, bounce: 0.12, delay: 0.25 }}
          style={{ "--d": "0.25s" } as React.CSSProperties}
          className="relative"
        >
          <motion.div style={{ y: phoneY }} className="relative">
            <LivePhone src="/prototype/home/" scale={0.7} priority />
            <p className="mt-5 flex items-center justify-center gap-1.5 text-[13.5px] font-medium text-ink-3">
              <HandTap size={16} weight="duotone" className="text-navy-600" />
              {t("liveLabel")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
