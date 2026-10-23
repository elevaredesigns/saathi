"use client";

import { LockSimple, SealCheck, Vault } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/prototype/ui/Button";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { AadhaarInput } from "../AadhaarInput";
import { StepShell } from "../StepShell";

export function AadhaarStep({ onNext, onDigiLocker }: { onNext: () => void; onDigiLocker: () => void }) {
  const t = useTranslations("onboarding.aadhaar");
  const { setAadhaar } = usePrototype();
  const [digits, setDigits] = useState("");
  const valid = digits.length === 12;

  const submit = () => {
    if (!valid) return;
    setAadhaar(digits.slice(-4));
    onNext();
  };

  return (
    <StepShell
      title={t("title")}
      subtitle={t("subtitle")}
      footer={
        <div className="space-y-2">
          <Button fullWidth disabled={!valid} onClick={submit}>
            {t("cta")}
          </Button>
          <Button fullWidth variant="secondary" iconLeft={<Vault size={18} weight="duotone" className="text-navy-600" />} onClick={onDigiLocker}>
            {t("digilocker")}
          </Button>
        </div>
      }
    >
      <AadhaarInput value={digits} onChange={setDigits} />
      <p className={`mt-2 px-4 text-[13px] ${valid ? "font-medium text-green-800" : "text-ink-3"}`} aria-live="polite">
        {valid ? t("ready") : t("invalid")}
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-[18px] bg-surface p-4">
        <LockSimple size={18} weight="duotone" className="mt-0.5 shrink-0 text-ink-2" />
        <p className="text-[13.5px] leading-relaxed text-ink-2">{t("helper")}</p>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-green-800">
        <SealCheck size={17} weight="fill" className="text-green-600" />
        <span className="text-[13px] font-semibold">{t("trust")}</span>
      </div>
    </StepShell>
  );
}
