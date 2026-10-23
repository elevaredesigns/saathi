import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadDeva } from "@remotion/google-fonts/NotoSansDevanagari";
import { loadFont as loadBeng } from "@remotion/google-fonts/NotoSansBengali";
import { loadFont as loadTaml } from "@remotion/google-fonts/NotoSansTamil";
import { loadFont as loadMlym } from "@remotion/google-fonts/NotoSansMalayalam";
import { loadFont as loadGuru } from "@remotion/google-fonts/NotoSansGurmukhi";
import { loadFont as loadArab } from "@remotion/google-fonts/NotoSansArabic";
import { loadFont as loadMtei } from "@remotion/google-fonts/NotoSansMeeteiMayek";
import { loadFont as loadTelu } from "@remotion/google-fonts/NotoSansTelugu";
import { loadFont as loadOlck } from "@remotion/google-fonts/NotoSansOlChiki";
import { Easing } from "remotion";

export const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily;
export const deva = loadDeva("normal", { weights: ["600"], subsets: ["devanagari"] }).fontFamily;
export const beng = loadBeng("normal", { weights: ["600"], subsets: ["bengali"] }).fontFamily;
export const taml = loadTaml("normal", { weights: ["600"], subsets: ["tamil"] }).fontFamily;
export const mlym = loadMlym("normal", { weights: ["600"], subsets: ["malayalam"] }).fontFamily;
export const guru = loadGuru("normal", { weights: ["600"], subsets: ["gurmukhi"] }).fontFamily;
export const arab = loadArab("normal", { weights: ["600"], subsets: ["arabic"] }).fontFamily;
export const mtei = loadMtei("normal", { weights: ["600"], subsets: ["meetei-mayek"] }).fontFamily;
export const telu = loadTelu("normal", { weights: ["600"], subsets: ["telugu"] }).fontFamily;
export const olck = loadOlck("normal", { weights: ["600"], subsets: ["ol-chiki"] }).fontFamily;

export const C = {
  ink: "#0B0D14",
  ink2: "#3B4150",
  ink3: "#6B7280",
  page: "#FBFBFC",
  navy: "#1F43B8",
  navy9: "#0A1C54",
  saffron: "#FF8A1F",
  green: "#12803C",
  line: "#E6E8EE",
};

export const FPS = 30;
/** Apple-style deceleration for things arriving. */
export const out = Easing.bezier(0.16, 1, 0.3, 1);
/** Smooth in-and-out for moves across the frame. */
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const display = {
  fontFamily: inter,
  fontWeight: 600,
  letterSpacing: "-0.035em",
  lineHeight: 1.02,
  color: C.ink,
} as const;
