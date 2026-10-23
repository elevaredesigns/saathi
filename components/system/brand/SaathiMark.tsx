"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import { ease } from "@/lib/design/motion";

export const MARK_PATHS = {
  outer: "M10 36a18 18 0 0 1 36 0",
  inner: "M18 36a10 10 0 0 1 20 0",
  dot: { cx: 28, cy: 36, r: 3.2 },
} as const;

interface SaathiMarkProps {
  size?: number;
  tone?: "brand" | "ink" | "white";
  /** Stroke-draw the arcs on mount. */
  draw?: boolean;
  className?: string;
  title?: string;
}

/**
 * The Saathi mark — two arcs and a point.
 * The outer saffron arc and inner navy arc are companionship and an open door;
 * the green point at their centre is the citizen they hold. Together: the
 * tricolour, abstracted — no national emblem required.
 */
export function SaathiMark({ size = 40, tone = "brand", draw = false, className, title }: SaathiMarkProps) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const animate = draw && !reduce;

  const outer = tone === "brand" ? `url(#${id}-o)` : tone === "white" ? "#FFFFFF" : "#0B0D14";
  const inner = tone === "brand" ? "#1F43B8" : tone === "white" ? "rgba(255,255,255,0.85)" : "#0B0D14";
  const dot = tone === "brand" ? "#12803C" : tone === "white" ? "#FFFFFF" : "#0B0D14";

  const arc = (d: string, stroke: string, delay: number) =>
    animate ? (
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={3.4}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: ease.inOut, delay }}
      />
    ) : (
      <path d={d} stroke={stroke} strokeWidth={3.4} strokeLinecap="round" fill="none" />
    );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
    >
      {tone === "brand" && (
        <defs>
          <linearGradient id={`${id}-o`} x1="10" y1="36" x2="46" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FF8A1F" />
            <stop offset="1" stopColor="#FFA24C" />
          </linearGradient>
        </defs>
      )}
      {arc(MARK_PATHS.outer, outer, 0)}
      {arc(MARK_PATHS.inner, inner, 0.18)}
      {animate ? (
        <motion.circle
          {...MARK_PATHS.dot}
          fill={dot}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ transformOrigin: "28px 36px" }}
          transition={{ duration: 0.5, ease: ease.out, delay: 0.9 }}
        />
      ) : (
        <circle {...MARK_PATHS.dot} fill={dot} />
      )}
    </svg>
  );
}
