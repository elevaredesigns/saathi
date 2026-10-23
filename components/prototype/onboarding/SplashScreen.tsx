"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { TricolourRule } from "@/components/system/brand/TricolourRule";
import { KolamField } from "@/components/system/imagery/KolamField";
import { ease } from "@/lib/design/motion";

/** Launch: the mark draws itself, the wordmark rises, a kolam settles behind. */
export function SplashScreen() {
  const t = useTranslations();
  const reduce = useReducedMotion();

  return (
    <div className="relative -mt-[44px] flex h-[818px] flex-col items-center justify-center overflow-hidden px-8 text-center">
      <KolamField
        cols={7}
        rows={7}
        cell={56}
        seed={47}
        density={0.62}
        diamond
        draw
        drawDuration={2.2}
        fade
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 text-navy-600/[0.08]"
      />
      <div className="relative flex flex-col items-center">
        <SaathiMark size={88} draw />
        <motion.span
          data-reveal
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(10px)", filter: "blur(6px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: ease.cinematic, delay: 0.45 }}
          className="mt-6 font-wordmark text-[76px] leading-none text-ink"
        >
          साथी
        </motion.span>
        <motion.span
          data-reveal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-ink-3"
        >
          Saathi
        </motion.span>
        <motion.p
          data-reveal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="mt-6 max-w-[250px] text-[16px] leading-relaxed text-ink-2"
        >
          {t("onboarding.splash")}
        </motion.p>
      </div>
      <motion.div
        data-reveal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-16 w-32"
      >
        <TricolourRule />
      </motion.div>
    </div>
  );
}
