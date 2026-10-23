"use client";

import { ArrowClockwise } from "@phosphor-icons/react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useState } from "react";

import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { CountUp } from "@/components/system/motion/CountUp";
import { ScrollScene } from "@/components/system/motion/ScrollScene";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { Button } from "@/components/system/ui/Button";
import { ShowcaseSection, SpecLabel } from "./ShowcaseSection";

const TOKENS = [
  { name: "tap", value: "spring 0.25s · bounce 0", use: "Press feedback" },
  { name: "ui", value: "spring 0.35s · bounce 0.08", use: "Menus, cards" },
  { name: "layout", value: "spring 0.5s · bounce 0.14", use: "Shared-element morphs" },
  { name: "cinematic", value: "0.9s · cubic-bezier(0.16,1,0.3,1)", use: "Scroll stories" },
];

function SceneStage({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 0.5, 1], [0.8, 1, 1.08]);
  const rotate = useTransform(progress, [0, 1], [-8, 8]);
  const radius = useTransform(progress, [0, 1], [48, 20]);
  const bar = useTransform(progress, [0, 1], ["0%", "100%"]);
  const label = useTransform(progress, (v) => `${Math.round(v * 100)}%`);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
      <motion.div
        style={{ scale, rotate, borderRadius: radius }}
        className="flex h-48 w-48 items-center justify-center bg-gradient-to-br from-navy-900 to-navy-600 shadow-float"
      >
        <SaathiOrb state="thinking" size={96} />
      </motion.div>
      <div className="w-full max-w-sm">
        <div className="h-1 overflow-hidden rounded-full bg-surface2">
          <motion.div style={{ width: bar }} className="h-full rounded-full bg-navy-600" />
        </div>
        <motion.p className="mt-3 text-center font-mono text-caption text-ink-3">{label}</motion.p>
      </div>
    </div>
  );
}

export function MotionShowcase() {
  const [replay, setReplay] = useState(0);

  return (
    <ShowcaseSection
      id="motion"
      index="06 — Motion"
      title="Fast where you act. Slow where you feel."
      lede="Interface motion stays under 300ms with strong ease-out and interruptible springs. Storytelling motion is allowed to breathe. Everything collapses to gentle fades for people who prefer reduced motion."
    >
      <div className="rounded-panel border border-line p-8 md:p-12">
        <div className="flex items-center justify-between gap-4">
          <SpecLabel>Word reveal · space-split, safe for Indic conjuncts</SpecLabel>
          <Button variant="secondary" size="sm" onClick={() => setReplay((r) => r + 1)} iconLeft={<ArrowClockwise size={14} weight="bold" />}>
            Replay
          </Button>
        </div>
        <div key={replay} className="mt-8 space-y-4">
          <TextReveal immediate as="p" text="One door to every government service." accent={["door"]} className="text-display-xl text-ink" />
          <TextReveal immediate as="p" delay={0.5} text="हर सरकारी सेवा का एक द्वार।" className="font-display text-h1 text-ink-2" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          { v: 1400000000, f: (n: number) => `${(n / 1e7).toFixed(0)} Cr`, l: "Aadhaar numbers generated (approx.)" },
          { v: 22, f: (n: number) => `${Math.round(n)}`, l: "Scheduled languages" },
          { v: 2047, f: (n: number) => `${Math.round(n)}`, l: "Viksit Bharat" },
        ].map((s) => (
          <div key={s.l} className="rounded-panel border border-line p-7">
            <CountUp value={s.v} format={s.f} className="text-h1 text-ink" />
            <p className="mt-2 text-label text-ink-3">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.2fr]">
        <div className="rounded-panel border border-line p-7">
          <SpecLabel>Tokens</SpecLabel>
          <dl className="mt-6 divide-y divide-line">
            {TOKENS.map((t) => (
              <div key={t.name} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="font-mono text-mono text-ink">{t.name}</dt>
                <dd className="text-right">
                  <span className="block font-mono text-caption text-ink-2">{t.value}</span>
                  <span className="block text-caption text-ink-3">{t.use}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-panel border border-line p-7">
          <SpecLabel>Stagger · 40ms</SpecLabel>
          <Stagger key={replay} className="mt-6 grid grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <StaggerItem key={i} variant="up">
                <div className="aspect-square rounded-md bg-gradient-to-br from-navy-50 to-navy-100 ring-1 ring-inset ring-navy-100" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {/* overflow-clip (not hidden): a hidden overflow makes the card a scroll
          container, which silently disables the sticky stage inside it. */}
      <div className="mt-4 overflow-clip rounded-panel border border-line">
        <div className="flex items-center justify-between border-b border-line px-7 py-4">
          <SpecLabel>Pinned scroll scene · keep scrolling</SpecLabel>
          <span className="font-mono text-caption text-ink-3">useScroll → useTransform</span>
        </div>
        <ScrollScene height="max(130vh, 980px)" className="bg-surface" stageClassName="top-[max(3.5rem,calc(50vh-260px))] h-[520px]">
          {(progress) => <SceneStage progress={progress} />}
        </ScrollScene>
      </div>
    </ShowcaseSection>
  );
}
