"use client";

import {
  ArrowRight,
  Check,
  Desktop,
  DeviceMobile,
  ListMagnifyingGlass,
  Storefront,
  Vault,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { ease } from "@/lib/design/motion";

/*
 * The judges' question: "These apps already exist — why Saathi?" Each existing
 * tool gets a fair line on what it does well and what is still missing, then what
 * Saathi adds. Saathi is the door that uses them, not a replacement for them.
 */

const ICONS: Icon[] = [DeviceMobile, Vault, ListMagnifyingGlass, Desktop, Storefront];

export function WhySaathi() {
  const t = useTranslations("site.why");
  const reduce = useReducedMotion();
  const tools = t.raw("tools") as { name: string; good: string; missing: string }[];
  const only = t.raw("only") as { title: string; body: string }[];

  return (
    <section id="why" className="scroll-mt-20 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-page">
        <div className="max-w-3xl">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-navy-600">{t("eyebrow")}</p>
          <TextReveal as="h2" text={t("title")} className="mt-4 text-h1 text-ink" />
          <Reveal>
            <p className="mt-6 text-[20px] leading-relaxed text-ink-2">{t("intro")}</p>
          </Reveal>
        </div>

        {/* what exists today, fairly */}
        <ul className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {tools.map((tool, i) => {
            const Glyph = ICONS[i];
            return (
              <Reveal as="li" key={tool.name} delay={i * 0.05} className="flex flex-col rounded-[20px] bg-white p-5 ring-1 ring-line">
                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-surface2 text-ink-2">
                  <Glyph size={21} weight="duotone" />
                </span>
                <p className="mt-4 text-[17px] font-semibold text-ink">{tool.name}</p>
                <p className="mt-3 flex gap-2 text-[14px] leading-relaxed text-ink-2">
                  <Check size={16} weight="bold" className="mt-[3px] shrink-0 text-green-600" />
                  <span>{tool.good}</span>
                </p>
                <p className="mt-2 flex gap-2 text-[14px] leading-relaxed text-ink-3">
                  <X size={16} weight="bold" className="mt-[3px] shrink-0 text-ink-4" />
                  <span>{tool.missing}</span>
                </p>
              </Reveal>
            );
          })}
        </ul>

        {/* the answer */}
        <Reveal>
          <div className="relative mt-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-600 p-7 text-white sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="flex shrink-0 items-center gap-4">
                <motion.span
                  initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: "spring", duration: 0.7, bounce: 0.25 }}
                  className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white"
                >
                  <SaathiMark size={46} />
                </motion.span>
                <ArrowRight size={28} weight="bold" className="hidden text-white/50 lg:block" />
              </div>
              <div>
                <p className="text-[clamp(22px,2.6vw,32px)] font-semibold leading-snug tracking-[-0.015em]">{t("answer.title")}</p>
                <p className="mt-3 max-w-3xl text-[16.5px] leading-relaxed text-white/80">{t("answer.body")}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* what only Saathi brings together */}
        <h3 className="mt-16 text-[24px] font-semibold tracking-[-0.015em] text-ink">{t("onlyTitle")}</h3>
        <ol className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
          {only.map((o, i) => (
            <motion.li
              key={o.title}
              initial={reduce ? false : { opacity: 0, transform: "translateY(10px)" }}
              whileInView={{ opacity: 1, transform: "translateY(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, ease: ease.out, delay: (i % 3) * 0.06 }}
              className="flex gap-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saffron-50 text-[14px] font-semibold text-saffron-700 ring-1 ring-inset ring-saffron-100">{i + 1}</span>
              <div>
                <p className="text-[16.5px] font-semibold text-ink">{o.title}</p>
                <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{o.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <Reveal>
          <p className="mt-12 border-t border-line pt-6 text-[14px] leading-relaxed text-ink-3">{t("fair")}</p>
        </Reveal>
      </div>
    </section>
  );
}
