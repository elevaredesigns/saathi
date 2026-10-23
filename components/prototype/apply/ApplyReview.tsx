"use client";

import { Check, PencilSimple, ShieldCheck } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import type { ApplyFlow } from "@/lib/applyFlows";
import { spring } from "@/lib/design/motion";
import { loc } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function ApplyReview({
  flow,
  values,
  docsCount,
  declared,
  onDeclare,
  onEdit,
}: {
  flow: ApplyFlow;
  values: Record<string, string>;
  docsCount: number;
  declared: boolean;
  onDeclare: (v: boolean) => void;
  onEdit: (stepIndex: number) => void;
}) {
  const t = useTranslations("apply");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();

  return (
    <div className="px-5 pb-6">
      <h1 className="text-[26px] font-semibold leading-tight tracking-[var(--track-tight)] text-ink">{t("reviewTitle")}</h1>
      <p className="mt-2 text-[15px] text-ink-2">{t("reviewSub", { portal: flow.portal })}</p>

      <div className="mt-5 space-y-3">
        {flow.steps.map((step, si) => (
          <section key={si} className="overflow-hidden rounded-[20px] ring-1 ring-line">
            <div className="flex items-center justify-between bg-surface px-4 py-2.5">
              <p className="text-[13px] font-semibold text-ink-2">{loc(step.title, locale)}</p>
              <button type="button" onClick={() => onEdit(si)} className="flex items-center gap-1 text-[13px] font-semibold text-navy-600">
                <PencilSimple size={13} weight="bold" />
                {t("edit")}
              </button>
            </div>
            <dl className="divide-y divide-line">
              {step.fields.map((f) => {
                const value = f.type === "readout" ? f.value : values[f.id];
                return (
                  <div key={f.id} className="flex items-start justify-between gap-4 px-4 py-2.5">
                    <dt className="text-[13px] text-ink-3">{loc(f.label, locale)}</dt>
                    <dd className={cn("text-right text-[14.5px] font-medium", value ? "text-ink" : "text-ink-4")}>{value || "—"}</dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}

        {docsCount > 0 && (
          <div className="flex items-center gap-2 rounded-[18px] bg-green-50/70 px-4 py-3 text-[14px] font-semibold text-green-800 ring-1 ring-inset ring-green-100">
            <ShieldCheck size={18} weight="fill" className="text-green-600" />
            {t("docsVerified", { count: docsCount })}
          </div>
        )}

        {flow.kind === "pay" && flow.amount && (
          <div className="flex items-center justify-between rounded-[20px] bg-saffron-50 px-4 py-4 ring-1 ring-inset ring-saffron-100">
            <span className="text-[15px] font-semibold text-saffron-700">{t("amountDue")}</span>
            <span className="text-[26px] font-semibold tabular-nums tracking-[-0.02em] text-ink">{flow.amount}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        role="checkbox"
        aria-checked={declared}
        onClick={() => onDeclare(!declared)}
        className={cn(
          "mt-5 flex w-full items-start gap-3 rounded-[18px] p-3.5 text-left ring-1 ring-inset transition-colors duration-200",
          declared ? "bg-navy-50/70 ring-navy-200" : "bg-white ring-line-strong",
        )}
      >
        <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] transition-colors duration-200", declared ? "bg-navy-600 text-white" : "bg-white ring-2 ring-inset ring-line-strong")}>
          {declared && (
            <motion.span initial={reduce ? false : { transform: "scale(0.5)" }} animate={{ transform: "scale(1)" }} transition={spring.ui}>
              <Check size={15} weight="bold" />
            </motion.span>
          )}
        </span>
        <span className="text-[13.5px] leading-relaxed text-ink-2">{t("declaration", { department: loc(flow.department, locale) })}</span>
      </button>
    </div>
  );
}
