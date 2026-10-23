"use client";

import { Check } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { KolamField } from "@/components/system/imagery/KolamField";
import { Button } from "@/components/prototype/ui/Button";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { ease } from "@/lib/design/motion";
import { firstName } from "@/lib/i18n/names";
import { localeMeta } from "@/lib/i18n/config";
import { StepShell } from "../StepShell";

export function DoneStep({ onDone }: { onDone: () => void }) {
  const t = useTranslations("onboarding.done");
  const reduce = useReducedMotion();
  const { user, lifeContext, accessibility } = usePrototype();
  const { locale } = useLocaleSwitch();
  const aids = Object.values(accessibility).filter(Boolean).length;

  const chips = [
    `${t("summaryLanguage")}: ${localeMeta[locale].native}`,
    t("summaryLife", { count: lifeContext.length }),
    t("summaryA11y", { count: aids }),
  ];

  return (
    <StepShell center footer={<Button fullWidth onClick={onDone}>{t("cta")}</Button>}>
      <div className="relative flex flex-col items-center text-center">
        <div className="relative flex h-[210px] w-full items-center justify-center">
          <KolamField cols={5} rows={5} cell={40} seed={2047} density={0.62} diamond draw drawDuration={1.8} className="absolute h-[250px] w-[250px] text-navy-600/25" />
          <SaathiOrb state="speaking" size={96} />
        </div>
        <h1 className="mt-2 text-[30px] font-semibold leading-tight tracking-[var(--track-tight)] text-ink">{t("title")}</h1>
        <p className="mt-2 max-w-[290px] text-[16px] leading-relaxed text-ink-2">{t("body", { name: firstName(user.name, locale) })}</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {chips.map((c, i) => (
            <motion.li
              key={c}
              data-reveal
              initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.45, ease: ease.out, delay: 0.5 + i * 0.08 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[13px] font-semibold text-green-800 ring-1 ring-inset ring-green-100"
            >
              <Check size={13} weight="bold" />
              {c}
            </motion.li>
          ))}
        </ul>
      </div>
    </StepShell>
  );
}
