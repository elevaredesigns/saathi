"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { ease } from "@/lib/design/motion";

interface Pillar {
  word: string;
  name: string;
  meaning: string;
  promise: string;
  story: string;
  link: string;
  href: string;
}

export function Pillars() {
  const t = useTranslations("site.pillars");
  const reduce = useReducedMotion();
  const items = t.raw("items") as Pillar[];

  return (
    <section id="pillars" className="scroll-mt-20 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-page">
        <div className="max-w-3xl">
          <TextReveal as="h2" text={t("title")} className="text-h1 text-ink" />
          <Reveal>
            <p className="mt-6 text-[20px] leading-relaxed text-ink-2">{t("intro")}</p>
          </Reveal>
        </div>

        <ol className="mt-16 border-t border-line">
          {items.map((p) => (
            <li key={p.name} className="group grid gap-6 border-b border-line py-10 md:grid-cols-[minmax(220px,0.9fr)_1.1fr_1fr] md:gap-10 md:py-14">
              {/* The observer sits on the wrapper: a fully clipped element never reports as in view. */}
              <motion.div className="relative" initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.5 }}>
                <motion.p
                  data-reveal
                  lang="hi"
                  variants={reduce ? { hidden: { opacity: 0 }, shown: { opacity: 1 } } : { hidden: { clipPath: "inset(0 100% 0 0)" }, shown: { clipPath: "inset(0 0% 0 0)" } }}
                  transition={{ duration: 1, ease: ease.inOut }}
                  className="font-wordmark text-[clamp(56px,6vw,88px)] leading-[1.05] text-ink"
                >
                  {p.word}
                </motion.p>
                <p className="mt-2 text-[16px] font-semibold text-ink">{p.name}</p>
                <p className="text-[15px] text-ink-3">{p.meaning}</p>
              </motion.div>

              <Reveal delay={0.08}>
                <p className="text-[clamp(22px,2.2vw,30px)] font-semibold leading-snug tracking-[-0.015em] text-ink">{p.promise}</p>
              </Reveal>

              <Reveal delay={0.16} className="flex flex-col justify-between gap-5">
                <p className="text-[17px] leading-relaxed text-ink-2">{p.story}</p>
                <Link href={p.href} className="inline-flex items-center gap-1.5 self-start rounded-full py-1 text-[15px] font-semibold text-navy-600 underline-offset-4 hover:underline">
                  {p.link}
                  <ArrowUpRight size={15} weight="bold" className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
