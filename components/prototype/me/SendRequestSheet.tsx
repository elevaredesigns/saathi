"use client";

import { CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Button } from "@/components/prototype/ui/Button";
import { Sheet } from "@/components/prototype/ui/Sheet";
import { loc, type FamilyMember } from "@/lib/mockData";

export function SendRequestSheet({ member, open, onClose }: { member: FamilyMember | null; open: boolean; onClose: () => void }) {
  const { locale } = useLocaleSwitch();
  const t = useTranslations("me");
  const [sent, setSent] = useState(false);
  const name = member ? loc(member.name, locale) : "";

  const close = () => {
    onClose();
    window.setTimeout(() => setSent(false), 300);
  };

  return (
    <Sheet open={open} onClose={close} title={t("sendRequest")}>
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="sent" initial={{ opacity: 0, transform: "scale(0.96)" }} animate={{ opacity: 1, transform: "scale(1)" }} className="flex flex-col items-center py-8 text-center">
            <CheckCircle size={56} weight="fill" className="text-green-600" />
            <p className="mt-3 text-[18px] font-semibold text-ink">{t("smsSent")}</p>
            <p className="mt-1 max-w-[260px] text-[14px] text-ink-3">{t("smsSentSub", { name })}</p>
            <Button className="mt-6" size="md" variant="secondary" onClick={close}>
              {t("done")}
            </Button>
          </motion.div>
        ) : (
          <motion.div key="compose" exit={{ opacity: 0 }}>
            <p className="text-[13px] text-ink-3">{t("smsTo", { name })}</p>
            <div className="mt-3 rounded-[20px] rounded-bl-[6px] bg-navy-50 p-4 text-[15px] leading-relaxed text-ink">{t("smsBody", { name })}</div>
            <p className="mt-3 text-[12.5px] text-ink-3">{t("smsWhy")}</p>
            <Button fullWidth className="mt-5" onClick={() => setSent(true)} iconLeft={<PaperPlaneTilt size={18} weight="fill" />}>
              {t("smsSend")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
}
