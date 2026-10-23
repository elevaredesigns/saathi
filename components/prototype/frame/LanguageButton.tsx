"use client";

import { Microphone, Translate } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Sheet } from "@/components/prototype/ui/Sheet";
import { localeMeta } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { LanguageList } from "./LanguageList";


/** Language chip for screen headers + the language sheet (tap or say a language). */
export function LanguageButton({ className }: { className?: string }) {
  const { locale } = useLocaleSwitch();
  const a = useTranslations("a11y");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${a("languageButton")}: ${localeMeta[locale].short}`}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full bg-surface pl-2.5 pr-3 text-ink-2 ring-1 ring-black/[0.04] transition-transform duration-150 ease-out active:scale-[0.94]",
          className,
        )}
      >
        <Translate size={16} weight="bold" />
        <span className="text-[13px] font-semibold text-ink" style={{ fontFamily: `var(${localeMeta[locale].fontVar}), var(--font-geist)` }}>
          {localeMeta[locale].short}
        </span>
      </button>
      <LanguageSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function LanguageSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, setLocale } = useLocaleSwitch();
  const t = useTranslations("language");
  const tv = useTranslations("voice");
  const [listening, setListening] = useState(false);

  // Demo: after a short listen, Saathi "hears" another language and switches.
  useEffect(() => {
    if (!listening) return;
    // Demo: "hears" Hindi (or English when already in Hindi).
    const target = locale === "hi" ? "en" : "hi";
    const id = window.setTimeout(() => {
      setLocale(target);
      setListening(false);
      onClose();
    }, 2200);
    return () => window.clearTimeout(id);
  }, [listening, locale, setLocale, onClose]);

  const close = () => {
    setListening(false);
    onClose();
  };

  return (
    <Sheet open={open} onClose={close} title={listening ? undefined : t("select")} label={t("select")}>
      {listening ? (
        <div className="flex h-[250px] flex-col items-center justify-center text-center">
          <SaathiOrb state="listening" size={96} />
          <p className="mt-6 text-[20px] font-semibold text-ink">{tv("sayLanguagePrompt")}</p>
          <p className="mt-1 text-[14px] text-ink-3">हिन्दी · اردو · বাংলা · தமிழ் · తెలుగు · ಕನ್ನಡ · English</p>
        </div>
      ) : (
        <>
          <LanguageList onPick={() => close()} />
          <button
            type="button"
            onClick={() => setListening(true)}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-ink text-[15px] font-semibold text-white transition-transform duration-150 ease-out active:scale-[0.98]"
          >
            <Microphone size={18} weight="fill" />
            {tv("sayLanguage")}
          </button>
        </>
      )}
    </Sheet>
  );
}
