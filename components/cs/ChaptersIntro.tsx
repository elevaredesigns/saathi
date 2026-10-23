"use client";

import { Check, Quotes } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { Chapter, Prose } from "./Chapter";

export function OverviewChapter() {
  const t = useTranslations("caseStudy.cs");
  const outcomes = t.raw("overview.outcomes") as { value: string; label: string }[];
  return (
    <Chapter id="overview" label={t("chapters.overview")} heading={t("overview.heading")}>
      <Prose paragraphs={t.raw("overview.body") as string[]} />
      <p className="mt-12 text-[15px] font-semibold text-ink">{t("overview.outcomesTitle")}</p>
      <Stagger as="ul" className="mt-5 grid gap-px overflow-hidden rounded-[24px] bg-line ring-1 ring-line sm:grid-cols-2">
        {outcomes.map((o) => (
          <StaggerItem as="li" key={o.label} className="bg-white p-6">
            <p className="text-[52px] font-semibold leading-none tracking-[var(--track-display)] text-ink">{o.value}</p>
            <p className="mt-3 max-w-[28ch] text-[15.5px] leading-snug text-ink-2">{o.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Chapter>
  );
}

export function ProblemChapter() {
  const t = useTranslations("caseStudy");
  const apps = t.raw("problem.apps") as string[];
  return (
    <Chapter id="problem" label={t("cs.chapters.problem")} heading={t("problem.heading")}>
      <Prose paragraphs={t.raw("problem.body") as string[]} />
      <Reveal className="mt-10">
        <p className="text-[14px] font-medium text-ink-3">{t("problem.appsLabel")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {apps.map((a, i) => (
            <span
              key={a}
              className="rounded-full bg-white px-3.5 py-1.5 text-[14px] font-medium text-ink-2 ring-1 ring-line"
              style={{ transform: `rotate(${((i * 37) % 7) - 3}deg)` }}
            >
              {a}
            </span>
          ))}
        </div>
      </Reveal>
      <Reveal className="mt-12">
        <figure className="relative rounded-[28px] bg-surface p-8 md:p-10">
          <Quotes size={32} weight="fill" className="text-navy-200" />
          <blockquote lang="hi" className="mt-4 font-wordmark text-[clamp(26px,3vw,36px)] leading-[1.35] text-ink">
            {t("problem.quote")}
          </blockquote>
          <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{t("problem.quoteTranslation")}</p>
          <figcaption className="mt-5 text-[14px] font-semibold text-ink-3">{t("problem.quoteAttr")}</figcaption>
        </figure>
      </Reveal>
    </Chapter>
  );
}

export function UmangChapter() {
  const t = useTranslations("caseStudy");
  const rows = t.raw("umang.rows") as { aspect: string; umang: string; saathi: string }[];
  return (
    <Chapter id="umang" label={t("cs.chapters.umang")} heading={t("umang.heading")}>
      <Prose paragraphs={[t("umang.intro")]} />
      <Reveal className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <th className="w-[22%] pb-3 text-[13.5px] font-semibold text-ink-3" />
              <th className="pb-3 text-[15px] font-semibold text-ink-2">{t("umang.umangLabel")}</th>
              <th className="pb-3 text-[15px] font-semibold text-navy-700">
                <span className="inline-flex items-center gap-2">
                  <SaathiMark size={20} />
                  {t("umang.saathiLabel")}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.aspect} className="align-top">
                <th scope="row" className="border-t border-line py-4 pr-6 text-[15px] font-semibold text-ink">
                  {r.aspect}
                </th>
                <td className="border-t border-line py-4 pr-6 text-[15px] leading-relaxed text-ink-3">{r.umang}</td>
                <td className="border-t border-line py-4 text-[15px] leading-relaxed text-ink">
                  <span className="flex gap-2">
                    <Check size={16} weight="bold" className="mt-1 shrink-0 text-green-600" />
                    {r.saathi}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
      <p className="mt-6 max-w-[64ch] text-[14px] leading-relaxed text-ink-3">{t("umang.note")}</p>
    </Chapter>
  );
}
