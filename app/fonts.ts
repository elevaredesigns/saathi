/**
 * Bharat Precision type pairings.
 *
 *   Latin UI + display  → Geist (variable, local)
 *   Editorial accent    → Instrument Serif (italic, single emotive words)
 *   Data / agent logs   → Geist Mono
 *   Indic display       → Anek Devanagari · Bangla · Tamil · Telugu · Gujarati
 *                         · Kannada · Malayalam · Odia · Gurmukhi (Ek Type, India)
 *   Indic body          → Noto Sans for each of those scripts (UX4G)
 *   Perso-Arabic        → Noto Nastaliq Urdu (Urdu) · Noto Naskh Arabic (Sindhi, Kashmiri)
 *   Meetei Mayek        → Noto Sans Meetei Mayek (Manipuri)
 *   Wordmark            → Tiro Devanagari Hindi (साथी only)
 *
 * Every non-Latin face uses preload:false — its files download only when that
 * script actually renders, so a visitor pays only for the language they read.
 */
import localFont from "next/font/local";
import {
  Anek_Bangla,
  Anek_Devanagari,
  Anek_Gujarati,
  Anek_Gurmukhi,
  Anek_Kannada,
  Anek_Malayalam,
  Anek_Odia,
  Anek_Tamil,
  Anek_Telugu,
  Instrument_Serif,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_Gujarati,
  Noto_Sans_Gurmukhi,
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
  Noto_Sans_Meetei_Mayek,
  Noto_Sans_Oriya,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Tiro_Devanagari_Hindi,
} from "next/font/google";

/* ---------------------------------------------------------------- 2.0 --- */

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const anekDeva = Anek_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-anek-deva",
  display: "swap",
  preload: false,
});
const anekBangla = Anek_Bangla({
  subsets: ["bengali"],
  variable: "--font-anek-bangla",
  display: "swap",
  preload: false,
});
const anekTamil = Anek_Tamil({
  subsets: ["tamil"],
  variable: "--font-anek-tamil",
  display: "swap",
  preload: false,
});

const notoDeva = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-deva",
  display: "swap",
  preload: false,
});
const notoBeng = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-noto-beng",
  display: "swap",
  preload: false,
});
const notoTaml = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-noto-taml",
  display: "swap",
  preload: false,
});

const tiro = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-tiro",
  display: "swap",
});

const anekTelu = Anek_Telugu({ subsets: ["telugu"], variable: "--font-anek-telu", display: "swap", preload: false });
const anekGujr = Anek_Gujarati({ subsets: ["gujarati"], variable: "--font-anek-gujr", display: "swap", preload: false });
const anekKnda = Anek_Kannada({ subsets: ["kannada"], variable: "--font-anek-knda", display: "swap", preload: false });
const anekMlym = Anek_Malayalam({ subsets: ["malayalam"], variable: "--font-anek-mlym", display: "swap", preload: false });
const anekOrya = Anek_Odia({ subsets: ["oriya"], variable: "--font-anek-orya", display: "swap", preload: false });
const anekGuru = Anek_Gurmukhi({ subsets: ["gurmukhi"], variable: "--font-anek-guru", display: "swap", preload: false });

const notoTelu = Noto_Sans_Telugu({ subsets: ["telugu"], variable: "--font-noto-telu", display: "swap", preload: false });
const notoGujr = Noto_Sans_Gujarati({ subsets: ["gujarati"], variable: "--font-noto-gujr", display: "swap", preload: false });
const notoKnda = Noto_Sans_Kannada({ subsets: ["kannada"], variable: "--font-noto-knda", display: "swap", preload: false });
const notoMlym = Noto_Sans_Malayalam({ subsets: ["malayalam"], variable: "--font-noto-mlym", display: "swap", preload: false });
const notoOrya = Noto_Sans_Oriya({ subsets: ["oriya"], variable: "--font-noto-orya", display: "swap", preload: false });
const notoGuru = Noto_Sans_Gurmukhi({ subsets: ["gurmukhi"], variable: "--font-noto-guru", display: "swap", preload: false });
const notoMtei = Noto_Sans_Meetei_Mayek({ subsets: ["meetei-mayek"], variable: "--font-noto-mtei", display: "swap", preload: false });
const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], variable: "--font-nastaliq", display: "swap", preload: false });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], variable: "--font-naskh", display: "swap", preload: false });

export const fontVariables = [
  geist,
  geistMono,
  instrument,
  anekDeva,
  anekBangla,
  anekTamil,
  anekTelu,
  anekGujr,
  anekKnda,
  anekMlym,
  anekOrya,
  anekGuru,
  notoDeva,
  notoBeng,
  notoTaml,
  notoTelu,
  notoGujr,
  notoKnda,
  notoMlym,
  notoOrya,
  notoGuru,
  notoMtei,
  nastaliq,
  naskh,
  tiro,
]
  .map((f) => f.variable)
  .join(" ");
