"use client";

import { Microphone } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { ease } from "@/lib/design/motion";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

/**
 * The front door to Saathi AI on Home. Cycles real things people ask so the
 * capability is discoverable without a tutorial.
 */
export function AskSaathiBar() {
  const t = useTranslations("home");
  const router = useAppRouter();
  const reduce = useReducedMotion();
  const suggestions = t.raw("askSuggestions") as string[];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % suggestions.length), 3200);
    return () => window.clearInterval(id);
  }, [reduce, suggestions.length]);

  return (
    <div className="relative flex h-[62px] items-center gap-2 rounded-[22px] bg-white pl-2 pr-2 shadow-[0_12px_32px_-14px_rgba(31,67,184,0.35),0_1px_2px_rgba(11,13,20,0.05)] ring-1 ring-navy-100">
      <button
        type="button"
        onClick={() => router.push(`/prototype/saathi/?q=${encodeURIComponent(suggestions[i])}`)}
        className="flex h-full min-w-0 flex-1 items-center gap-3 text-left transition-transform duration-150 active:scale-[0.99]"
        aria-label={`${t("askPlaceholder")}: ${suggestions[i]}`}
      >
        <SaathiOrb size={42} />
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] font-semibold text-navy-600">{t("askPlaceholder")}</span>
          <span className="relative block h-[22px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={i}
                initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(60%)" }}
                animate={{ opacity: 1, transform: "translateY(0%)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(-60%)" }}
                transition={{ duration: 0.36, ease: ease.out }}
                className="absolute inset-0 truncate text-[15.5px] font-medium text-ink"
              >
                “{suggestions[i]}”
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label={t("askVoice")}
        onClick={() => router.push("/prototype/saathi/?voice=1")}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-ink text-white transition-transform duration-150 ease-out active:scale-[0.92]"
      >
        <Microphone size={20} weight="fill" />
      </button>
    </div>
  );
}
