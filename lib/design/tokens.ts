/**
 * Bharat Precision — colour tokens (single source of truth).
 *
 * Loaded by tailwind.config.ts, so this file must stay import-free.
 * Palette logic follows UX4G (Government of India design system): white
 * surfaces, national saffron + green, a navy drawn from the Ashoka Chakra for
 * interaction. Every text pair below is enforced ≥ WCAG AA by contrast.test.ts.
 */

export const palette = {
  base: "#FFFFFF",
  surface: "#F7F8FA",
  surface2: "#EEF0F4",
  line: "#E6E8EE",
  lineStrong: "#D3D8E2",

  ink: {
    DEFAULT: "#0B0D14",
    2: "#3A3F4B",
    3: "#626978",
    4: "#9AA0AD", // decorative / disabled only — not for text
  },

  /** Chakra Navy — primary action, links, focus, authority. */
  navy: {
    50: "#EEF2FC",
    100: "#DDE5F8",
    200: "#B9C8F0",
    400: "#5577E0",
    500: "#2F55D4",
    600: "#1F43B8",
    700: "#16338F",
    800: "#10286F",
    900: "#0A1C54",
  },

  /** Saffron — highlight + glow. Never body text on white (use 700). */
  saffron: {
    50: "#FFF6EC",
    100: "#FFE8CF",
    300: "#FFBE7A",
    400: "#FFA24C",
    500: "#FF8A1F",
    700: "#B45309",
  },

  /** India Green — success, approved, verified. */
  green: {
    50: "#ECF8F0",
    100: "#D3F0DE",
    500: "#1E9E55",
    600: "#12803C",
    800: "#0B5A2A",
  },

  /** Signal red — errors only. */
  red: {
    50: "#FDEFEE",
    600: "#C8322B",
  },

  /** Supporting tints for categories + the document wallet. */
  violet: { 50: "#F3EFFD", 100: "#E6DEFB", 600: "#5B3FC4" },
  teal: { 50: "#E9F7F5", 100: "#CFEFEA", 600: "#0F766E" },

  doc: {
    aadhaarFrom: "#0A1C54",
    aadhaarTo: "#1F43B8",
    pan: "#FFE8CF",
    dl: "#D3F0DE",
    voter: "#E6DEFB",
    ayushman: "#CFEFEA",
  },
} as const;

export interface TextPair {
  name: string;
  fg: string;
  bg: string;
  min: 4.5 | 3;
}

const p = palette;
export const textPairs: TextPair[] = [
  { name: "ink on base", fg: p.ink.DEFAULT, bg: p.base, min: 4.5 },
  { name: "ink-2 on base", fg: p.ink[2], bg: p.base, min: 4.5 },
  { name: "ink-3 on base", fg: p.ink[3], bg: p.base, min: 4.5 },
  { name: "ink-3 on surface", fg: p.ink[3], bg: p.surface, min: 4.5 },
  { name: "ink-2 on surface-2", fg: p.ink[2], bg: p.surface2, min: 4.5 },
  { name: "navy-600 on base", fg: p.navy[600], bg: p.base, min: 4.5 },
  { name: "navy-700 on navy-50", fg: p.navy[700], bg: p.navy[50], min: 4.5 },
  { name: "white on navy-600", fg: p.base, bg: p.navy[600], min: 4.5 },
  { name: "white on navy-900", fg: p.base, bg: p.navy[900], min: 4.5 },
  { name: "saffron-700 on base", fg: p.saffron[700], bg: p.base, min: 4.5 },
  { name: "saffron-700 on saffron-50", fg: p.saffron[700], bg: p.saffron[50], min: 4.5 },
  { name: "ink on saffron-500", fg: p.ink.DEFAULT, bg: p.saffron[500], min: 4.5 },
  { name: "green-600 on base", fg: p.green[600], bg: p.base, min: 4.5 },
  { name: "green-800 on green-50", fg: p.green[800], bg: p.green[50], min: 4.5 },
  { name: "white on green-600", fg: p.base, bg: p.green[600], min: 4.5 },
  { name: "red-600 on base", fg: p.red[600], bg: p.base, min: 4.5 },
  { name: "red-600 on red-50", fg: p.red[600], bg: p.red[50], min: 4.5 },
  { name: "violet-600 on violet-50", fg: p.violet[600], bg: p.violet[50], min: 4.5 },
  { name: "teal-600 on teal-50", fg: p.teal[600], bg: p.teal[50], min: 4.5 },
];
