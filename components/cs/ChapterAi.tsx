"use client";

import { CheckCircle, Info, ListChecks, ShieldCheck, Sparkle, Wrench, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { Chapter, Prose } from "./Chapter";

const PATTERN_ICONS: Icon[] = [ListChecks, Wrench, ShieldCheck, CheckCircle];

export function AiChapter() {
  const t = useTranslations("caseStudy.cs");
  const patterns = t.raw("ai.patterns") as { title: string; body: string }[];
  const failures = t.raw("ai.failures") as { title: string; body: string }[];
  const principles = t.raw("ai.principles") as string[];

  return (
    <Chapter id="ai" label={t("chapters.ai")} heading={t("ai.heading")}>
      <Prose paragraphs={t.raw("ai.body") as string[]} />

      <p className="mt-12 text-[20px] font-semibold tracking-[-0.01em] text-ink">{t("ai.patternsTitle")}</p>
      <Stagger as="ol" className="mt-5 grid gap-3 sm:grid-cols-2" gap={0.06}>
        {patterns.map((p, i) => {
          const Glyph = PATTERN_ICONS[i];
          return (
            <StaggerItem as="li" key={p.title} className="rounded-[24px] p-6 ring-1 ring-line">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-navy-50 text-navy-600">
                  <Glyph size={21} weight="duotone" />
                </span>
                <p className="text-[17px] font-semibold text-ink">
                  <span className="mr-1.5 tabular-nums text-ink-4">{i + 1}</span>
                  {p.title}
                </p>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{p.body}</p>
            </StaggerItem>
          );
        })}
      </Stagger>

      <p className="mt-14 text-[20px] font-semibold tracking-[-0.01em] text-ink">{t("ai.failuresTitle")}</p>
      <Reveal className="mt-5 overflow-hidden rounded-[24px] bg-surface">
        <dl className="divide-y divide-line">
          {failures.map((f) => (
            <div key={f.title} className="grid gap-1 px-6 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
              <dt className="text-[15.5px] font-semibold text-ink">{f.title}</dt>
              <dd className="text-[15px] leading-relaxed text-ink-2">{f.body}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <p className="mt-14 text-[20px] font-semibold tracking-[-0.01em] text-ink">{t("ai.principlesTitle")}</p>
      <Stagger as="ul" className="mt-5 space-y-2.5" gap={0.05}>
        {principles.map((p) => (
          <StaggerItem as="li" key={p} className="flex items-start gap-3 text-[17px] text-ink">
            <Sparkle size={18} weight="fill" className="mt-1 shrink-0 text-navy-600" />
            {p}
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-10 flex gap-3 rounded-[20px] bg-navy-50/60 p-5">
        <Info size={20} weight="fill" className="mt-0.5 shrink-0 text-navy-600" />
        <p className="text-[15px] leading-relaxed text-ink-2">{t("ai.note")}</p>
      </Reveal>
    </Chapter>
  );
}
