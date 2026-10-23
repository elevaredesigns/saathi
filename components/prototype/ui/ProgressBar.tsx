"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const TONES = { navy: "bg-navy-600", green: "bg-green-600", saffron: "bg-saffron-500" } as const;

/** Spring-filled progress track. value: 0–1. */
export function ProgressBar({
  value,
  tone = "navy",
  className,
  label,
}: {
  value: number;
  tone?: keyof typeof TONES;
  className?: string;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct * 100)}
      className={cn("h-[5px] overflow-hidden rounded-full bg-surface2", className)}
    >
      <motion.div
        className={cn("h-full origin-left rounded-full", TONES[tone])}
        initial={{ transform: "scaleX(0)" }}
        animate={{ transform: `scaleX(${pct})` }}
        transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.7, bounce: 0 }}
      />
    </div>
  );
}
