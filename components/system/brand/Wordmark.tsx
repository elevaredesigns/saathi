"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";
import { SaathiMark } from "./SaathiMark";

const SIZES = {
  sm: { word: "text-[26px]", latin: "text-[9px]", mark: 26 },
  md: { word: "text-[40px]", latin: "text-[11px]", mark: 40 },
  lg: { word: "text-[72px]", latin: "text-[13px]", mark: 64 },
  xl: { word: "text-[clamp(88px,15vw,196px)]", latin: "text-[clamp(12px,1.2vw,15px)]", mark: 96 },
} as const;

interface WordmarkProps {
  size?: keyof typeof SIZES;
  /** inline = mark · साथी · SAATHI; stacked = साथी over SAATHI; none = साथी only */
  lockup?: "inline" | "stacked" | "none";
  withMark?: boolean;
  reveal?: boolean;
  className?: string;
}

/** साथी — the wordmark. Tiro Devanagari: the one expressive face in the system. */
export function Wordmark({ size = "md", lockup = "inline", withMark = false, reveal = false, className }: WordmarkProps) {
  const reduce = useReducedMotion();
  const s = SIZES[size];
  const animate = reveal && !reduce;

  const word = (
    <motion.span
      data-reveal
      className={cn("font-wordmark leading-[0.92] text-ink", s.word)}
      initial={animate ? { clipPath: "inset(0 100% 0 0)", filter: "blur(8px)" } : false}
      animate={animate ? { clipPath: "inset(0 0% 0 0)", filter: "blur(0px)" } : undefined}
      transition={{ duration: 1.25, ease: ease.cinematic, delay: 0.15 }}
    >
      साथी
    </motion.span>
  );

  const latin = lockup !== "none" && (
    <motion.span
      data-reveal
      className={cn("font-sans font-medium uppercase tracking-[0.28em] text-ink-3", s.latin)}
      initial={animate ? { opacity: 0 } : false}
      animate={animate ? { opacity: 1 } : undefined}
      transition={{ duration: 0.6, ease: ease.out, delay: 0.9 }}
    >
      Saathi
    </motion.span>
  );

  return (
    <span
      role="img"
      aria-label="Saathi"
      className={cn(
        "inline-flex",
        lockup === "stacked" ? "flex-col items-start gap-2" : "items-center gap-3",
        className,
      )}
    >
      {withMark && <SaathiMark size={s.mark} draw={reveal} />}
      {word}
      {latin}
    </span>
  );
}
