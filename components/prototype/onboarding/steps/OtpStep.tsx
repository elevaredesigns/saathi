"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/prototype/ui/Button";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { OtpInput } from "../OtpInput";
import { StepShell } from "../StepShell";

function maskPhone(phone: string) {
  const last3 = phone.replace(/\D/g, "").slice(-3);
  return `+91 ••••• ••${last3}`;
}

const RESEND = 30;

export function OtpStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("onboarding.otp");
  const { user } = usePrototype();
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(RESEND);
  const verified = code.length === 6;

  useEffect(() => {
    if (seconds <= 0 || verified) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds, verified]);

  // Auto-continue shortly after the sixth digit — no extra tap needed.
  useEffect(() => {
    if (!verified) return;
    const id = window.setTimeout(onNext, 900);
    return () => window.clearTimeout(id);
  }, [verified, onNext]);

  const r = 9;
  const c = 2 * Math.PI * r;

  return (
    <StepShell
      title={t("title")}
      subtitle={t("subtitle", { phone: maskPhone(user.phone) })}
      footer={
        <Button fullWidth disabled={!verified} onClick={onNext}>
          {t("cta")}
        </Button>
      }
    >
      <OtpInput value={code} onChange={setCode} verified={verified} />

      <div className="mt-5 h-8">
        <AnimatePresence mode="wait">
          {verified ? (
            <motion.p
              key="ok"
              initial={{ opacity: 0, transform: "translateY(4px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              className="flex items-center gap-1.5 text-[14px] font-semibold text-green-800"
            >
              <CheckCircle size={18} weight="fill" className="text-green-600" />
              {t("verified")}
            </motion.p>
          ) : seconds > 0 ? (
            <motion.p key="timer" exit={{ opacity: 0 }} className="flex items-center gap-2 text-[14px] tabular-nums text-ink-3">
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="-rotate-90">
                <circle cx="11" cy="11" r={r} fill="none" stroke="#EEF0F4" strokeWidth="2.5" />
                <circle
                  cx="11"
                  cy="11"
                  r={r}
                  fill="none"
                  stroke="#1F43B8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={c * (1 - seconds / RESEND)}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              {t("resendIn", { seconds })}
            </motion.p>
          ) : (
            <motion.button key="resend" type="button" onClick={() => setSeconds(RESEND)} className="text-[14px] font-semibold text-navy-600">
              {t("resend")}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-4 text-[13px] text-ink-3">{t("demoHint")}</p>
    </StepShell>
  );
}
