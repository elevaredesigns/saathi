"use client";

import { SealCheck } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Button } from "@/components/prototype/ui/Button";
import { Field } from "@/components/prototype/ui/Field";
import { Badge } from "@/components/system/ui/Badge";
import { usePrototype, type SaathiUser } from "@/lib/context/PrototypeContext";
import { displayName } from "@/lib/i18n/names";
import { cn } from "@/lib/utils";
import { StepShell } from "../StepShell";

export function ProfileStep({ onNext, fetched }: { onNext: () => void; fetched: boolean }) {
  const t = useTranslations("onboarding.profile");
  const { locale } = useLocaleSwitch();
  const { user, setProfile } = usePrototype();
  const [name, setName] = useState(fetched ? displayName(user.name, locale) : "");
  const [gender, setGender] = useState<SaathiUser["gender"]>(fetched ? "male" : user.gender);

  const genders: [SaathiUser["gender"], string][] = [
    ["male", t("genderMale")],
    ["female", t("genderFemale")],
    ["other", t("genderOther")],
  ];

  const submit = () => {
    // Keep the canonical Latin persona name so every screen can localize it.
    const typed = name.trim();
    const isPersona = typed === displayName(user.name, locale) || typed === user.name;
    setProfile({ name: isPersona || !typed ? user.name : typed, gender });
    onNext();
  };

  return (
    <StepShell title={t("title")} subtitle={t("subtitle")} footer={<Button fullWidth onClick={submit}>{t("cta")}</Button>}>
      {fetched && (
        <Badge tone="green" icon={SealCheck} className="mb-5">
          {t("fetched")}
        </Badge>
      )}
      <div className="space-y-5">
        <Field label={t("nameLabel")} value={name} onChange={setName} placeholder={t("namePlaceholder")} highlight={fetched && name.length > 0} />
        <div>
          <p className="mb-1.5 text-[13px] font-medium text-ink-2">{t("genderLabel")}</p>
          <div className="flex gap-2">
            {genders.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setGender(key)}
                aria-pressed={gender === key}
                className={cn(
                  "h-[50px] flex-1 rounded-[14px] text-[15px] font-semibold transition-[background-color,box-shadow] duration-200 active:scale-[0.97]",
                  gender === key ? "bg-navy-50 text-navy-700 ring-2 ring-navy-600" : "bg-white text-ink-2 ring-1 ring-line-strong",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <Field label={t("districtLabel")} value={`${user.district}, ${user.state}`} type="readout" />
      </div>
    </StepShell>
  );
}
