"use client";

import { Check } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { Avatar } from "@/components/prototype/ui/Avatar";
import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { Chapter, Prose } from "./Chapter";

interface Persona {
  name: string;
  tag: string;
  snapshot: string;
  day: string;
  quote: string;
  needs: string[];
}

export function ResearchChapter() {
  const t = useTranslations("caseStudy");
  const people = t.raw("research.personas") as { name: string; tag: string; line: string }[];
  return (
    <Chapter id="research" label={t("cs.chapters.research")} heading={t("research.heading")}>
      <Prose paragraphs={[t("research.body")]} />
      <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-2">
        {people.map((p) => (
          <StaggerItem as="li" key={p.name} className="flex gap-4 rounded-[22px] p-5 ring-1 ring-line">
            <Avatar name={p.name} size={44} />
            <div>
              <p className="text-[16px] font-semibold text-ink">
                {p.name} <span className="font-medium text-ink-3">{p.tag}</span>
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{p.line}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Chapter>
  );
}

export function PersonasChapter() {
  const t = useTranslations("caseStudy");
  const items = t.raw("personas.items") as Persona[];
  const cols = t.raw("personas.tableCols") as string[];
  const rows = t.raw("personas.tableRows") as string[][];

  return (
    <Chapter id="personas" label={t("cs.chapters.personas")} heading={t("personas.heading")}>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((p, i) => (
          <Reveal key={p.name} delay={(i % 2) * 0.06} className="flex flex-col rounded-[26px] bg-surface p-6">
            <div className="flex items-center gap-3">
              <Avatar name={p.name} size={52} />
              <div>
                <p className="text-[18px] font-semibold text-ink">{p.name}</p>
                <p className="text-[14px] text-ink-3">{p.tag}</p>
              </div>
            </div>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">{p.snapshot}</p>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink">{p.day}</p>
            <blockquote className="mt-5 border-l-2 border-navy-600 pl-4 text-[17px] font-medium leading-snug text-ink">“{p.quote}”</blockquote>
            <ul className="mt-5 space-y-1.5">
              {p.needs.map((n) => (
                <li key={n} className="flex items-start gap-2 text-[14.5px] text-ink-2">
                  <Check size={15} weight="bold" className="mt-0.5 shrink-0 text-green-600" />
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 overflow-x-auto">
        <p className="mb-3 text-[15px] font-semibold text-ink">{t("personas.tableTitle")}</p>
        <table className="w-full min-w-[560px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c} className="border-b border-line pb-2.5 pr-4 text-[13.5px] font-semibold text-ink-3">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((cell, ci) => (
                  <td key={ci} className={`border-b border-line py-3 pr-4 text-[15px] ${ci === 0 ? "font-semibold text-ink" : "text-ink-2"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Chapter>
  );
}
