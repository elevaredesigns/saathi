"use client";

import { ArrowClockwise } from "@phosphor-icons/react";
import { useState } from "react";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { SaathiOrb, type OrbState } from "@/components/system/brand/SaathiOrb";
import { TricolourRule } from "@/components/system/brand/TricolourRule";
import { Wordmark } from "@/components/system/brand/Wordmark";
import { KolamField } from "@/components/system/imagery/KolamField";
import { Button } from "@/components/system/ui/Button";
import { ShowcaseSection, SpecLabel } from "./ShowcaseSection";

const ORB_STATES: { state: OrbState; label: string; note: string }[] = [
  { state: "idle", label: "Idle", note: "Aurora drifts, disc breathes" },
  { state: "listening", label: "Listening", note: "Ripples reach outward" },
  { state: "thinking", label: "Working", note: "Arcs trace in and out" },
  { state: "speaking", label: "Responding", note: "Arcs pulse with speech" },
];

export function BrandShowcase() {
  const [replay, setReplay] = useState(0);

  return (
    <ShowcaseSection
      id="brand"
      index="01 — Brand"
      title="Two arcs and a point."
      lede="Saffron and navy arcs are companionship and an open door; the green point is the citizen they hold. The tricolour, abstracted — no national emblem required."
    >
      <div className="relative overflow-hidden rounded-panel border border-line bg-page">
        <KolamField
          cols={16} rows={7} cell={52} seed={2047} density={0.6}
          fade
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full text-navy-600/[0.09]"
        />
        <div className="relative flex min-h-[360px] flex-col items-start justify-end gap-8 p-8 md:min-h-[440px] md:p-14">
          <Wordmark key={replay} size="xl" lockup="stacked" reveal />
          <div className="flex w-full flex-wrap items-end justify-between gap-4">
            <p className="max-w-md text-body text-ink-2">
              Tiro Devanagari carries the wordmark — the one expressive face in an otherwise precise system.
            </p>
            <Button variant="secondary" size="sm" onClick={() => setReplay((r) => r + 1)} iconLeft={<ArrowClockwise size={14} weight="bold" />}>
              Replay reveal
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-panel border border-line p-8">
          <SpecLabel>The mark</SpecLabel>
          <div className="mt-8 flex min-h-[112px] items-center justify-between gap-4 sm:justify-start sm:gap-8">
            <SaathiMark key={`m-${replay}`} size={96} draw />
            <SaathiMark size={56} />
            <SaathiMark size={32} />
            <span className="flex h-12 w-12 items-center justify-center rounded-tile bg-ink">
              <SaathiMark size={32} tone="white" />
            </span>
          </div>
          <TricolourRule className="mt-10" />
          <p className="mt-4 text-label text-ink-3">Tricolour rule — saffron · chakra point · green. A 2px signal, never decoration.</p>
        </div>

        <div className="rounded-panel border border-line p-8">
          <SpecLabel>Saathi AI — the orb</SpecLabel>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
            {ORB_STATES.map((o) => (
              <div key={o.state} className="flex flex-col items-center text-center">
                <span className="flex h-[96px] w-[96px] items-center justify-center">
                  <SaathiOrb state={o.state} size={72} />
                </span>
                <p className="mt-3 text-label font-semibold text-ink">{o.label}</p>
                <p className="mt-1 max-w-[16ch] text-caption leading-snug text-ink-3">{o.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShowcaseSection>
  );
}
