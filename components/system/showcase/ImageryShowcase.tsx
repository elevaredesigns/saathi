"use client";

import { SealCheck } from "@phosphor-icons/react";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import { KolamField } from "@/components/system/imagery/KolamField";
import { Reveal } from "@/components/system/motion/Reveal";
import { ShowcaseSection, SpecLabel } from "./ShowcaseSection";

export function ImageryShowcase() {
  return (
    <ShowcaseSection
      id="imagery"
      index="05 — Imagery"
      title="No stock photos. No maps."
      lede="Saathi's imagery is generated in code: kolam linework from the dot grids drawn at Indian thresholds every morning and guilloche from the security print on our currency — always on pure white. Distinctive, weightless, and impossible to get wrong on a border."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { seed: 7, density: 0.55, label: "Sikku kolam · woven", tone: "text-navy-600", cols: 6 },
          { seed: 3, density: 0.62, label: "Pulli kolam · diamond", tone: "text-saffron-500", cols: 5, diamond: true },
          { seed: 26, density: 0.65, label: "Kolam · drawn live", tone: "text-green-600", cols: 6, draw: true },
        ].map((k) => (
          <Reveal key={k.seed} variant="scale" className="rounded-panel border border-line p-6">
            <SpecLabel>{k.label}</SpecLabel>
            <div className="mt-6 flex aspect-square items-center justify-center">
              <KolamField
                cols={k.cols}
                rows={k.cols}
                cell={36}
                seed={k.seed}
                density={k.density}
                draw={k.draw}
                diamond={k.diamond}
                className={`w-full ${k.diamond ? "max-w-[250px]" : "max-w-[210px]"} ${k.tone}`}
              />
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1.25fr_1fr]">
        {/* Identity card preview — guilloche as a trust signal */}
        <Reveal variant="up" className="rounded-panel border border-line p-6">
          <SpecLabel>Guilloche on identity</SpecLabel>
          <div className="relative mx-auto mt-6 aspect-[1.586] w-full max-w-[420px] overflow-hidden rounded-[22px] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-600 p-6 text-white shadow-float">
            <Guilloche tone="white" opacity={0.16} className="absolute -right-16 -top-16 h-72 w-72" />
            <Guilloche variant="band" tone="white" opacity={0.12} className="absolute inset-x-0 bottom-0 h-20 w-full" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-caption font-medium uppercase tracking-[0.18em] text-white/75">
                  <SaathiMark size={22} tone="white" /> Saathi ID
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2 py-0.5 text-caption font-medium ring-1 ring-inset ring-white/20">
                  <SealCheck size={13} weight="fill" className="text-green-100" /> Verified
                </span>
              </div>
              <div>
                <p className="text-title font-semibold">Rakesh Verma</p>
                <p className="mt-1 font-mono text-caption tracking-[0.2em] text-white/70">XXXX XXXX 6721</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delay={0.08} className="relative overflow-hidden rounded-panel border border-line p-6">
          <SpecLabel>Kolam texture on white</SpecLabel>
          <div className="relative mt-6 flex aspect-[1.2] items-center justify-center overflow-hidden rounded-[22px] border border-line bg-page">
            <KolamField cols={9} rows={7} cell={30} seed={5} density={0.62} fade className="absolute inset-0 m-auto h-[85%] text-ink/[0.07]" />
            <span className="relative rounded-full bg-white/70 px-4 py-2 text-label font-medium text-ink shadow-soft ring-1 ring-line backdrop-blur">
              Texture, never a tint
            </span>
          </div>
        </Reveal>
      </div>
    </ShowcaseSection>
  );
}
