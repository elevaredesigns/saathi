"use client";

import { CheckCircle, Eye, HandPalm, LockKey, SealCheck, type Icon } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import { SampleQr } from "@/components/prototype/ui/SampleQr";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";

const ICONS: Icon[] = [LockKey, Eye, SealCheck, HandPalm];

export function Trust() {
  const t = useTranslations("site.trust");
  const reduce = useReducedMotion();
  const items = t.raw("items") as { title: string; body: string }[];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -9, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 80, 0]);

  return (
    <section id="trust" className="scroll-mt-20 overflow-x-clip px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-page items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* The receipt artefact */}
        <div ref={ref} className="order-2 flex justify-center lg:order-1">
          <motion.div style={{ rotate, y }} className="relative w-full max-w-[400px]">
            <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_60px_120px_-50px_rgba(10,28,84,0.55)] ring-1 ring-line">
              <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-600 px-6 pb-7 pt-6 text-white">
                <Guilloche tone="white" opacity={0.15} className="absolute -right-20 -top-20 h-72 w-72" />
                <Guilloche variant="band" tone="white" opacity={0.14} className="absolute inset-x-0 bottom-0 h-14 w-full" />
                <div className="relative flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-white/80">
                    <SaathiMark size={20} tone="white" />
                    {t("receipt.label")}
                  </span>
                  <CheckCircle size={22} weight="fill" className="text-[#8BE3AE]" />
                </div>
                <p className="relative mt-6 text-[26px] font-semibold tracking-[-0.02em]">{t("receipt.title")}</p>
                <p className="relative mt-1 text-[40px] font-semibold leading-none tracking-[-0.03em]">{t("receipt.amount")}</p>
              </div>
              <dl className="divide-y divide-dashed divide-line px-6">
                <div className="flex justify-between py-3 text-[14.5px]">
                  <dt className="text-ink-3">{t("receipt.refLabel")}</dt>
                  <dd className="font-mono font-semibold text-ink">{t("receipt.ref")}</dd>
                </div>
                <div className="flex justify-between py-3 text-[14.5px]">
                  <dt className="text-ink-3">{t("receipt.toLabel")}</dt>
                  <dd className="font-semibold text-ink">{t("receipt.to")}</dd>
                </div>
                <div className="flex justify-between py-3 text-[14.5px]">
                  <dt className="text-ink-3">{t("receipt.dateLabel")}</dt>
                  <dd className="font-semibold text-ink">{t("receipt.date")}</dd>
                </div>
              </dl>
              <div className="flex items-center gap-4 border-t border-dashed border-line px-6 py-5">
                <div className="relative rounded-[10px] p-1 ring-1 ring-line">
                  <SampleQr size={72} seed={190302} />
                </div>
                <div>
                  <p className="text-[14.5px] font-semibold text-ink">{t("receipt.verify")}</p>
                  <p className="mt-0.5 inline-block rounded-full bg-saffron-50 px-2 py-0.5 text-[11px] font-bold text-saffron-700">{t("receipt.sample")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2">
          <TextReveal as="h2" text={t("title")} className="text-h1 text-ink" />
          <Reveal>
            <p className="mt-6 max-w-xl text-[20px] leading-relaxed text-ink-2">{t("intro")}</p>
          </Reveal>
          <ul className="mt-12 space-y-8">
            {items.map((it, i) => {
              const Glyph = ICONS[i];
              return (
                <Reveal as="li" key={it.title} delay={i * 0.06} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <Glyph size={22} weight="duotone" />
                  </span>
                  <div>
                    <p className="text-[18px] font-semibold text-ink">{it.title}</p>
                    <p className="mt-1 max-w-lg text-[16px] leading-relaxed text-ink-2">{it.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
          <Reveal>
            <p className="mt-12 border-t border-line pt-6 text-[15px] text-ink-3">{t("standards")}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
