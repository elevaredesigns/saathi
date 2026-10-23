"use client";

import { CellSignalLow, CheckCircle, CircleHalf, Eye, TextAa, Microphone, SpeakerHigh, SpeakerSimpleHigh, Timer, UserSwitch, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { speak } from "@/lib/a11y/speak";
import { isAvailableLocale, localeMeta, orderedLocales, soonLocales, type Locale } from "@/lib/i18n/config";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

const FEATURE_ICONS: Icon[] = [Microphone, SpeakerHigh, Timer, UserSwitch, CellSignalLow, Eye];
const DISPLAY_FONT = (l: Locale) => `var(${localeMeta[l].displayVar})`;
/** The morph cycles through languages you can switch to today; planned ones are listed underneath. */
const locales = orderedLocales.filter(isAvailableLocale);

function ToggleChip({ on, onClick, icon: Glyph, label }: { on: boolean; onClick: () => void; icon: Icon; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "flex h-11 items-center gap-2 rounded-full px-4 text-[14.5px] font-semibold transition-[background-color,color,box-shadow] duration-200 active:scale-[0.97]",
        on ? "bg-navy-600 text-white" : "text-ink-2 ring-1 ring-inset ring-line-strong hover:bg-surface",
      )}
    >
      <Glyph size={17} weight={on ? "fill" : "bold"} />
      {label}
    </button>
  );
}

export function Languages() {
  const t = useTranslations("site.languages");
  const tSoon = useTranslations("languageSoon");
  const reduce = useReducedMotion();
  const { locale: siteLocale } = useLocaleSwitch();
  const phrases = t.raw("phrases") as Partial<Record<Locale, string>>;
  const features = t.raw("features") as { title: string; body: string }[];
  const [shown, setShown] = useState<Locale>("hi");
  const [large, setLarge] = useState(false);
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setShown((l) => locales[(locales.indexOf(l) + 1) % locales.length]), 2400);
    return () => window.clearInterval(id);
  }, [reduce]);

  const sample = { title: t("sample.title"), status: t("sample.status"), body: t("sample.body") };

  return (
    <section id="languages" className="scroll-mt-20 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-page">
        <div className="max-w-3xl">
          <TextReveal as="h2" text={t("title")} className="text-h1 text-ink" />
          <Reveal>
            <p className="mt-6 text-[20px] leading-relaxed text-ink-2">{t("intro")}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Script morph */}
          <div className="flex flex-col justify-between rounded-[32px] bg-surface p-8 md:p-12">
            <div className="relative h-[clamp(160px,18vw,230px)]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={shown}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(12px)", transform: "translateY(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(12px)", transform: "translateY(-10px)" }}
                  transition={{ duration: 0.55, ease: ease.cinematic }}
                  className="absolute inset-0 flex items-center text-[clamp(40px,5.2vw,76px)] font-semibold leading-[1.2] text-ink"
                  dir={localeMeta[shown].dir}
                  lang={shown}
                  style={{ fontFamily: DISPLAY_FONT(shown), letterSpacing: shown === "en" ? "-0.04em" : 0 }}
                >
                  {phrases[shown] ?? phrases.en}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {locales.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setShown(l)}
                  aria-pressed={shown === l}
                  className={cn(
                    "relative h-10 rounded-full px-4 text-[15px] font-semibold transition-colors duration-200",
                    shown === l ? "text-white" : "text-ink-2 hover:text-ink",
                  )}
                  style={{ fontFamily: `var(${localeMeta[l].fontVar}), var(--font-geist)` }}
                >
                  {shown === l && <motion.span layoutId="script-pill" transition={{ type: "spring", duration: 0.4, bounce: 0.1 }} className="absolute inset-0 rounded-full bg-ink" />}
                  <span className="relative">{localeMeta[l].native}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => speak(phrases[shown] ?? phrases.en ?? "", shown)}
                aria-label={t("toggles.read")}
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy-600 ring-1 ring-line transition-transform active:scale-90"
              >
                <SpeakerSimpleHigh size={18} weight="fill" />
              </button>
            </div>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-5 text-[14px] text-ink-3">
              <span className="text-[12px] font-semibold uppercase tracking-[0.08em]">{tSoon("label")}</span>
              {soonLocales.map((l) => (
                <span key={l} lang={l} dir={localeMeta[l].dir} style={{ fontFamily: `var(${localeMeta[l].fontVar}), var(--font-geist)` }}>
                  {localeMeta[l].native}
                </span>
              ))}
            </p>
          </div>

          {/* Live settings demo */}
          <div>
            <p className="text-[20px] font-semibold text-ink">{t("tryTitle")}</p>
            <p className="mt-1 text-[16px] text-ink-2">{t("tryBody")}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ToggleChip on={large} onClick={() => setLarge((v) => !v)} icon={TextAa} label={t("toggles.large")} />
              <ToggleChip on={contrast} onClick={() => setContrast((v) => !v)} icon={CircleHalf} label={t("toggles.contrast")} />
              <ToggleChip on={false} onClick={() => speak(`${sample.title}. ${sample.status}. ${sample.body}`, siteLocale)} icon={SpeakerHigh} label={t("toggles.read")} />
            </div>

            <motion.div
              layout
              transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
              className={cn("mt-6 rounded-[28px] p-6 transition-colors duration-300", contrast ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line")}
            >
              <motion.span
                layout
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors duration-300",
                  contrast ? "bg-white text-ink" : "bg-green-50 text-green-800",
                  large ? "px-3.5 py-1.5 text-[16px]" : "px-3 py-1 text-[13px]",
                )}
              >
                <CheckCircle size={large ? 18 : 15} weight="fill" className={contrast ? "text-ink" : "text-green-600"} />
                {sample.status}
              </motion.span>
              <motion.p layout className={cn("mt-4 font-semibold tracking-[-0.015em]", large ? "text-[34px] leading-tight" : "text-[24px]")}>
                {sample.title}
              </motion.p>
              <motion.p layout className={cn("mt-2 leading-relaxed", large ? "text-[20px]" : "text-[16px]", contrast ? "text-white" : "text-ink-2")}>
                {sample.body}
              </motion.p>
            </motion.div>
          </div>
        </div>

        <ul className="mt-20 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Glyph = FEATURE_ICONS[i];
            return (
              <Reveal as="li" key={f.title} delay={(i % 3) * 0.06} className="flex gap-4">
                <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-navy-50 text-navy-600">
                  <Glyph size={24} weight="duotone" />
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold text-ink">{f.title}</h3>
                  <p className="mt-1 text-[15.5px] leading-relaxed text-ink-2">{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
