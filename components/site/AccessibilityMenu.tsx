"use client";

import { ArrowCounterClockwise, CircleHalf, PersonSimpleCircle, SpeakerHigh, SpeakerSlash, Waves } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { speak, stopSpeaking } from "@/lib/a11y/speak";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";
import { useSitePrefs } from "./SitePreferences";

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn("relative flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200", on ? "justify-end bg-navy-600" : "justify-start bg-[#E3E5EA]")}
    >
      <motion.span layout transition={{ type: "spring", duration: 0.3, bounce: 0 }} className="h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(11,13,20,0.25)]" />
    </button>
  );
}

/** Header control for text size, contrast, motion and read-aloud. */
export function AccessibilityMenu() {
  const t = useTranslations("site.a11y");
  const { locale } = useLocaleSwitch();
  const { prefs, setPrefs, reset } = useSitePrefs();
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sizes = t.raw("sizes") as string[];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => stopSpeaking(), []);

  const toggleRead = () => {
    if (reading) {
      stopSpeaking();
      setReading(false);
      return;
    }
    const text = document.querySelector("main")?.innerText ?? "";
    if (speak(text.slice(0, 4000), locale)) {
      setReading(true);
      const poll = window.setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          setReading(false);
          window.clearInterval(poll);
        }
      }, 800);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("button")}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full text-ink-2 ring-1 ring-inset transition-colors duration-150 hover:bg-surface",
          open ? "bg-surface ring-line-strong" : "ring-line",
        )}
      >
        <PersonSimpleCircle size={20} weight="duotone" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t("title")}
            initial={{ opacity: 0, transform: "translateY(-6px) scale(0.98)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
            exit={{ opacity: 0, transform: "translateY(-4px) scale(0.98)" }}
            transition={{ duration: 0.18, ease: ease.out }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-[300px] rounded-[20px] bg-white p-4 shadow-[0_24px_60px_-20px_rgba(11,13,20,0.35)] ring-1 ring-line"
          >
            <p className="text-[15px] font-semibold text-ink">{t("title")}</p>

            <p className="mt-4 text-[13px] font-medium text-ink-2">{t("textSize")}</p>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-[12px] bg-surface2 p-1">
              {sizes.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setPrefs({ textSize: i as 0 | 1 | 2 })}
                  aria-pressed={prefs.textSize === i}
                  className={cn(
                    "rounded-[9px] py-1.5 font-semibold transition-colors duration-150",
                    prefs.textSize === i ? "bg-white text-ink shadow-soft" : "text-ink-3 hover:text-ink",
                  )}
                  style={{ fontSize: 12 + i * 2 }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <CircleHalf size={19} weight="duotone" className="text-navy-600" />
                <span className="flex-1 text-[14px] font-medium text-ink">{t("contrast")}</span>
                <Switch on={prefs.contrast} onChange={(v) => setPrefs({ contrast: v })} label={t("contrast")} />
              </div>
              <div className="flex items-center gap-3">
                <Waves size={19} weight="duotone" className="text-navy-600" />
                <span className="flex-1 text-[14px] font-medium text-ink">{t("motion")}</span>
                <Switch on={prefs.reduceMotion} onChange={(v) => setPrefs({ reduceMotion: v })} label={t("motion")} />
              </div>
            </div>

            <button
              type="button"
              onClick={toggleRead}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-ink text-[14px] font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
            >
              {reading ? <SpeakerSlash size={17} weight="fill" /> : <SpeakerHigh size={17} weight="fill" />}
              {reading ? t("stopReading") : t("readAloud")}
            </button>
            <button type="button" onClick={reset} className="mt-2 flex w-full items-center justify-center gap-1.5 py-1.5 text-[13px] font-medium text-ink-3 hover:text-ink">
              <ArrowCounterClockwise size={14} weight="bold" />
              {t("reset")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
