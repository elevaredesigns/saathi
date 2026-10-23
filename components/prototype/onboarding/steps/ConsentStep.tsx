"use client";

import { ArrowRight, CalendarBlank, Camera, House, IdentificationBadge, Target, UserCircle, Vault, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Button } from "@/components/prototype/ui/Button";
import { Toggle } from "@/components/prototype/ui/Toggle";
import { StepShell } from "../StepShell";

const ITEMS: { key: "name" | "dob" | "address" | "photo"; icon: Icon }[] = [
  { key: "name", icon: UserCircle },
  { key: "dob", icon: CalendarBlank },
  { key: "address", icon: House },
  { key: "photo", icon: Camera },
];

/**
 * Consent at the moment it's needed (DPDP Act, 2023 / DEPA): who asks, from
 * whom, which fields, why, for how long — each field individually switchable,
 * and saying no is a real, respected choice.
 */
export function ConsentStep({ onAllow, onSkip }: { onAllow: () => void; onSkip: () => void }) {
  const t = useTranslations("onboarding.consent");
  const [on, setOn] = useState<Record<string, boolean>>({ name: true, dob: true, address: true, photo: false });
  const [declined, setDeclined] = useState(false);

  return (
    <StepShell
      title={declined ? t("deniedTitle") : t("title")}
      subtitle={declined ? t("deniedBody") : t("subtitle")}
      footer={
        declined ? (
          <div className="space-y-2">
            <Button fullWidth onClick={onSkip}>
              {t("continueWithout")}
            </Button>
            <Button fullWidth variant="ghost" onClick={() => setDeclined(false)}>
              {t("reconsider")}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setDeclined(true)}>
              {t("deny")}
            </Button>
            <Button className="flex-[1.4]" onClick={onAllow}>
              {t("allow")}
            </Button>
          </div>
        )
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {declined ? (
          <motion.div key="declined" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[20px] bg-surface p-5">
            <p className="text-[14px] leading-relaxed text-ink-2">{t("deniedDetail")}</p>
          </motion.div>
        ) : (
          <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Parties */}
            <div className="flex items-center justify-between rounded-[20px] bg-surface px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-line">
                  <Vault size={20} weight="duotone" className="text-navy-600" />
                </span>
                <span>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">{t("from")}</span>
                  <span className="block text-[13.5px] font-semibold text-ink">{t("fromName")}</span>
                </span>
              </div>
              <ArrowRight size={16} weight="bold" className="text-ink-4" />
              <div className="flex items-center gap-2.5">
                <span className="text-right">
                  <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">{t("to")}</span>
                  <span className="block text-[13.5px] font-semibold text-ink">{t("toName")}</span>
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-line">
                  <SaathiMark size={24} />
                </span>
              </div>
            </div>

            {/* Fields */}
            <p className="mt-5 text-[13px] font-semibold text-ink-2">{t("itemsLabel")}</p>
            <div className="mt-2 divide-y divide-line overflow-hidden rounded-[20px] ring-1 ring-line">
              {ITEMS.map(({ key, icon: Glyph }) => (
                <div key={key} className="flex items-center gap-3 px-4 py-3">
                  <Glyph size={20} weight="duotone" className="text-ink-2" />
                  <span className="flex-1 text-[15px] font-medium text-ink">{t(`items.${key}`)}</span>
                  <Toggle checked={on[key]} onChange={(v) => setOn((s) => ({ ...s, [key]: v }))} label={t(`items.${key}`)} />
                </div>
              ))}
            </div>

            {/* Purpose + validity */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[18px] bg-surface p-3.5">
                <Target size={18} weight="duotone" className="text-navy-600" />
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">{t("purpose")}</p>
                <p className="text-[13.5px] font-semibold leading-snug text-ink">{t("purposeValue")}</p>
              </div>
              <div className="rounded-[18px] bg-surface p-3.5">
                <IdentificationBadge size={18} weight="duotone" className="text-navy-600" />
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-3">{t("validity")}</p>
                <p className="text-[13.5px] font-semibold leading-snug text-ink">{t("validityValue")}</p>
              </div>
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-ink-3">{t("legal")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </StepShell>
  );
}
