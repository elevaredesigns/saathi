"use client";

import { CurrencyInr, Fingerprint, Megaphone, PlugsConnected, Translate, Vault, type Icon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { CountUp } from "@/components/system/motion/CountUp";
import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { ease } from "@/lib/design/motion";

const ICONS: Icon[] = [Fingerprint, Vault, CurrencyInr, Translate, PlugsConnected, Megaphone];

/** Node positions in a 1000×460 box: three rails on each side of Saathi. */
const NODES = [
  { x: 150, y: 80 },
  { x: 110, y: 230 },
  { x: 150, y: 380 },
  { x: 850, y: 80 },
  { x: 890, y: 230 },
  { x: 850, y: 380 },
];
const CENTER = { x: 500, y: 230 };

function railPath(n: { x: number; y: number }) {
  const midX = (n.x + CENTER.x) / 2;
  return `M${n.x} ${n.y} C ${midX} ${n.y}, ${midX} ${CENTER.y}, ${CENTER.x} ${CENTER.y}`;
}

export function Rails() {
  const t = useTranslations("site.rails");
  const reduce = useReducedMotion();
  const figures = t.raw("figures") as { value: number; unit: string; label: string; source: number }[];
  const stack = t.raw("stack") as { name: string; role: string }[];

  return (
    <section id="rails" className="scroll-mt-24 px-5 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-page">
        <TextReveal as="h2" text={t("title")} className="max-w-[18ch] text-h1 text-ink" />
        <Reveal>
          <p className="mt-6 max-w-2xl text-[20px] leading-relaxed text-ink-2">{t("intro")}</p>
        </Reveal>

        <dl className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-8">
          {figures.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.08}>
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <span className="flex items-baseline gap-2">
                  <CountUp
                    value={f.value}
                    decimals={f.value % 1 ? 1 : 0}
                    format={(n) => (f.value % 1 ? n.toFixed(1) : Math.round(n).toLocaleString("en-IN"))}
                    className="text-[clamp(56px,6.5vw,96px)] font-semibold leading-none tracking-[var(--track-display)] text-ink"
                  />
                  <span className="text-[22px] font-semibold text-ink-2">{f.unit}</span>
                </span>
                <span className="mt-3 block text-[16px] text-ink-2">
                  {f.label}
                  <a href="#sources" className="ml-1 align-super text-[11px] font-semibold text-navy-600 hover:underline" aria-label={`Source ${f.source}`}>
                    {f.source}
                  </a>
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>

        <Reveal>
          <p className="mt-16 max-w-3xl text-[clamp(22px,2.4vw,32px)] font-medium leading-snug tracking-[-0.015em] text-ink">{t("gap")}</p>
        </Reveal>

        {/* Conceptual integration diagram */}
        <div className="mt-20">
          <p className="text-[15px] font-semibold text-ink">{t("stackTitle")}</p>
          <p className="mt-1 text-[14px] text-ink-3">{t("stackNote")}</p>

          <div className="relative mt-8 hidden aspect-[1000/460] w-full md:block">
            <svg viewBox="0 0 1000 460" className="absolute inset-0 h-full w-full" aria-hidden>
              {NODES.map((n, i) => {
                const d = railPath(n);
                return (
                  <g key={i}>
                    <motion.path
                      d={d}
                      fill="none"
                      stroke="#B9C8F0"
                      strokeWidth={1.5}
                      initial={reduce ? false : { pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 1.1, ease: ease.inOut, delay: 0.1 + i * 0.08 }}
                    />
                    {!reduce && (
                      <circle r={3.5} fill="#1F43B8">
                        <animateMotion dur={`${2.6 + i * 0.3}s`} repeatCount="indefinite" path={d} begin={`${1.2 + i * 0.2}s`} />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {NODES.map((n, i) => {
              const Glyph = ICONS[i];
              const left = i < 3;
              return (
                <motion.div
                  key={stack[i].name}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, transform: `translate(-50%, -50%) translateX(${left ? -16 : 16}px)` }}
                  whileInView={{ opacity: 1, transform: "translate(-50%, -50%) translateX(0px)" }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: ease.cinematic, delay: i * 0.08 }}
                  className="absolute flex w-[210px] items-center gap-3 rounded-[18px] bg-white p-3 ring-1 ring-line"
                  style={{ left: `${(n.x / 1000) * 100}%`, top: `${(n.y / 460) * 100}%` }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-navy-50 text-navy-600">
                    <Glyph size={21} weight="duotone" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{stack[i].name}</span>
                    <span className="block text-[13px] text-ink-3">{stack[i].role}</span>
                  </span>
                </motion.div>
              );
            })}

            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translate(-50%, -50%) scale(0.85)" }}
              whileInView={{ opacity: 1, transform: "translate(-50%, -50%) scale(1)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", duration: 0.9, bounce: 0.2, delay: 0.7 }}
              className="absolute flex h-40 w-40 flex-col items-center justify-center rounded-full bg-white shadow-[0_30px_60px_-28px_rgba(31,67,184,0.5)] ring-1 ring-line"
              style={{ left: "50%", top: "50%" }}
            >
              <SaathiMark size={64} />
              <span className="mt-1 font-wordmark text-[24px] leading-none text-ink">साथी</span>
            </motion.div>
          </div>

          {/* Mobile: simple list */}
          <ul className="mt-6 grid grid-cols-2 gap-2 md:hidden">
            {stack.map((s, i) => {
              const Glyph = ICONS[i];
              return (
                <li key={s.name} className="flex items-center gap-2.5 rounded-[16px] p-3 ring-1 ring-line">
                  <Glyph size={20} weight="duotone" className="shrink-0 text-navy-600" />
                  <span>
                    <span className="block text-[14px] font-semibold text-ink">{s.name}</span>
                    <span className="block text-[12px] text-ink-3">{s.role}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
