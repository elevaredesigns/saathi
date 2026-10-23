"use client";

import { Check, X } from "@phosphor-icons/react";

import { StaggerItem, Stagger } from "@/components/system/motion/Stagger";
import { contrastRatio, wcagLevel } from "@/lib/design/contrast";
import { palette } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";
import { ShowcaseSection, SpecLabel } from "./ShowcaseSection";

type Swatch = { name: string; hex: string };

const GROUPS: { title: string; note: string; swatches: Swatch[] }[] = [
  {
    title: "Chakra Navy",
    note: "Primary action, links, focus, authority",
    swatches: ([50, 100, 200, 400, 500, 600, 700, 800, 900] as const).map((k) => ({ name: `navy-${k}`, hex: palette.navy[k] })),
  },
  {
    title: "Saffron",
    note: "Highlight and glow — text only at 700",
    swatches: ([50, 100, 300, 400, 500, 700] as const).map((k) => ({ name: `saffron-${k}`, hex: palette.saffron[k] })),
  },
  {
    title: "India Green",
    note: "Success, approved, verified",
    swatches: ([50, 100, 500, 600, 800] as const).map((k) => ({ name: `green-${k}`, hex: palette.green[k] })),
  },
  {
    title: "Neutrals",
    note: "White base, cool greys, ink",
    swatches: [
      { name: "page", hex: palette.base },
      { name: "surface", hex: palette.surface },
      { name: "surface-2", hex: palette.surface2 },
      { name: "line", hex: palette.line },
      { name: "ink-4", hex: palette.ink[4] },
      { name: "ink-3", hex: palette.ink[3] },
      { name: "ink-2", hex: palette.ink[2] },
      { name: "ink", hex: palette.ink.DEFAULT },
    ],
  },
];

function SwatchCard({ s }: { s: Swatch }) {
  const onWhite = contrastRatio(s.hex, "#FFFFFF");
  const level = wcagLevel(onWhite);
  const light = onWhite < 3; // swatch is light → print dark text on it
  const pass = level === "AA" || level === "AAA";
  return (
    <div className="overflow-hidden rounded-md ring-1 ring-line">
      <div
        className={cn("flex h-20 items-start justify-end p-2", light ? "text-ink" : "text-white")}
        style={{ background: s.hex }}
      >
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 font-mono text-[10px] leading-5 backdrop-blur",
            pass ? "bg-white/85 text-green-800" : light ? "bg-white/60 text-ink-3" : "bg-white/20 text-white",
          )}
          title="Contrast as text on white"
        >
          {pass ? <Check size={9} weight="bold" /> : <X size={9} weight="bold" />}
          {onWhite.toFixed(1)}
        </span>
      </div>
      <div className="bg-page px-2.5 py-2">
        <span className="block text-caption font-medium text-ink">{s.name}</span>
        <span className="block font-mono text-[11px] text-ink-3">{s.hex}</span>
      </div>
    </div>
  );
}

export function ColourShowcase() {
  return (
    <ShowcaseSection
      id="colour"
      index="02 — Colour"
      title="White first. Colour means something."
      lede="Palette logic follows UX4G, the Government of India design system. Each chip shows its contrast as text on white — every text pairing in the product is tested to WCAG 2.1 AA in code."
    >
      <div className="space-y-12">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-title text-ink">{g.title}</p>
              <SpecLabel>{g.note}</SpecLabel>
            </div>
            <Stagger className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9" gap={0.03}>
              {g.swatches.map((s) => (
                <StaggerItem key={s.name} variant="scale">
                  <SwatchCard s={s} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        ))}

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-panel bg-navy-600 p-6 text-white">
            <p className="text-caption uppercase tracking-[0.14em] text-white/70">Action</p>
            <p className="mt-6 text-h3">Apply now</p>
            <p className="mt-1 font-mono text-caption text-white/80">white on navy-600 · {contrastRatio("#FFFFFF", palette.navy[600]).toFixed(2)}:1</p>
          </div>
          <div className="rounded-panel bg-saffron-50 p-6">
            <p className="text-caption uppercase tracking-[0.14em] text-saffron-700">Attention</p>
            <p className="mt-6 text-h3 text-ink">Due in 3 days</p>
            <p className="mt-1 font-mono text-caption text-saffron-700">saffron-700 on saffron-50 · {contrastRatio(palette.saffron[700], palette.saffron[50]).toFixed(2)}:1</p>
          </div>
          <div className="rounded-panel bg-green-50 p-6">
            <p className="text-caption uppercase tracking-[0.14em] text-green-800">Outcome</p>
            <p className="mt-6 text-h3 text-ink">Approved</p>
            <p className="mt-1 font-mono text-caption text-green-800">green-800 on green-50 · {contrastRatio(palette.green[800], palette.green[50]).toFixed(2)}:1</p>
          </div>
        </div>
      </div>
    </ShowcaseSection>
  );
}
