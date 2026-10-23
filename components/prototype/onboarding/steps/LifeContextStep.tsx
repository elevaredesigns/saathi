"use client";

import { Baby, Briefcase, Check, GraduationCap, Heart, House, Person, Plant, Storefront, type Icon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Button } from "@/components/prototype/ui/Button";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { spring } from "@/lib/design/motion";
import { cn } from "@/lib/utils";
import { StepShell } from "../StepShell";

const OPTIONS: { key: string; icon: Icon; tone: TileTone }[] = [
  { key: "newBaby", icon: Baby, tone: "saffron" },
  { key: "job", icon: Briefcase, tone: "navy" },
  { key: "marriage", icon: Heart, tone: "violet" },
  { key: "home", icon: House, tone: "teal" },
  { key: "senior", icon: Person, tone: "saffron" },
  { key: "student", icon: GraduationCap, tone: "violet" },
  { key: "farmer", icon: Plant, tone: "green" },
  { key: "business", icon: Storefront, tone: "navy" },
];

export function LifeContextStep({ onNext }: { onNext: () => void }) {
  const t = useTranslations("onboarding.context");
  const reduce = useReducedMotion();
  const { lifeContext, toggleLife } = usePrototype();

  return (
    <StepShell
      title={t("title")}
      subtitle={t("subtitle")}
      footer={
        <div className="space-y-1">
          <Button fullWidth onClick={onNext}>
            {lifeContext.length ? t("ctaCount", { count: lifeContext.length }) : t("cta")}
          </Button>
          <button type="button" onClick={onNext} className="h-10 w-full text-[14px] font-medium text-ink-3">
            {t("skip")}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-2.5">
        {OPTIONS.map(({ key, icon, tone }) => {
          const selected = lifeContext.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleLife(key)}
              aria-pressed={selected}
              className={cn(
                "relative flex flex-col items-start gap-3 rounded-[20px] p-3.5 text-left transition-[background-color,box-shadow] duration-200 active:scale-[0.97]",
                selected ? "bg-navy-50/70 ring-2 ring-navy-600" : "bg-white ring-1 ring-line",
              )}
            >
              <IconTile icon={icon} tone={tone} size="sm" />
              <span className="text-[14.5px] font-semibold leading-snug text-ink">{t(`options.${key}`)}</span>
              {selected && (
                <motion.span
                  initial={reduce ? false : { transform: "scale(0.5)", opacity: 0 }}
                  animate={{ transform: "scale(1)", opacity: 1 }}
                  transition={spring.ui}
                  className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-navy-600 text-white"
                >
                  <Check size={12} weight="bold" />
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}
