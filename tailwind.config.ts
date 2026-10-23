import type { Config } from "tailwindcss";
import { palette } from "./lib/design/tokens";

/**
 * Saathi 2.0 — "Bharat Precision" tokens.
 * Colours come from lib/design/tokens.ts (contrast-tested). Fonts, leading and
 * tracking resolve through per-script CSS variables set in globals.css, so the
 * whole UI re-typesets the instant the language changes.
 *
 * Legacy v1 tokens (canvas, terracotta, trust, forest, amber, hairline,
 * ink-70/50/30, status, device) remain until the Phase-6 cleanup so screens
 * not yet rebuilt keep rendering.
 */
const display = (size: string) =>
  [size, { lineHeight: "var(--lh-tight)", letterSpacing: "var(--track-display)", fontWeight: "600" }] as [
    string,
    { lineHeight: string; letterSpacing: string; fontWeight: string },
  ];

const config: Config = {
  // hover: styles only apply on devices that truly hover (no sticky taps on phones).
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ---- 2.0 ---- ("page", not "base": text-base is a font size) */
        page: palette.base,
        surface: palette.surface,
        surface2: palette.surface2,
        line: palette.line,
        "line-strong": palette.lineStrong,
        ink: {
          DEFAULT: palette.ink.DEFAULT,
          2: palette.ink[2],
          3: palette.ink[3],
          4: palette.ink[4],
          // legacy alpha steps
          70: "rgba(11,13,20,0.72)",
          50: "rgba(11,13,20,0.52)",
          30: "rgba(11,13,20,0.3)",
        },
        navy: palette.navy,
        saffron: palette.saffron,
        green: palette.green,
        red: palette.red,
        violet: palette.violet,
        teal: palette.teal,
        doc: palette.doc,

        /* ---- legacy v1 ---- */
        canvas: "#FBF8F2",
        paper: "#FFFFFF",
        hairline: "#E8E2D5",
        terracotta: { DEFAULT: "#C9460F", soft: "#F4DBC9", deep: "#B03E0D" },
        trust: "#1B3A6B",
        forest: "#2F6B47",
        amber: "#C97A1F",
        status: {
          "active-bg": "#F4DBC9",
          "active-text": "#C9460F",
          "success-bg": "#DEE9DE",
          "success-text": "#2F6B47",
          "pending-bg": "#F4E8D4",
          "pending-text": "#C97A1F",
          "info-bg": "#DCE5F0",
          "info-text": "#1B3A6B",
        },
        device: "#F0EDE7",
      },
      fontFamily: {
        sans: ["var(--font-ui)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        wordmark: ["var(--font-tiro)", "var(--font-noto-deva)", "serif"],
        // explicit faces (specimens)
        geist: ["var(--font-geist)", "sans-serif"],
        "anek-deva": ["var(--font-anek-deva)", "sans-serif"],
        "anek-bangla": ["var(--font-anek-bangla)", "sans-serif"],
        "anek-tamil": ["var(--font-anek-tamil)", "sans-serif"],
        "noto-deva": ["var(--font-noto-deva)", "sans-serif"],
        "noto-beng": ["var(--font-noto-beng)", "sans-serif"],
        "noto-taml": ["var(--font-noto-taml)", "sans-serif"],
        tiro: ["var(--font-tiro)", "serif"],
      },
      fontSize: {
        "display-2xl": display("clamp(56px, 9vw, 132px)"),
        "display-xl": display("clamp(44px, 6.2vw, 92px)"),
        h1: [
          "clamp(36px, 4.4vw, 60px)",
          { lineHeight: "var(--lh-snug)", letterSpacing: "var(--track-tight)", fontWeight: "600" },
        ],
        h2: [
          "clamp(28px, 3.2vw, 44px)",
          { lineHeight: "var(--lh-snug)", letterSpacing: "var(--track-tight)", fontWeight: "600" },
        ],
        h3: ["24px", { lineHeight: "1.3", letterSpacing: "var(--track-snug)", fontWeight: "600" }],
        title: ["20px", { lineHeight: "1.4", letterSpacing: "var(--track-snug)", fontWeight: "600" }],
        "body-l": ["18px", { lineHeight: "var(--lh-body-x)" }],
        body: ["16px", { lineHeight: "var(--lh-body-x)" }],
        label: ["14px", { lineHeight: "1.45" }],
        caption: ["12px", { lineHeight: "1.45" }],
        mono: ["13px", { lineHeight: "1.5" }],
      },
      // Tailwind's default radius scale is kept; these add named roles.
      borderRadius: {
        tile: "14px",
        panel: "28px",
        hero: "36px",
        card: "20px",
        btn: "14px",
        sheet: "28px",
      },
      spacing: {
        "safe-top": "44px",
        "safe-bottom": "34px",
      },
      maxWidth: {
        prose: "720px",
        page: "1240px",
      },
      boxShadow: {
        hairline: "0 0 0 1px rgba(11,13,20,0.06)",
        soft: "0 1px 2px rgba(11,13,20,0.04), 0 2px 8px rgba(11,13,20,0.04)",
        lift: "0 1px 2px rgba(11,13,20,0.05), 0 8px 24px -6px rgba(11,13,20,0.10)",
        float: "0 2px 6px rgba(11,13,20,0.05), 0 24px 60px -18px rgba(11,13,20,0.22)",
        "glow-navy": "0 10px 30px -8px rgba(31,67,184,0.45)",
        "glow-saffron": "0 10px 30px -8px rgba(255,138,31,0.45)",
        "inset-hi": "inset 0 1px 0 rgba(255,255,255,0.7)",
        // legacy
        card: "0 1px 2px rgba(26,26,26,0.04), 0 8px 24px rgba(26,26,26,0.06)",
        device: "0 50px 90px -24px rgba(26,26,26,0.45), 0 8px 24px rgba(26,26,26,0.18)",
        sheet: "0 -8px 40px rgba(26,26,26,0.18)",
        cta: "0 6px 16px rgba(201,70,15,0.25)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
        ios: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      transitionDuration: {
        DEFAULT: "320ms",
      },
      keyframes: {
        "aurora-spin": { to: { transform: "rotate(360deg)" } },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        "shimmer-x": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        // Arc drawn in, then erased from its start — a loader that never leaves the mark.
        "arc-trace": {
          "0%": { strokeDashoffset: "1" },
          "55%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-1" },
        },
        "dot-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.72)" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
        // legacy
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "voice-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.55" },
          "50%": { transform: "scale(1.18)", opacity: "1" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        wave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "aurora-spin": "aurora-spin 9s linear infinite",
        "aurora-spin-fast": "aurora-spin 2.4s linear infinite",
        breathe: "breathe 4.5s cubic-bezier(0.65,0,0.35,1) infinite",
        ripple: "ripple 1.8s cubic-bezier(0.16,1,0.3,1) infinite",
        "shimmer-x": "shimmer-x 1.8s cubic-bezier(0.65,0,0.35,1) infinite",
        "arc-trace": "arc-trace 1.5s cubic-bezier(0.65,0,0.35,1) infinite",
        "dot-pulse": "dot-pulse 1.5s cubic-bezier(0.65,0,0.35,1) infinite",
        marquee: "marquee 40s linear infinite",
        // legacy
        "fade-up": "fade-up 0.5s cubic-bezier(0.32,0.72,0,1) both",
        "voice-pulse": "voice-pulse 1.5s ease-in-out infinite",
        wave: "wave 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
