"use client";

import { Buildings, Check, Clock, CurrencyInr, ListNumbers, SealCheck, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { IconTile } from "@/components/system/ui/IconTile";
import type { ApplyFlow } from "@/lib/applyFlows";
import { loc } from "@/lib/mockData";
import { KIND_VISUAL } from "./kindVisual";

export function ApplyIntro({ flow }: { flow: ApplyFlow }) {
  const t = useTranslations("apply");
  const { locale } = useLocaleSwitch();
  const v = KIND_VISUAL[flow.kind];
  const steps = flow.steps.length + (flow.documents.length ? 1 : 0) + 1;
  const cost = flow.kind === "pay" ? flow.amount : !flow.fee || flow.fee === "Free" ? t("free") : flow.fee;

  const meta: { icon: Icon; label: string; value: string }[] = [
    { icon: Clock, label: t("timeline"), value: loc(flow.timeline, locale) },
    { icon: CurrencyInr, label: flow.kind === "pay" ? t("amountDue") : t("fee"), value: cost ?? t("free") },
    { icon: ListNumbers, label: t("stepsLabel"), value: t("stepsCount", { count: steps }) },
  ];

  return (
    <div className="px-5 pb-6">
      <div className="flex items-center gap-2.5">
        <IconTile icon={v.icon} tone={v.tone} size="sm" />
        <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-ink-3">{t(`kinds.${flow.kind}`)}</span>
      </div>
      <h1 className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[var(--track-tight)] text-ink">{loc(flow.service, locale)}</h1>
      <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{loc(flow.intro, locale)}</p>

      <div className="mt-5 flex items-center gap-3 rounded-[20px] bg-green-50/70 p-3.5 ring-1 ring-inset ring-green-100">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-green-100">
          <SealCheck size={21} weight="fill" className="text-green-600" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-semibold text-ink">{t("submittedTo", { portal: flow.portal })}</span>
          <span className="flex items-center gap-1 text-[12.5px] text-ink-3">
            <Buildings size={13} weight="bold" />
            {loc(flow.department, locale)}
          </span>
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {meta.map((m) => (
          <div key={m.label} className="rounded-[18px] bg-surface p-3">
            <m.icon size={18} weight="duotone" className="text-navy-600" />
            <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.05em] text-ink-3">{m.label}</p>
            <p className="text-[13.5px] font-semibold leading-snug text-ink">{m.value}</p>
          </div>
        ))}
      </div>

      {flow.documents.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[17px] font-semibold text-ink">{t("youllNeed")}</h2>
          <Stagger as="ul" className="mt-2.5 space-y-2" gap={0.05} amount={0}>
            {flow.documents.map((d, i) => (
              <StaggerItem as="li" key={i} className="flex items-center gap-2.5 text-[15px] text-ink-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Check size={12} weight="bold" />
                </span>
                {loc(d, locale)}
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <div className="mt-6 flex items-start gap-3 rounded-[20px] bg-navy-50/60 p-3.5">
        <SaathiOrb size={34} />
        <p className="text-[13.5px] leading-relaxed text-ink-2">{t("prefillNote")}</p>
      </div>
    </div>
  );
}
