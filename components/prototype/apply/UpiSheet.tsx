"use client";

import { Bank, Check, CheckCircle, SealCheck } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Button } from "@/components/prototype/ui/Button";
import { Sheet } from "@/components/prototype/ui/Sheet";
import type { L } from "@/lib/mockData";
import { loc } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const ACCOUNTS = [
  { id: "sbi", vpa: "rakesh.verma@sbi", bank: "State Bank of India ···· 4521" },
  { id: "pnb", vpa: "rakesh91@pnb", bank: "Punjab National Bank ···· 0087" },
];

/**
 * Simulated UPI confirmation. The prototype never asks for a PIN — it shows
 * where the real approval happens (the citizen's own UPI app) and says so.
 */
export function UpiSheet({
  open,
  amount,
  payee,
  onClose,
  onPaid,
}: {
  open: boolean;
  amount: string;
  payee: L;
  onClose: () => void;
  onPaid: () => void;
}) {
  const t = useTranslations("apply.upi");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const [account, setAccount] = useState(ACCOUNTS[0].id);
  const [phase, setPhase] = useState<"choose" | "waiting" | "done">("choose");
  const reported = useRef(false);
  const onPaidRef = useRef(onPaid);
  onPaidRef.current = onPaid;

  useEffect(() => {
    if (open) {
      setPhase("choose");
      reported.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (phase === "waiting") {
      const id = window.setTimeout(() => setPhase("done"), 1900);
      return () => window.clearTimeout(id);
    }
    if (phase === "done" && !reported.current) {
      const id = window.setTimeout(() => {
        if (reported.current) return;
        reported.current = true;
        onPaidRef.current();
      }, 900);
      return () => window.clearTimeout(id);
    }
  }, [phase]);

  return (
    <Sheet open={open} onClose={phase === "choose" ? onClose : () => {}} title={phase === "choose" ? t("title") : undefined} label={t("title")}>
      <AnimatePresence mode="wait" initial={false}>
        {phase === "choose" ? (
          <motion.div key="choose" exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between rounded-[20px] bg-surface p-4">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-3">{t("payee")}</p>
                <p className="text-[15.5px] font-semibold text-ink">{loc(payee, locale)}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[12px] font-semibold text-green-800">
                  <SealCheck size={13} weight="fill" className="text-green-600" />
                  {t("verifiedPayee")}
                </p>
              </div>
              <p className="text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-ink">{amount}</p>
            </div>

            <p className="mt-5 text-[13px] font-semibold text-ink-2">{t("from")}</p>
            <div className="mt-2 space-y-2">
              {ACCOUNTS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAccount(a.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[18px] p-3.5 text-left ring-inset transition-[background-color,box-shadow] duration-200",
                    account === a.id ? "bg-navy-50/70 ring-2 ring-navy-600" : "bg-white ring-1 ring-line",
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-line">
                    <Bank size={20} weight="duotone" className="text-navy-600" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[14px] font-semibold text-ink">{a.vpa}</span>
                    <span className="block text-[12.5px] text-ink-3">{a.bank}</span>
                  </span>
                  {account === a.id && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-600 text-white">
                      <Check size={13} weight="bold" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <Button fullWidth variant="saffron" className="mt-5" onClick={() => setPhase("waiting")}>
              {t("pay", { amount })}
            </Button>
            <p className="mt-3 text-center text-[12px] leading-relaxed text-ink-3">{t("note")}</p>
          </motion.div>
        ) : (
          <motion.div key="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[300px] flex-col items-center justify-center text-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              {phase === "waiting" ? (
                <>
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 96 96" aria-hidden>
                    <circle cx="48" cy="48" r="42" fill="none" stroke="#EEF0F4" strokeWidth="6" />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="42"
                      fill="none"
                      stroke="#1F43B8"
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: reduce ? 0 : 1.9, ease: "linear" }}
                    />
                  </svg>
                  <Bank size={34} weight="duotone" className="text-navy-600" />
                </>
              ) : (
                <motion.span
                  initial={{ transform: "scale(0.6)", opacity: 0 }}
                  animate={{ transform: "scale(1)", opacity: 1 }}
                  transition={{ type: "spring", duration: 0.45, bounce: 0.35 }}
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-green-600 text-white"
                >
                  <CheckCircle size={52} weight="fill" />
                </motion.span>
              )}
            </div>
            <p className="mt-6 text-[20px] font-semibold text-ink">{phase === "waiting" ? t("waiting") : t("success")}</p>
            <p className="mt-1 text-[14px] text-ink-3">{phase === "waiting" ? ACCOUNTS.find((a) => a.id === account)?.vpa : amount}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
}
