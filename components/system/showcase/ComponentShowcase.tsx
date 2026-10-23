"use client";

import { ArrowRight, Clock, Microphone, SealCheck, WarningCircle } from "@phosphor-icons/react";

import { Badge } from "@/components/system/ui/Badge";
import { Button } from "@/components/system/ui/Button";
import { ShowcaseSection, SpecLabel } from "./ShowcaseSection";

export function ComponentShowcase() {
  return (
    <ShowcaseSection
      id="components"
      index="07 — Components"
      title="Pressable, legible, honest."
      lede="Every control answers a touch within a frame. Status is always said in words, never colour alone."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-panel border border-line p-7">
          <SpecLabel>Buttons</SpecLabel>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button iconRight={<ArrowRight size={16} weight="bold" />}>Start application</Button>
            <Button variant="secondary">Save for later</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="dark" iconLeft={<Microphone size={16} weight="fill" />}>
              Ask Saathi
            </Button>
            <Button variant="saffron">Pay ₹2,450</Button>
          </div>
          <div className="mt-6 flex flex-wrap items-end gap-3 border-t border-line pt-6">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg" iconRight={<ArrowRight size={18} weight="bold" />}>
              Large
            </Button>
          </div>
        </div>
        <div className="rounded-panel border border-line p-7">
          <SpecLabel>Badges</SpecLabel>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="green" icon={SealCheck}>
              Aadhaar verified
            </Badge>
            <Badge tone="navy" dot>
              In review
            </Badge>
            <Badge tone="saffron" icon={Clock}>
              Due in 3 days
            </Badge>
            <Badge tone="red" icon={WarningCircle}>
              Document unclear
            </Badge>
            <Badge tone="violet">For you</Badge>
            <Badge>Design target</Badge>
          </div>
        </div>
      </div>
    </ShowcaseSection>
  );
}
