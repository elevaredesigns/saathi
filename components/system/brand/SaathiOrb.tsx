"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MARK_PATHS } from "./SaathiMark";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

const LABELS: Record<OrbState, string> = {
  idle: "Saathi AI",
  listening: "Saathi AI is listening",
  thinking: "Saathi AI is working",
  speaking: "Saathi AI is responding",
};

/**
 * The face of Saathi AI. A slow tricolour aurora behind a glass disc that
 * holds the brand arcs. State is shown by motion *and* by the aria-label, so
 * it never relies on animation alone.
 *
 *   idle      aurora drifts, disc breathes
 *   listening ripple rings expand outward
 *   thinking  aurora speeds up, arcs trace themselves in and out
 *   speaking  arcs pulse
 */
export function SaathiOrb({ state = "idle", size = 64, className }: { state?: OrbState; size?: number; className?: string }) {
  const reduce = useReducedMotion();
  const still = !!reduce;
  const thinking = state === "thinking" && !still;
  const blur = Math.max(4, size * 0.14);

  return (
    <span
      role="img"
      aria-label={LABELS[state]}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* listening ripples */}
      {state === "listening" && !still && (
        <>
          <span className="absolute inset-0 rounded-full border border-navy-400/40 animate-ripple" />
          <span className="absolute inset-0 rounded-full border border-saffron-400/40 animate-ripple [animation-delay:0.6s]" />
        </>
      )}

      {/* aurora */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-[-6%] rounded-full opacity-75",
          !still && (state === "thinking" ? "animate-aurora-spin-fast" : "animate-aurora-spin"),
        )}
        style={{
          background:
            "conic-gradient(from 90deg, #5577E0, #1F43B8 18%, #B9C8F0 34%, #FF8A1F 42%, #B9C8F0 50%, #2F55D4 62%, #1E9E55 74%, #B9C8F0 86%, #5577E0)",
          filter: `blur(${blur}px)`,
        }}
      />

      {/* glass disc */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-[9%] rounded-full bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(11,13,20,0.08)] ring-1 ring-white/70 backdrop-blur-md",
          !still && state === "idle" && "animate-breathe",
        )}
      />

      {/* arcs — the mark is optically centred on the disc (its bounds sit at
          y 16–39 of the 56 viewBox), and every state animates in place so it
          never swings off-centre. */}
      <svg aria-hidden viewBox="0 0 56 56" className="relative translate-y-[2%]" style={{ width: size * 0.56, height: size * 0.56 }}>
        {thinking ? (
          <>
            <path d={MARK_PATHS.outer} stroke="#FF8A1F" strokeOpacity={0.22} strokeWidth={4} strokeLinecap="round" fill="none" />
            <path d={MARK_PATHS.inner} stroke="#1F43B8" strokeOpacity={0.18} strokeWidth={4} strokeLinecap="round" fill="none" />
            <path d={MARK_PATHS.outer} pathLength={1} strokeDasharray="1 1" stroke="#FF8A1F" strokeWidth={4} strokeLinecap="round" fill="none" className="animate-arc-trace" />
            <path d={MARK_PATHS.inner} pathLength={1} strokeDasharray="1 1" stroke="#1F43B8" strokeWidth={4} strokeLinecap="round" fill="none" className="animate-arc-trace [animation-delay:0.18s]" />
            <circle {...MARK_PATHS.dot} fill="#12803C" className="animate-dot-pulse" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          </>
        ) : (
          <>
            <path d={MARK_PATHS.outer} stroke="#FF8A1F" strokeWidth={4} strokeLinecap="round" fill="none" />
            <g className={cn(!still && state === "speaking" && "animate-breathe")} style={{ transformBox: "view-box", transformOrigin: "28px 36px" }}>
              <path d={MARK_PATHS.inner} stroke="#1F43B8" strokeWidth={4} strokeLinecap="round" fill="none" />
            </g>
            <circle {...MARK_PATHS.dot} fill="#12803C" />
          </>
        )}
      </svg>
    </span>
  );
}
