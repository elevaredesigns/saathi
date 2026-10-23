"use client";

import { SpeakerHigh } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { speak } from "@/lib/a11y/speak";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { cn } from "@/lib/utils";

/** Speaker button shown beside titles when the "Read aloud" preference is on. */
export function ReadAloudButton({ text, className }: { text: string; className?: string }) {
  const { accessibility } = usePrototype();
  const { locale } = useLocaleSwitch();
  const t = useTranslations("a11y");
  if (!accessibility.audioLabels) return null;

  return (
    <button
      type="button"
      aria-label={t("readAloud")}
      onClick={() => speak(text, locale, accessibility.slowMode ? 0.85 : 1)}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600 transition-transform duration-150 ease-out active:scale-90",
        className,
      )}
    >
      <SpeakerHigh size={17} weight="fill" />
    </button>
  );
}
