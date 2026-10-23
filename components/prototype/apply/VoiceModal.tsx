"use client";

import { CheckCircle, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useFramePortal } from "@/components/prototype/frame/IPhoneFrame";
import { Button } from "@/components/prototype/ui/Button";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { ease } from "@/lib/design/motion";

/** Live-looking waveform bars (decorative). */
export function Waveform({ bars = 28, className }: { bars?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className={`flex h-12 items-center justify-center gap-[3px] ${className ?? ""}`}>
      {Array.from({ length: bars }).map((_, i) => {
        const base = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.9));
        return (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-navy-600 to-saffron-400"
            style={{ height: 44 }}
            initial={{ transform: `scaleY(${base * 0.4})` }}
            animate={reduce ? { transform: `scaleY(${base * 0.6})` } : { transform: [`scaleY(${base * 0.25})`, `scaleY(${base})`, `scaleY(${base * 0.35})`] }}
            transition={reduce ? undefined : { duration: 0.9 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut", delay: i * 0.03 }}
          />
        );
      })}
    </div>
  );
}

/** Types out text at reading pace (instant under reduced motion). */
function useTypewriter(text: string, active: boolean, cps = 38) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return setN(0);
    if (reduce) return setN(text.length);
    setN(0);
    const id = window.setInterval(() => setN((c) => (c >= text.length ? c : c + 1)), 1000 / cps);
    return () => window.clearInterval(id);
  }, [text, active, reduce, cps]);
  return text.slice(0, n);
}

export function VoiceModal({
  open,
  onClose,
  transcript,
  items,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  transcript: string;
  items: { label: string; value: string }[];
  onConfirm: () => void;
}) {
  const portal = useFramePortal();
  const t = useTranslations("voice");
  const tc = useTranslations("common");
  const [phase, setPhase] = useState<"listening" | "heard">("listening");
  const typed = useTypewriter(transcript, open && phase === "heard");
  const typingDone = typed.length >= transcript.length;

  useEffect(() => {
    if (open) setPhase("listening");
  }, [open]);

  useEffect(() => {
    if (!open || phase !== "listening") return;
    const id = window.setTimeout(() => setPhase("heard"), 2600);
    return () => window.clearTimeout(id);
  }, [open, phase]);

  if (!portal) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t("listeningTitle")}
          className="absolute inset-0 z-[80] flex flex-col bg-white pt-[52px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-end px-4">
            <button type="button" onClick={onClose} aria-label={tc("close")} className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink-2">
              <X size={18} weight="bold" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {phase === "listening" ? (
              <motion.div
                key="listening"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transform: "scale(0.98)" }}
                className="flex flex-1 flex-col items-center justify-center px-8 pb-16 text-center"
              >
                <SaathiOrb state="listening" size={148} />
                <p className="mt-10 text-[24px] font-semibold tracking-[-0.015em] text-ink">{t("listeningTitle")}</p>
                <p className="mt-2 max-w-[260px] text-[15px] leading-relaxed text-ink-3">{t("listeningHint")}</p>
                <Waveform className="mt-8" />
                <button type="button" onClick={() => setPhase("heard")} className="mt-8 rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-white active:scale-95">
                  {t("tapToFinish")}
                </button>
              </motion.div>
            ) : (
              <motion.div key="heard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col px-6">
                <div className="no-scrollbar flex-1 overflow-y-auto pt-4">
                  <div className="flex items-center gap-2.5">
                    <SaathiOrb state={typingDone ? "idle" : "speaking"} size={34} />
                    <p className="text-[14px] font-semibold text-ink-3">{t("heardTitle")}</p>
                  </div>
                  <p className="mt-4 min-h-[88px] text-[22px] font-medium leading-snug tracking-[-0.01em] text-ink">
                    “{typed}
                    {!typingDone && <span className="ml-0.5 inline-block h-[22px] w-[2px] translate-y-[3px] animate-pulse bg-navy-600" />}
                    {typingDone && "”"}
                  </p>
                  <div className="mt-6 overflow-hidden rounded-[20px] ring-1 ring-line">
                    {items.map((it, i) => (
                      <motion.div
                        key={it.label}
                        initial={{ opacity: 0, transform: "translateY(6px)" }}
                        animate={typingDone ? { opacity: 1, transform: "translateY(0px)" } : undefined}
                        transition={{ duration: 0.3, ease: ease.out, delay: i * 0.08 }}
                        className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0"
                      >
                        <span className="text-[13px] text-ink-3">{it.label}</span>
                        <span className="flex items-center gap-1.5 text-right text-[15px] font-semibold text-ink">
                          {it.value}
                          <CheckCircle size={15} weight="fill" className="text-green-600" />
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 py-5">
                  <Button
                    fullWidth
                    disabled={!typingDone}
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    {t("fillN", { count: items.length })}
                  </Button>
                  <Button fullWidth variant="ghost" onClick={() => setPhase("listening")}>
                    {tc("retry")}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    portal,
  );
}
