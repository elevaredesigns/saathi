"use client";

import { Door, Microphone, Translate, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/prototype/ui/Button";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { KolamField } from "@/components/system/imagery/KolamField";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { StepShell } from "../StepShell";

const POINTS: { icon: Icon; tone: TileTone }[] = [
  { icon: Door, tone: "navy" },
  { icon: Translate, tone: "saffron" },
  { icon: Microphone, tone: "green" },
];

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("onboarding.welcome");
  const points = t.raw("points") as { title: string; body: string }[];

  return (
    <StepShell footer={<Button fullWidth onClick={onNext}>{t("cta")}</Button>}>
      <div className="relative -mx-6 -mt-7 flex h-[220px] items-center justify-center overflow-hidden">
        <KolamField cols={5} rows={5} cell={44} seed={11} density={0.6} diamond draw drawDuration={2} className="absolute h-[300px] w-[300px] text-saffron-400/70" />
        <span className="relative rounded-full bg-white p-4 shadow-float ring-1 ring-line">
          <SaathiMark size={56} />
        </span>
      </div>
      <h1 className="text-[28px] font-semibold leading-[1.15] tracking-[var(--track-tight)] text-ink">{t("title")}</h1>
      <p className="mt-2.5 text-[16px] leading-relaxed text-ink-2">{t("body")}</p>
      <Stagger className="mt-6 space-y-3" delay={0.25} gap={0.08}>
        {points.map((p, i) => (
          <StaggerItem key={p.title} className="flex items-start gap-3.5">
            <IconTile icon={POINTS[i].icon} tone={POINTS[i].tone} size="md" />
            <span className="pt-0.5">
              <span className="block text-[15.5px] font-semibold text-ink">{p.title}</span>
              <span className="block text-[14px] leading-snug text-ink-3">{p.body}</span>
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </StepShell>
  );
}
