"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { KolamField } from "@/components/system/imagery/KolamField";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { Badge } from "@/components/system/ui/Badge";
import { ease } from "@/lib/design/motion";

const FACTS = [
  { k: "Base", v: "#FFFFFF" },
  { k: "Scripts", v: "Latin · Devanagari · Bengali · Tamil" },
  { k: "Standard", v: "Designed to WCAG 2.1 AA · GIGW 3.0 · UX4G" },
];

export function SystemHero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      <KolamField
        cols={20} rows={9} cell={56} seed={1947} density={0.58}
        draw
        drawDuration={5}
        fade
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-navy-600/[0.08]"
      />
      <div className="relative mx-auto max-w-page px-5 pb-20 pt-20 sm:px-8 md:pb-28 md:pt-28">
        <motion.div
          data-reveal
          initial={reduce ? false : { opacity: 0, transform: "translateY(10px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.6, ease: ease.out }}
          className="flex items-center gap-3"
        >
          <SaathiOrb size={36} />
          <Badge tone="navy">Saathi 2.0 · Design system</Badge>
        </motion.div>

        <TextReveal
          immediate
          as="h1"
          delay={0.1}
          text="Bharat Precision."
          accent={["Precision."]}
          accentClassName="font-serif italic font-normal tracking-[-0.02em] text-navy-600"
          className="mt-8 text-display-2xl text-ink"
        />
        <motion.p
          data-reveal
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: ease.out, delay: 0.7 }}
          className="mt-6 max-w-2xl text-body-l text-ink-2 md:text-[21px]"
        >
          The system behind Saathi — calm enough to trust with a pension, precise enough to feel world-class, and built for
          every script India reads.
        </motion.p>

        <motion.dl
          data-reveal
          initial={reduce ? false : { opacity: 0, transform: "translateY(10px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.8, ease: ease.out, delay: 0.9 }}
          className="mt-14 grid max-w-3xl gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3"
        >
          {FACTS.map((f) => (
            <div key={f.k} className="bg-white/85 px-5 py-4 backdrop-blur">
              <dt className="text-caption uppercase tracking-[0.14em] text-ink-3">{f.k}</dt>
              <dd className="mt-1 text-label font-medium text-ink">{f.v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
