"use client";

import { useEffect, useState } from "react";
import { rosettePath, waveBandPaths } from "@/lib/design/guilloche";
import { cn } from "@/lib/utils";

const TONES = {
  navy: "#1F43B8",
  saffron: "#FF8A1F",
  green: "#12803C",
  white: "#FFFFFF",
  ink: "#0B0D14",
} as const;

interface GuillocheProps {
  variant?: "rosette" | "band";
  tone?: keyof typeof TONES;
  /** Line opacity (the pattern should whisper, never shout). */
  opacity?: number;
  className?: string;
}

/* The patterns never change, so they are computed once and shared by every instance. */
let ROSETTES: string[] | null = null;
let BANDS: string[] | null = null;
const rosettes = () =>
  (ROSETTES ??= [
    rosettePath({ cx: 100, cy: 100, R: 96, r: 26, d: 44, steps: 1600 }),
    rosettePath({ cx: 100, cy: 100, R: 80, r: 22, d: 38, steps: 1400 }),
    rosettePath({ cx: 100, cy: 100, R: 60, r: 14, d: 22, steps: 1200 }),
    rosettePath({ cx: 100, cy: 100, R: 34, r: 8, d: 12, steps: 900 }),
  ]);
const bandPaths = () =>
  (BANDS ??= [
    ...waveBandPaths({ width: 600, height: 120, lines: 14, amplitude: 16, frequency: 3, phaseStep: 0.32 }),
    ...waveBandPaths({ width: 600, height: 120, lines: 10, amplitude: 22, frequency: 2, phaseStep: -0.41 }),
  ]);

/**
 * Security-print linework — signals an official, verified object.
 * Purely decorative, so it is drawn in the browser once the page is up rather
 * than shipped inside every page's HTML; the content paints first.
 */
export function Guilloche({ variant = "rosette", tone = "navy", opacity = 0.35, className }: GuillocheProps) {
  const color = TONES[tone];
  const [drawn, setDrawn] = useState(false);
  useEffect(() => setDrawn(true), []);

  if (variant === "band") {
    return (
      <svg aria-hidden viewBox="0 0 600 120" preserveAspectRatio="none" className={cn("block", className)}>
        <g fill="none" stroke={color} strokeWidth={0.6} opacity={opacity} vectorEffect="non-scaling-stroke">
          {drawn && bandPaths().map((d, i) => (
            <path key={i} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg aria-hidden viewBox="0 0 200 200" className={cn("block", className)}>
      <g fill="none" stroke={color} opacity={opacity}>
        {drawn && rosettes().map((d, i) => (
          <path key={i} d={d} strokeWidth={0.35 + i * 0.05} />
        ))}
      </g>
    </svg>
  );
}
