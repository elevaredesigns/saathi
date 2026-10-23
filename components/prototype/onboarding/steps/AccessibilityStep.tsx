"use client";

import { CircleHalf, Microphone, SpeakerHigh, TextAa, Timer, type Icon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "@/components/prototype/ui/Button";
import { Toggle } from "@/components/prototype/ui/Toggle";
import { usePrototype, type AccessibilityPrefs } from "@/lib/context/PrototypeContext";
import { spring } from "@/lib/design/motion";
import { cn } from "@/lib/utils";
import { StepShell } from "../StepShell";

const ROWS: { key: keyof AccessibilityPrefs; icon: Icon }[] = [
  { key: "voiceHelp", icon: Microphone },
  { key: "largeText", icon: TextAa },
  { key: "slowMode", icon: Timer },
  { key: "audioLabels", icon: SpeakerHigh },
  { key: "highContrast", icon: CircleHalf },
];

export function AccessibilityStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("onboarding.accessibility");
  const { accessibility, setAccessibility } = usePrototype();

  return (
    <StepShell title={t("title")} subtitle={t("subtitle")} footer={<Button fullWidth onClick={onNext}>{t("cta")}</Button>}>
      {/* Live preview reacts to the toggles */}
      <motion.div
        layout
        transition={spring.layout}
        className={cn("mb-4 rounded-[20px] p-4 ring-1", accessibility.highContrast ? "bg-ink text-white ring-ink" : "bg-surface text-ink ring-line")}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] opacity-60">{t("preview")}</p>
        <motion.p layout transition={spring.layout} className={cn("mt-1.5 font-semibold leading-snug", accessibility.largeText ? "text-[21px]" : "text-[16px]")}>
          {t("previewText")}
        </motion.p>
      </motion.div>

      <div className="divide-y divide-line overflow-hidden rounded-[20px] ring-1 ring-line">
        {ROWS.map(({ key, icon: Glyph }) => (
          <div key={key} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-navy-50 text-navy-600">
              <Glyph size={19} weight="duotone" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-semibold text-ink">{t(`options.${key}.label`)}</div>
              <div className="text-[12.5px] text-ink-3">{t(`options.${key}.desc`)}</div>
            </div>
            <Toggle
              checked={accessibility[key]}
              onChange={(v) => setAccessibility({ [key]: v } as Partial<AccessibilityPrefs>)}
              label={t(`options.${key}.label`)}
            />
          </div>
        ))}
      </div>
    </StepShell>
  );
}
