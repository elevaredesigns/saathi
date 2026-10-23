"use client";

import {
  Baby,
  Briefcase,
  Certificate,
  CurrencyInr,
  FirstAidKit,
  GraduationCap,
  HandHeart,
  House,
  IdentificationCard,
  Leaf,
  MapPinArea,
  Receipt,
  ShieldCheck,
  Storefront,
  Van,
  Wheelchair,
  type Icon,
} from "@phosphor-icons/react";

import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { ShowcaseSection, SpecLabel } from "./ShowcaseSection";

const ICONS: { icon: Icon; label: string; tone: TileTone }[] = [
  { icon: Baby, label: "New baby", tone: "saffron" },
  { icon: Briefcase, label: "First job", tone: "navy" },
  { icon: House, label: "Housing", tone: "teal" },
  { icon: GraduationCap, label: "Education", tone: "violet" },
  { icon: FirstAidKit, label: "Health", tone: "green" },
  { icon: Leaf, label: "Farming", tone: "green" },
  { icon: Storefront, label: "Business", tone: "saffron" },
  { icon: IdentificationCard, label: "Identity", tone: "navy" },
  { icon: Certificate, label: "Certificates", tone: "violet" },
  { icon: CurrencyInr, label: "Money", tone: "teal" },
  { icon: Receipt, label: "Taxes & bills", tone: "neutral" },
  { icon: MapPinArea, label: "Land", tone: "saffron" },
  { icon: Van, label: "Transport", tone: "navy" },
  { icon: HandHeart, label: "Welfare", tone: "green" },
  { icon: Wheelchair, label: "Accessibility", tone: "violet" },
  { icon: ShieldCheck, label: "Verified", tone: "green" },
];

export function IconShowcase() {
  return (
    <ShowcaseSection
      id="icons"
      index="04 — Iconography"
      title="One family. Three weights."
      lede="Phosphor throughout: regular for interface chrome, duotone on tinted tiles for services and life moments, fill for the active tab. A consistent grammar a citizen learns once."
    >
      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8" gap={0.025}>
        {ICONS.map((i) => (
          <StaggerItem key={i.label} variant="scale">
            <div className="group flex flex-col items-center gap-3 rounded-lg border border-line px-3 py-5 text-center transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-lift">
              <IconTile icon={i.icon} tone={i.tone} size="lg" className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
              <span className="text-caption font-medium text-ink-2">{i.label}</span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="mt-8 flex flex-wrap items-center gap-8 rounded-panel border border-line p-6">
        <SpecLabel>Sizes</SpecLabel>
        <IconTile icon={FirstAidKit} tone="green" size="sm" />
        <IconTile icon={FirstAidKit} tone="green" size="md" />
        <IconTile icon={FirstAidKit} tone="green" size="lg" />
        <IconTile icon={FirstAidKit} tone="green" size="xl" />
      </div>
    </ShowcaseSection>
  );
}
