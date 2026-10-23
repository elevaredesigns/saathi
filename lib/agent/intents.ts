/**
 * Understands a request by keywords in English, Hindi (and Hinglish), Bengali
 * and Tamil. Deliberately simple and transparent: a reviewer can read exactly
 * which words route to which mission.
 */
import type { Locale } from "@/lib/i18n/config";
import { findFaq, findTopic, wantsInfo } from "./knowledge";
import type { MissionId } from "./types";

type Routable = Exclude<MissionId, "fallback" | "scheme" | "status" | "answer" | "faq" | "compound">;

const KEYWORDS: Record<Routable, string[]> = {
  newBaby: [
    "birth certificate", "birth cert", "birth", "newborn", "new baby", "baby", "born", "daughter",
    "janam", "janm", "praman patra",
    "जन्म", "प्रमाणपत्र", "नवजात", "बच्चा", "बेटी",
    "জন্ম", "সনদ", "নবজাতক", "শিশু", "মেয়ে",
    "பிறப்பு", "சான்றிதழ்", "குழந்தை", "மகள்",
  ],
  owed: [
    "scheme", "schemes", "eligible", "eligibility", "entitled", "owed", "benefit", "benefits", "yojana", "subsidy",
    "योजना", "योजनाएं", "योजनाएँ", "पात्र", "लाभ", "हक",
    "প্রকল্প", "যোগ্য", "সুবিধা",
    "திட்டம்", "திட்டங்கள்", "தகுதி", "நலன்",
  ],
  tax: [
    "property tax", "house tax", "tax", "pay", "bill", "dues",
    "bhugtan",
    "संपत्ति कर", "टैक्स", "संपत्ति", "भुगतान", "बिल",
    "সম্পত্তি কর", "সম্পত্তি", "পরিশোধ", "বিল",
    "வரி", "சொத்து", "செலுத்த",
  ],
  ayushman: [
    "ayushman card", "ayushman", "health card", "pmjay", "abha",
    "आयुष्मान", "स्वास्थ्य कार्ड",
    "আয়ুষ্মান", "স্বাস্থ্য কার্ড",
    "ஆயுஷ்மான்", "சுகாதார அட்டை",
  ],
  father: [
    "pension", "father", "dad", "papa", "life certificate", "jeevan pramaan", "jeevan praman", "old age",
    "पेंशन", "पिता", "पापा", "जीवन प्रमाण",
    "পেনশন", "বাবা", "জীবন প্রমাণ",
    "ஓய்வூதியம்", "தந்தை", "அப்பா",
  ],
  language: [
    "language", "hindi", "bengali", "bangla", "tamil", "english", "talk to me in", "speak in",
    "भाषा", "हिंदी", "हिन्दी", "बांग्ला", "तमिल", "अंग्रेज़ी",
    "ভাষা", "বাংলা", "হিন্দি", "তামিল", "ইংরেজি",
    "மொழி", "தமிழ", "இந்தி", "ஆங்கிலம்",
  ],
  help: [
    "help", "human", "person", "csc", "helpline", "call",
    "मदद", "सहायता", "इंसान",
    "সাহায্য", "মানুষ",
    "உதவி", "மனிதர்",
  ],
  track: [
    "track", "status", "application", "applications", "where is my",
    "आवेदन", "स्थिति", "कहाँ",
    "আবেদন", "অবস্থা",
    "விண்ணப்பம்", "நிலை",
  ],
};

/** Ties resolve toward the more specific mission. */
const PRIORITY: Routable[] = ["ayushman", "father", "newBaby", "tax", "language", "owed", "track", "help"];

const norm = (s: string) => s.toLowerCase().normalize("NFC").replace(/[?!.,।॥]/g, " ").replace(/\s+/g, " ").trim();

export function scoreIntents(text: string): Record<Routable, number> {
  const t = ` ${norm(text)} `;
  const scores = Object.fromEntries(PRIORITY.map((id) => [id, 0])) as Record<Routable, number>;
  for (const id of PRIORITY) {
    for (const kw of KEYWORDS[id]) {
      const k = norm(kw);
      // Multi-word phrases count double: they are much more specific.
      if (t.includes(k)) scores[id] += k.includes(" ") ? 2 : 1;
    }
  }
  return scores;
}

export function matchIntent(text: string): MissionId {
  if (!norm(text)) return "fallback";
  const scores = scoreIntents(text);
  let best: Routable | null = null;
  for (const id of PRIORITY) {
    if (scores[id] > 0 && (best === null || scores[id] > scores[best])) best = id;
  }
  return best ?? "fallback";
}

/* --------------------------------------------------- reply language --- */

const SCRIPTS: [Locale, RegExp][] = [
  ["hi", /[\u0900-\u097F]/g], // Devanagari
  ["bn", /[\u0980-\u09FF]/g], // Bengali
  ["ta", /[\u0B80-\u0BFF]/g], // Tamil
];

/**
 * The language to answer in, judged from the script someone typed in: a question
 * written in Devanagari, Bengali or Tamil script is answered in Hindi, Bengali or
 * Tamil, whatever the app is set to. Latin text (English or Hinglish) returns null.
 */
export function scriptLocale(text: string): Locale | null {
  let best: Locale | null = null;
  let most = 0;
  for (const [lc, re] of SCRIPTS) {
    const n = text.match(re)?.length ?? 0;
    if (n > most) {
      best = lc;
      most = n;
    }
  }
  return most >= 2 ? best : null;
}

/* ----------------------------------------------------------- routing --- */

export interface Route {
  mission: MissionId;
  param?: string;
}

/** Services an acting mission already covers end to end — asked as a task, the mission runs. */
const MISSION_TOPICS: Partial<Record<Routable, string[]>> = {
  newBaby: ["cert_birth"],
  tax: ["taxes_property", "land_tax"],
  ayushman: ["health_ayushman", "pmjay"],
  father: ["money_pension", "money_oldage", "ignoaps"],
};

/**
 * Decides what one request is: a task Saathi can carry out, a question about a
 * service (answered in detail), a question about Saathi itself, or none of these.
 * Asking to understand ("what documents…", "how much…", "tell me about…") gets
 * an explanation; asking for a task the agent can do gets the agent.
 */
export function routeOne(text: string): Route {
  const action = matchIntent(text);
  if (action === "language") return { mission: "language" };
  const topic = findTopic(text);
  if (topic) {
    if (wantsInfo(text)) return { mission: "answer", param: topic };
    if (action !== "fallback" && MISSION_TOPICS[action as Routable]?.includes(topic)) return { mission: action };
    if (action === "track") return { mission: "track" };
    return { mission: "answer", param: topic };
  }
  const faq = findFaq(text);
  if (faq && !["newBaby", "tax", "ayushman", "father"].includes(action)) return { mission: "faq", param: faq };
  return { mission: action };
}

const SPLIT = /\?|;|\n|\s(?:and also|and|also|as well as|plus|और|तथा|एवं|साथ ही|এবং|আর|மற்றும்)\s/i;

/** Breaks a message into separate questions — only where each piece stands on its own. */
export function splitQuestions(text: string): string[] {
  const parts = text.split(SPLIT).map((p) => p.trim()).filter((p) => norm(p).length >= 3);
  return parts.slice(0, 3);
}

/** Routes a whole message; several distinct questions become one compound answer. */
export function routeRequest(text: string): Route {
  const parts = splitQuestions(text);
  if (parts.length > 1) {
    const routes = parts.map(routeOne).filter((r) => r.mission !== "fallback");
    const distinct = new Set(routes.map((r) => `${r.mission}:${r.param ?? ""}`));
    if (distinct.size > 1) return { mission: "compound" };
  }
  return routeOne(text);
}

const LANGUAGE_NAMES: Record<Locale, string[]> = {
  as: ["assamese", "অসমীয়া", "असमिया", "অসমীয়াত"],
  brx: ["bodo", "बड़ो", "बोडो"],
  dgo: ["dogri", "डोगरी"],
  gu: ["gujarati", "ગુજરાતી", "गुजराती"],
  kn: ["kannada", "ಕನ್ನಡ", "कन्नड़"],
  ks: ["kashmiri", "كٲشُر", "कश्मीरी"],
  kok: ["konkani", "कोंकणी"],
  mai: ["maithili", "मैथिली"],
  ml: ["malayalam", "മലയാളം", "मलयालम"],
  mni: ["manipuri", "meitei", "meiteilon", "ꯃꯤꯇꯩꯂꯣꯟ", "मणिपुरी"],
  mr: ["marathi", "मराठी"],
  ne: ["nepali", "नेपाली"],
  or: ["odia", "oriya", "ଓଡ଼ିଆ", "ओड़िया", "उड़िया"],
  pa: ["punjabi", "ਪੰਜਾਬੀ", "पंजाबी"],
  sa: ["sanskrit", "संस्कृत"],
  sat: ["santali", "संताली", "संथाली"],
  sd: ["sindhi", "سنڌي", "सिंधी"],
  te: ["telugu", "తెలుగు", "तेलुगु"],
  ur: ["urdu", "اردو", "उर्दू"],
  hi: ["hindi", "हिंदी", "हिन्दी", "হিন্দি", "இந்தி"],
  bn: ["bengali", "bangla", "बांग्ला", "বাংলা", "பெங்காலி"],
  ta: ["tamil", "तमिल", "তামিল", "தமிழ்", "தமிழ"],
  en: ["english", "अंग्रेज़ी", "अंग्रेजी", "ইংরেজি", "ஆங்கிலம்"],
};

/** Which language the person asked for, if any. Specific names are checked before the four core ones. */
export function detectLanguageRequest(text: string): Locale | null {
  const t = norm(text);
  for (const l of Object.keys(LANGUAGE_NAMES) as Locale[]) {
    if (LANGUAGE_NAMES[l].some((n) => t.includes(norm(n)))) return l;
  }
  return null;
}
