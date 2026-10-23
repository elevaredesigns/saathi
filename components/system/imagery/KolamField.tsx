"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { generateKolam, type KolamOptions } from "@/lib/design/kolam";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

interface KolamFieldProps extends KolamOptions {
  stroke?: string;
  strokeWidth?: number;
  dotRadius?: number;
  dotColor?: string;
  /** Draw the line in when scrolled into view. */
  draw?: boolean;
  /** Seconds for the draw (split across loops). */
  drawDuration?: number;
  /** Soft radial fade at the edges so the pattern dissolves into white. */
  fade?: boolean;
  /** Rotate the dot grid 45° — the traditional 1-3-5 pulli diamond. */
  diamond?: boolean;
  preserveAspectRatio?: string;
  className?: string;
}

/** Generative kolam — heritage linework used as Saathi's brand texture. */
export function KolamField({
  stroke = "currentColor",
  strokeWidth = 1.25,
  dotRadius = 1.6,
  dotColor,
  draw = false,
  drawDuration = 2.4,
  fade = false,
  diamond = false,
  preserveAspectRatio = "xMidYMid meet",
  className,
  ...opts
}: KolamFieldProps) {
  const reduce = useReducedMotion();
  const kolam = useMemo(
    () => generateKolam(opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [opts.cols, opts.rows, opts.cell, opts.seed, opts.density, opts.symmetry],
  );
  const animate = draw && !reduce;
  const per = drawDuration / Math.max(1, kolam.loops.length);

  // Diamond: rotate inside a square viewBox big enough for the diagonal.
  const pad = strokeWidth + dotRadius;
  const side = diamond ? Math.hypot(kolam.width, kolam.height) + pad * 2 : 0;
  const viewBox = diamond ? `0 0 ${side} ${side}` : `${-pad} ${-pad} ${kolam.width + pad * 2} ${kolam.height + pad * 2}`;
  const groupTransform = diamond
    ? `translate(${(side - kolam.width) / 2} ${(side - kolam.height) / 2}) rotate(45 ${kolam.width / 2} ${kolam.height / 2})`
    : undefined;

  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={cn("block", className)}
      style={
        fade
          ? {
              maskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(closest-side, #000 55%, transparent 100%)",
            }
          : undefined
      }
    >
      <g transform={groupTransform}>
      <g fill={dotColor ?? stroke}>
        {kolam.dots.map((d) => (
          <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={dotRadius} />
        ))}
      </g>
      <g fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {kolam.loops.map((d, i) =>
          animate ? (
            <motion.path
              key={i}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                pathLength: { duration: Math.max(0.8, per * 3), ease: ease.inOut, delay: i * per * 0.6 },
                opacity: { duration: 0.2, delay: i * per * 0.6 },
              }}
            />
          ) : (
            <path key={i} d={d} />
          ),
        )}
      </g>
      </g>
    </svg>
  );
}
