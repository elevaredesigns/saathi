"use client";

import { useTranslations } from "next-intl";

import { LanguageList } from "@/components/prototype/frame/LanguageList";
import { Button } from "@/components/prototype/ui/Button";
import { StepShell } from "../StepShell";

export function LanguageStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("onboarding.language");
  const tc = useTranslations("common");

  return (
    <StepShell title={t("title")} subtitle={t("subtitle")} footer={<Button fullWidth onClick={onNext}>{tc("continue")}</Button>}>
      <LanguageList />
    </StepShell>
  );
}
