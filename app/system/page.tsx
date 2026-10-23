import type { Metadata } from "next";

import { GovStrip } from "@/components/system/brand/GovStrip";
import { TricolourRule } from "@/components/system/brand/TricolourRule";
import { SmoothScroll } from "@/components/system/motion/SmoothScroll";
import { BrandShowcase } from "@/components/system/showcase/BrandShowcase";
import { ColourShowcase } from "@/components/system/showcase/ColourShowcase";
import { ComponentShowcase } from "@/components/system/showcase/ComponentShowcase";
import { IconShowcase } from "@/components/system/showcase/IconShowcase";
import { ImageryShowcase } from "@/components/system/showcase/ImageryShowcase";
import { MotionShowcase } from "@/components/system/showcase/MotionShowcase";
import { SystemHero } from "@/components/system/showcase/SystemHero";
import { SystemNav } from "@/components/system/showcase/SystemNav";
import { TypeShowcase } from "@/components/system/showcase/TypeShowcase";

export const metadata: Metadata = {
  title: "Bharat Precision — Saathi design system",
  description: "The living design system behind Saathi: colour, type across four scripts, iconography, generative imagery and motion.",
};

export default function SystemPage() {
  return (
    <SmoothScroll>
      <GovStrip />
      <SystemNav />
      <TricolourRule dot={false} className="opacity-80" />
      <main>
        <SystemHero />
        <BrandShowcase />
        <ColourShowcase />
        <TypeShowcase />
        <IconShowcase />
        <ImageryShowcase />
        <MotionShowcase />
        <ComponentShowcase />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-5 py-10 text-caption text-ink-3 sm:px-8">
          <span>Bharat Precision · Saathi 2.0 design system</span>
          <span>A design concept. Not affiliated with the Government of India.</span>
        </div>
      </footer>
    </SmoothScroll>
  );
}
