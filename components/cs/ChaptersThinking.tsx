"use client";

import { Compass, House, ListChecks, UserCircle, type Icon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";
import { Chapter, Prose } from "./Chapter";

const LENS_COLOURS = [
  { fill: "#FF8A1F", text: "text-saffron-700" },
  { fill: "#1F43B8", text: "text-navy-700" },
  { fill: "#12803C", text: "text-green-800" },
];

export function FrameChapter() {
  const t = useTranslations("caseStudy");
  const reduce = useReducedMotion();
  const items = t.raw("lenses.items") as { title: string; desc: string }[];
  const circles = [
    { cx: 200, cy: 150 },
    { cx: 142, cy: 252 },
    { cx: 258, cy: 252 },
  ];

  return (
    <Chapter id="frame" label={t("cs.chapters.frame")} heading={t("lenses.heading")}>
      <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr]">
        <div>
          <Prose paragraphs={[t("lenses.caption")]} />
          <ul className="mt-8 space-y-5">
            {items.map((it, i) => (
              <Reveal as="li" key={it.title} delay={i * 0.06} className="flex gap-3">
                <span aria-hidden className="mt-2 h-3 w-3 shrink-0 rounded-full" style={{ background: LENS_COLOURS[i].fill }} />
                <div>
                  <h3 className="text-[17px] font-semibold text-ink">{it.title}</h3>
                  <p className="text-[15.5px] text-ink-2">{it.desc}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[380px]">
          <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
            {circles.map((c, i) => (
              <motion.circle
                key={i}
                cx={c.cx}
                cy={c.cy}
                r={110}
                fill={LENS_COLOURS[i].fill}
                fillOpacity={0.08}
                stroke={LENS_COLOURS[i].fill}
                strokeOpacity={0.5}
                strokeWidth={1.5}
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, ease: ease.cinematic, delay: i * 0.15 }}
                style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
              />
            ))}
            <circle cx="200" cy="218" r="6" fill="#0B0D14" />
          </svg>
          {items.map((it, i) => (
            <span
              key={it.title}
              className={cn(
                "absolute text-[14px] font-semibold",
                LENS_COLOURS[i].text,
                i === 0 && "left-1/2 top-[5%] -translate-x-1/2",
                i === 1 && "bottom-[6%] left-[4%]",
                i === 2 && "bottom-[6%] right-[4%]",
              )}
            >
              {it.title}
            </span>
          ))}
          <span className="absolute left-1/2 top-[57%] -translate-x-1/2 text-[14px] font-semibold text-ink">{t("lenses.center")}</span>
        </div>
      </div>
    </Chapter>
  );
}

export function PrinciplesChapter() {
  const t = useTranslations("caseStudy");
  const items = t.raw("principles.items") as { title: string; desc: string }[];
  return (
    <Chapter id="principles" label={t("cs.chapters.principles")} heading={t("principles.heading")}>
      <Stagger as="ol" className="grid gap-x-10 border-t border-line sm:grid-cols-2" gap={0.03}>
        {items.map((p, i) => (
          <StaggerItem as="li" key={p.title} className="flex gap-4 border-b border-line py-5">
            <span className="w-6 shrink-0 pt-0.5 text-[14px] font-semibold tabular-nums text-ink-4">{i + 1}</span>
            <div>
              <p className="text-[17px] font-semibold text-ink">{p.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{p.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Chapter>
  );
}

const TAB_ICONS: (Icon | "orb")[] = [House, Compass, "orb", ListChecks, UserCircle];

export function StructureChapter() {
  const t = useTranslations("caseStudy.cs");
  const tabs = t.raw("structure.tabs") as { name: string; desc: string }[];
  return (
    <Chapter id="structure" label={t("chapters.structure")} heading={t("structure.heading")}>
      <Prose paragraphs={[t("structure.body")]} />
      <Reveal className="mt-10">
        <div className="mx-auto flex max-w-[520px] items-end justify-between rounded-[28px] bg-white px-4 pb-3 pt-5 shadow-[0_24px_60px_-30px_rgba(11,13,20,0.35)] ring-1 ring-line">
          {tabs.map((tab, i) => {
            const Glyph = TAB_ICONS[i];
            return (
              <div key={tab.name} className="flex flex-1 flex-col items-center gap-1.5">
                {Glyph === "orb" ? (
                  <span className="-mt-8 rounded-full bg-white p-1 ring-1 ring-line">
                    <SaathiOrb size={52} />
                  </span>
                ) : (
                  <Glyph size={26} weight={i === 0 ? "fill" : "regular"} className={i === 0 ? "text-navy-600" : "text-ink-3"} />
                )}
                <span className={cn("text-[12.5px] font-semibold", i === 2 ? "text-navy-700" : "text-ink-2")}>{tab.name}</span>
              </div>
            );
          })}
        </div>
      </Reveal>
      <Stagger className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2" gap={0.05}>
        {tabs.map((tab, i) => (
          <StaggerItem key={tab.name} className={cn(i === 2 && "sm:col-span-2 rounded-[22px] bg-navy-50/60 p-5")}>
            <p className="text-[17px] font-semibold text-ink">{tab.name}</p>
            <p className="mt-1 text-[15.5px] leading-relaxed text-ink-2">{tab.desc}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Chapter>
  );
}
