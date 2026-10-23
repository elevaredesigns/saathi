"use client";

import { Check, X } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { contrastRatio } from "@/lib/design/contrast";
import { textPairs } from "@/lib/design/tokens";
import { localeMeta } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { Chapter } from "./Chapter";

const SCRIPTS = [
  { text: "साथी", label: "Devanagari", font: "var(--font-tiro)" },
  { text: "সাথী", label: "Bengali", font: "var(--font-anek-bangla)" },
  { text: "சாத்தி", label: "Tamil", font: "var(--font-anek-tamil)" },
  { text: "Saathi", label: "Latin", font: "var(--font-geist)" },
];

export function LanguagesChapter() {
  const t = useTranslations("caseStudy");
  const { locale, setLocale, coreLocales: locales } = useLocaleSwitch();
  const tiers = t.raw("multilingual.tiers") as { title: string; desc: string }[];
  const notes = t.raw("multilingual.compareAnnotations") as string[];

  return (
    <Chapter id="languages" label={t("cs.chapters.languages")} heading={t("multilingual.heading")}>
      <Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[26px] bg-line ring-1 ring-line sm:grid-cols-4">
          {SCRIPTS.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center bg-white px-4 py-8">
              <span className="text-[44px] font-semibold leading-tight text-ink" style={{ fontFamily: s.font }}>
                {s.text}
              </span>
              <span className="mt-2 text-[13px] text-ink-3">{s.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <p className="mt-12 text-[20px] font-semibold tracking-[-0.01em] text-ink">{t("multilingual.tiersLabel")}</p>
      <Stagger as="ol" className="mt-5 grid gap-3 md:grid-cols-3" gap={0.06}>
        {tiers.map((tier, i) => (
          <StaggerItem as="li" key={tier.title} className={cn("rounded-[22px] p-5", i === 2 ? "bg-navy-600 text-white" : "bg-surface")}>
            <p className={cn("text-[13px] font-semibold tabular-nums", i === 2 ? "text-white/70" : "text-ink-4")}>{i + 1}</p>
            <p className="mt-2 text-[17px] font-semibold">{tier.title}</p>
            <p className={cn("mt-1 text-[15px] leading-relaxed", i === 2 ? "text-white/85" : "text-ink-2")}>{tier.desc}</p>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-10">
        <ul className="space-y-2">
          {notes.map((n) => (
            <li key={n} className="flex gap-2.5 text-[16px] text-ink-2">
              <Check size={17} weight="bold" className="mt-1 shrink-0 text-green-600" />
              {n}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[14px] font-medium text-ink-3">{t("cs.languages.tryIt")}</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              aria-pressed={l === locale}
              className={cn(
                "h-10 rounded-full px-4 text-[15px] font-semibold transition-colors duration-200 active:scale-[0.97]",
                l === locale ? "bg-ink text-white" : "text-ink-2 ring-1 ring-inset ring-line hover:bg-surface",
              )}
              style={{ fontFamily: `var(${localeMeta[l].fontVar}), var(--font-geist)` }}
            >
              {localeMeta[l].native}
            </button>
          ))}
        </div>
        <p className="mt-6 text-[14px] text-ink-3">{t("multilingual.note")}</p>
      </Reveal>
    </Chapter>
  );
}

export function AccessibilityChapter() {
  const t = useTranslations("caseStudy");
  const items = t.raw("accessibility.items") as { title: string; desc: string }[];
  const pairs = textPairs.slice(0, 12);

  return (
    <Chapter id="accessibility" label={t("cs.chapters.accessibility")} heading={t("accessibility.heading")}>
      <Stagger as="ul" className="grid gap-x-10 border-t border-line sm:grid-cols-2" gap={0.03}>
        {items.map((it) => (
          <StaggerItem as="li" key={it.title} className="border-b border-line py-4">
            <p className="text-[16.5px] font-semibold text-ink">{it.title}</p>
            <p className="mt-0.5 text-[15px] text-ink-2">{it.desc}</p>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-14">
        <p className="text-[20px] font-semibold tracking-[-0.01em] text-ink">{t("cs.accessibility.contrastTitle")}</p>
        <p className="mt-2 max-w-[64ch] text-[16px] text-ink-2">{t("cs.accessibility.contrastBody")}</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="border-b border-line pb-2.5 text-[13.5px] font-semibold text-ink-3">{t("cs.accessibility.pairLabel")}</th>
                <th className="border-b border-line pb-2.5 text-right text-[13.5px] font-semibold text-ink-3">{t("cs.accessibility.ratioLabel")}</th>
                <th className="border-b border-line pb-2.5 text-right text-[13.5px] font-semibold text-ink-3">{t("cs.accessibility.resultLabel")}</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((p) => {
                const ratio = contrastRatio(p.fg, p.bg);
                const pass = ratio >= p.min;
                return (
                  <tr key={p.name}>
                    <td className="border-b border-line py-2.5">
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-14 items-center justify-center rounded-[8px] text-[14px] font-semibold ring-1 ring-black/5" style={{ background: p.bg, color: p.fg }}>
                          Aa
                        </span>
                        <span className="text-[14.5px] text-ink-2">{p.name}</span>
                      </span>
                    </td>
                    <td className="border-b border-line py-2.5 text-right text-[14.5px] font-semibold tabular-nums text-ink">{ratio.toFixed(2)}:1</td>
                    <td className="border-b border-line py-2.5 text-right">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12.5px] font-semibold", pass ? "bg-green-50 text-green-800" : "bg-red-50 text-red-600")}>
                        {pass ? <Check size={12} weight="bold" /> : <X size={12} weight="bold" />}
                        AA
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Chapter>
  );
}
