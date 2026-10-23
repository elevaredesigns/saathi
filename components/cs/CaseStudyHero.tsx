"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { TextReveal } from "@/components/system/motion/TextReveal";
import { ease } from "@/lib/design/motion";
import { LivePhone } from "@/components/site/LivePhone";

export function CaseStudyHero() {
  const t = useTranslations("caseStudy.cs");
  const reduce = useReducedMotion();
  const meta = t.raw("meta") as { label: string; value: string }[];
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 0.8, ease: ease.cinematic, delay },
    style: { "--d": `${delay}s` } as React.CSSProperties,
  });

  return (
    <section data-hero className="px-5 pb-16 pt-14 sm:px-8 md:pb-24 md:pt-20">
      <div className="mx-auto grid max-w-page items-end gap-12 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <TextReveal immediate as="h1" text={t("title")} className="max-w-[16ch] text-[clamp(42px,5.2vw,80px)] font-semibold leading-[var(--lh-tight)] tracking-[var(--track-display)] text-ink" />
          <motion.p data-reveal {...rise(0.45)} className="mt-6 max-w-[56ch] text-[20px] leading-relaxed text-ink-2">
            {t("lede")}
          </motion.p>
          <motion.dl data-reveal {...rise(0.6)} className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-2">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[13.5px] font-medium text-ink-3">{m.label}</dt>
                <dd className="mt-1 text-[16px] font-medium text-ink">{m.value}</dd>
              </div>
            ))}
          </motion.dl>
          <motion.div data-reveal {...rise(0.72)} className="mt-9">
            <Link href="/prototype/" className="inline-flex h-13 h-[52px] items-center rounded-full bg-navy-600 px-6 text-[16px] font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-navy-700 active:scale-[0.97]">
              {t("openPrototype")}
            </Link>
          </motion.div>
        </div>
        <motion.div
          data-reveal
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(40px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ type: "spring", duration: 1.1, bounce: 0.12, delay: 0.2 }}
          style={{ "--d": "0.2s" } as React.CSSProperties}
          className="hidden lg:block"
        >
          <LivePhone src="/prototype/explore/" scale={0.58} title="Saathi prototype — Explore" priority />
        </motion.div>
      </div>
    </section>
  );
}
