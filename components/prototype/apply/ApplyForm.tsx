"use client";

import { Microphone, Waveform } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Field } from "@/components/prototype/ui/Field";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import type { ApplyStep } from "@/lib/applyFlows";
import { loc } from "@/lib/mockData";

export function ApplyForm({
  step,
  index,
  total,
  values,
  highlight,
  onChange,
  onVoice,
}: {
  step: ApplyStep;
  index: number;
  total: number;
  values: Record<string, string>;
  highlight: string[];
  onChange: (id: string, value: string) => void;
  onVoice: () => void;
}) {
  const t = useTranslations("apply");
  const tv = useTranslations("voice");
  const { locale } = useLocaleSwitch();

  return (
    <div className="px-5 pb-6">
      <p className="text-[13px] font-semibold text-ink-3">{t("step", { n: index + 1, total })}</p>
      <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-[var(--track-tight)] text-ink">{loc(step.title, locale)}</h1>

      {step.voice && (
        <button
          type="button"
          onClick={onVoice}
          className="mt-5 flex w-full items-center gap-3 rounded-[20px] bg-ink p-3 pr-4 text-left text-white shadow-[0_14px_30px_-16px_rgba(11,13,20,0.6)] transition-transform duration-150 active:scale-[0.99]"
        >
          <SaathiOrb size={40} />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold">{tv("cardTitle")}</span>
            <span className="block text-[12.5px] text-white/65">{tv("cardSub")}</span>
          </span>
          <Waveform size={22} weight="bold" className="text-saffron-300" />
        </button>
      )}

      <Stagger key={index} className="mt-5 space-y-4" gap={0.05} amount={0}>
        {step.fields.map((f) => (
          <StaggerItem key={f.id}>
            <Field
              label={loc(f.label, locale)}
              type={f.type ?? "text"}
              value={f.type === "readout" ? f.value ?? "" : values[f.id] ?? ""}
              options={f.options}
              placeholder={f.placeholder}
              selectPrompt={t("selectPrompt")}
              highlight={highlight.includes(f.id)}
              onChange={(v) => onChange(f.id, v)}
              trailing={
                step.voice && f.type !== "readout" && f.type !== "select" ? (
                  <button type="button" aria-label={t("fillByVoice")} onClick={onVoice} className="flex h-10 w-10 items-center justify-center rounded-full text-ink-3 active:bg-surface">
                    <Microphone size={18} weight="duotone" />
                  </button>
                ) : undefined
              }
            />
          </StaggerItem>
        ))}
      </Stagger>
      {step.note && <p className="mt-4 text-[13px] text-ink-3">{loc(step.note, locale)}</p>}
    </div>
  );
}
