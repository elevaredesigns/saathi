"use client";

import { ArrowRight, CheckCircle, Clock, IdentificationCard, Plant, Receipt, type Icon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { IconTile } from "@/components/system/ui/IconTile";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { buildNudges, type NudgeIcon } from "@/lib/data/nudges";
import { ease } from "@/lib/design/motion";
import { loc } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

const ICONS: Record<NudgeIcon, Icon> = { receipt: Receipt, check: CheckCircle, card: IdentificationCard, clock: Clock, plant: Plant };

const CARD_TONE = {
  saffron: "bg-gradient-to-br from-saffron-50 to-white ring-saffron-100",
  green: "bg-gradient-to-br from-green-50 to-white ring-green-100",
  navy: "bg-gradient-to-br from-navy-50 to-white ring-navy-100",
} as const;

const CTA_TONE = { saffron: "text-saffron-700", green: "text-green-800", navy: "text-navy-700" } as const;

/** "Needs attention" — proactive, state-aware nudges in a snap-scrolling rail. */
export function NudgeRail() {
  const t = useTranslations("home");
  const router = useAppRouter();
  const reduce = useReducedMotion();
  const { locale } = useLocaleSwitch();
  const { paidBills, submitted } = usePrototype();
  const nudges = buildNudges({ paidBills, submitted });

  return (
    <section aria-label={t("needsAttention")}>
      <div className="mb-3 flex items-baseline justify-between px-5">
        <h2 className="text-[19px] font-semibold tracking-[-0.012em] text-ink">{t("needsAttention")}</h2>
        <span className="text-[13px] font-medium tabular-nums text-ink-3">{nudges.length}</span>
      </div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scroll-padding-inline:20px]">
        {nudges.map((n, i) => (
          <motion.button
            key={n.id}
            type="button"
            data-reveal
            onClick={() => router.push(n.href)}
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateX(24px)" }}
            animate={{ opacity: 1, transform: "translateX(0px)" }}
            transition={{ duration: 0.5, ease: ease.cinematic, delay: 0.1 + i * 0.06 }}
            className={cn(
              "flex w-[252px] shrink-0 snap-start flex-col rounded-[22px] p-4 text-left ring-1 ring-inset transition-transform duration-150 active:scale-[0.98]",
              CARD_TONE[n.tone],
            )}
          >
            <div className="flex items-start gap-3">
              <IconTile icon={ICONS[n.icon]} tone={n.tone} size="sm" className="bg-white" />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold leading-snug text-ink">{loc(n.title, locale)}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{loc(n.body, locale)}</span>
              </span>
            </div>
            <span className={cn("mt-3 inline-flex items-center gap-1 text-[14px] font-semibold", CTA_TONE[n.tone])}>
              {loc(n.cta, locale)}
              <ArrowRight size={14} weight="bold" />
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
