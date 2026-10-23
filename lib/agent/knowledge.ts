/**
 * Saathi AI's knowledge: detailed, sourced answers about every service and
 * scheme the prototype models, plus the questions people ask about Saathi
 * itself. Answers are composed from the same data the apply engine uses, so
 * what Saathi says always matches what the form will ask for. Still scripted:
 * every sentence is a reviewable template filled from reviewed data.
 */
import { APPLY_FLOW_IDS, getApplyFlow, type ApplyFlow, type ApplyKind } from "@/lib/applyFlows";
import { isCoreLocale, type CoreLocale, type Locale } from "@/lib/i18n/config";
import { getScheme, getTask, loc, type L } from "@/lib/mockData";
import type { Block, Suggestion } from "./types";

const l = (en: string, hi: string, bn: string, ta: string): L => ({ en, hi, bn, ta });

/** Builds an L by running a per-language template — the four core languages plus the current one. */
function compose(fn: (lc: Locale, core: CoreLocale) => string, current: Locale): L {
  const out: Record<string, string> = {};
  for (const lc of ["en", "hi", "bn", "ta"] as const) out[lc] = fn(lc, lc);
  if (!isCoreLocale(current)) out[current] = fn(current, "en");
  return out as L;
}

export const norm = (s: string) =>
  s.toLowerCase().normalize("NFC").replace(/[?!.,;:()·'"“”‘’।॥]/g, " ").replace(/[-–—/]/g, " ").replace(/\s+/g, " ").trim();

/* ------------------------------------------------------------ topics --- */

/** Extra words people actually use for each service, beyond its official name. */
const SYNONYMS: Record<string, string[]> = {
  cert_birth: ["birth certificate", "birth cert", "janam praman patra", "जन्म प्रमाण", "জন্ম সনদ", "பிறப்புச் சான்றிதழ்"],
  cert_income: ["income certificate", "aay praman patra", "आय प्रमाण", "আয়ের সনদ", "வருமானச் சான்றிதழ்"],
  cert_caste: ["caste certificate", "jati praman patra", "sc certificate", "st certificate", "obc certificate", "जाति प्रमाण", "জাতি সনদ", "சாதிச் சான்றிதழ்"],
  pmkisan: ["pm kisan", "pmkisan", "kisan samman", "kisan nidhi", "farmer income support", "किसान सम्मान", "पीएम किसान", "কিসান", "கிசான்"],
  pmjay: ["ayushman bharat", "pm jay", "pmjay", "golden card", "5 lakh cover", "आयुष्मान भारत", "আয়ুষ্মান ভারত", "ஆயுஷ்மான் பாரத்"],
  health_ayushman: ["ayushman card", "abha card", "आयुष्मान कार्ड", "আয়ুষ্মান কার্ড", "ஆயுஷ்மான் அட்டை"],
  pmay: ["pm awas", "awas yojana", "housing scheme", "house scheme", "pmay", "pradhan mantri awas", "आवास योजना", "আবাস যোজনা", "வீட்டுத் திட்டம்"],
  jsy: ["janani suraksha", "jsy", "delivery benefit", "जननी सुरक्षा", "জননী সুরক্ষা", "ஜனனி சுரக்ஷா"],
  sukanya: ["sukanya samriddhi", "sukanya", "ssy", "girl child savings", "सुकन्या", "সুকন্যা", "சுகன்யா"],
  pmmvy: ["matru vandana", "pmmvy", "pregnancy benefit", "maternity benefit", "मातृ वंदना", "মাতৃ বন্দনা", "மாத்ரு வந்தனா"],
  nsp: ["national scholarship", "nsp", "scholarship portal", "राष्ट्रीय छात्रवृत्ति", "জাতীয় বৃত্তি", "தேசிய உதவித்தொகை"],
  edu_scholarship: ["scholarship", "state scholarship", "छात्रवृत्ति", "বৃত্তি", "உதவித்தொகை"],
  apy: ["atal pension", "apy", "अटल पेंशन", "অটল পেনশন", "அடல் ஓய்வூதியம்"],
  pmsby: ["suraksha bima", "pmsby", "accident insurance", "सुरक्षा बीमा", "সুরক্ষা বিমা", "விபத்துக் காப்பீடு"],
  ignoaps: ["old age pension scheme", "vridha pension", "ignoaps", "वृद्धावस्था पेंशन", "বার্ধক্য ভাতা", "முதியோர் ஓய்வூதியம்"],
  money_oldage: ["old age pension", "senior citizen pension", "बुढ़ापा पेंशन"],
  money_pension: ["pension account", "nps", "open pension"],
  money_bank: ["jan dhan", "bank account link", "link bank", "dbt bank", "जन धन", "ব্যাংক অ্যাকাউন্ট", "வங்கிக் கணக்கு"],
  mudra: ["mudra loan", "mudra", "business loan", "small business loan", "मुद्रा लोन", "মুদ্রা ঋণ", "முத்ரா கடன்"],
  vishwakarma: ["vishwakarma", "artisan scheme", "craftsman", "विश्वकर्मा", "বিশ্বকর্মা", "விஸ்வகர்மா"],
  identity_addr: ["aadhaar address", "change address", "address update", "update address", "आधार पता", "पता बदल", "আধার ঠিকানা", "ஆதார் முகவரி"],
  identity_mobile: ["link mobile", "mobile number aadhaar", "aadhaar mobile", "मोबाइल लिंक", "মোবাইল লিঙ্ক", "மொபைல் இணை"],
  identity_eaadhaar: ["e aadhaar", "eaadhaar", "download aadhaar", "lost aadhaar", "aadhaar copy", "ई आधार", "ই আধার", "மின் ஆதார்"],
  health_hospital: ["hospital appointment", "opd", "doctor appointment", "hospital registration", "अस्पताल पंजीकरण", "হাসপাতাল", "மருத்துவமனை பதிவு"],
  health_checkup: ["health check up", "health checkup", "check up", "medical test", "स्वास्थ्य जाँच", "স্বাস্থ্য পরীক্ষা", "உடல்நலப் பரிசோதனை"],
  edu_admission: ["school admission", "admission", "दाखिला", "ভর্তি", "சேர்க்கை"],
  edu_verify: ["verify certificate", "degree verification", "marksheet verification", "certificate verification"],
  land_record: ["land record", "khatauni", "bhulekh", "jamabandi", "khasra", "भूलेख", "खतौनी", "জমির রেকর্ড", "நிலப் பதிவு"],
  land_tax: ["land revenue", "lagan"],
  land_mutation: ["mutation", "dakhil kharij", "land transfer", "name transfer on land", "दाखिल खारिज", "নামজারি", "பெயர் மாற்றம்"],
  transport_dl: ["driving licence", "driving license", "dl renewal", "renew licence", "renew license", "licence renewal", "ड्राइविंग लाइसेंस", "ড্রাইভিং লাইসেন্স", "ஓட்டுநர் உரிமம்"],
  transport_challan: ["traffic challan", "challan", "e challan", "traffic fine", "चालान", "চালান", "அபராதம்"],
  transport_vehicle: ["vehicle registration", "register vehicle", "new vehicle", "new car registration", "new bike registration", "वाहन पंजीकरण", "যানবাহন নিবন্ধন", "வாகனப் பதிவு"],
  transport_ll: ["learner licence", "learner license", "learning licence", "learners licence", "ll test", "लर्निंग लाइसेंस", "লার্নার", "பழகுநர் உரிமம்"],
  transport_rc_transfer: ["rc transfer", "ownership transfer", "transfer vehicle", "sell my vehicle", "sell my car", "वाहन हस्तांतरण"],
  transport_rc_duplicate: ["duplicate rc", "lost rc", "rc lost", "डुप्लीकेट आरसी"],
  transport_puc: ["puc", "pollution certificate", "pollution under control", "प्रदूषण प्रमाणपत्र", "দূষণ সনদ", "மாசுக் கட்டுப்பாட்டு"],
  transport_hsrp: ["hsrp", "number plate", "high security plate", "नंबर प्लेट", "নম্বর প্লেট", "எண் தகடு"],
  exam_nta: ["neet", "jee", "cuet", "nta", "entrance exam"],
  exam_board: ["board exam", "supplementary exam", "compartment exam", "बोर्ड परीक्षा", "বোর্ড পরীক্ষা", "பொதுத் தேர்வு"],
  exam_recruit: ["government job", "sarkari naukri", "recruitment", "ssc exam", "ssc", "सरकारी नौकरी", "भर्ती", "সরকারি চাকরি", "அரசு வேலை"],
  exam_admit: ["admit card", "hall ticket", "प्रवेश पत्र", "এডমিট কার্ড", "நுழைவுச் சீட்டு"],
  exam_result: ["exam result", "marksheet", "result", "परिणाम", "रिजल्ट", "ফলাফল", "தேர்வு முடிவு"],
  exam_reval: ["revaluation", "re evaluation", "rechecking", "पुनर्मूल्यांकन", "পুনর্মূল্যায়ন", "மறுமதிப்பீடு"],
  emp_jobcard: ["job card", "mgnrega", "nrega", "manrega", "मनरेगा", "जॉब कार्ड", "জব কার্ড", "வேலை அட்டை"],
  emp_skill: ["skill training", "skill india", "pmkvy", "कौशल", "দক্ষতা প্রশিক্ষণ", "திறன் பயிற்சி"],
  emp_work: ["e shram", "eshram", "shram card", "unorganised worker", "ई श्रम", "ই শ্রম", "இ ஷ்ரம்"],
  taxes_property: ["property tax", "house tax", "griha kar", "गृहकर", "संपत्ति कर", "সম্পত্তি কর", "சொத்து வரி"],
  taxes_income: ["income tax", "itr", "tax return", "आयकर", "आईटीआर", "আয়কর", "வருமான வரி"],
  taxes_bill: ["electricity bill", "water bill", "gas bill", "bijli bill", "utility bill", "बिजली बिल", "पानी बिल", "বিদ্যুৎ বিল", "மின் கட்டணம்"],
  griev_file: ["complaint", "grievance", "cpgrams", "शिकायत", "অভিযোগ", "புகார்"],
  griev_track: ["complaint status", "track complaint", "grievance status", "शिकायत की स्थिति"],
  griev_feedback: ["feedback", "suggestion to government", "सुझाव", "মতামত", "கருத்து"],
};

/** Words too common to tell services apart. */
const GENERIC = new Set(
  ("apply for a an the to my get download pay book register new at of and online form certificate card copy " +
    "आवेदन करें करना के का की लिए में और है भुगतान डाउनलोड प्रमाणपत्र पंजीकरण नया नई बुक कार्ड " +
    "করুন জন্য আবেদন সনদ কার্ড নিবন্ধন பெறுங்கள் விண்ணப்பம் சான்றிதழ் அட்டை").split(" "),
);

interface Topic {
  id: string;
  /** Whole phrases — a hit is strong evidence. */
  phrases: string[];
  /** Distinctive single words from the official names. */
  words: Set<string>;
}

let TOPICS: Topic[] | null = null;
function topics(): Topic[] {
  if (TOPICS) return TOPICS;
  TOPICS = APPLY_FLOW_IDS.map((id) => {
    const names: L[] = [getApplyFlow(id).service, getScheme(id)?.name, getTask(id)?.name].filter(Boolean) as L[];
    const phrases = new Set<string>(SYNONYMS[id]?.map(norm) ?? []);
    const words = new Set<string>();
    for (const name of names) {
      for (const v of Object.values(name)) {
        if (!v) continue;
        const n = norm(v);
        phrases.add(n);
        for (const w of n.split(" ")) if (w.length >= 3 && !GENERIC.has(w)) words.add(w);
      }
    }
    return { id, phrases: Array.from(phrases).filter((p) => p.length >= 2), words };
  });
  return TOPICS;
}

const hasPhrase = (t: string, p: string) => (p.length <= 4 && /^[a-z0-9 ]+$/.test(p) ? ` ${t} `.includes(` ${p} `) : t.includes(p));

/** Ranks services by how well they match the text. Phrase hits outweigh shared words. */
export function rankTopics(text: string): { id: string; score: number }[] {
  const t = norm(text);
  if (!t) return [];
  const tokens = new Set(t.split(" "));
  return topics()
    .map((tp) => {
      let score = 0;
      for (const p of tp.phrases) if (hasPhrase(t, p)) score = Math.max(score, 3 + p.split(" ").length);
      let shared = 0;
      tp.words.forEach((w) => { if (tokens.has(w)) shared += 1; });
      return { id: tp.id, score: score + shared };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** The service the person means, if the match is confident. */
export function findTopic(text: string): string | null {
  const [best] = rankTopics(text);
  return best && best.score >= 3 ? best.id : null;
}

/* ------------------------------------------------------------- focus --- */

export type Focus = "docs" | "fee" | "time" | "eligibility" | "steps" | "where";

const FOCUS_WORDS: Record<Focus, string[]> = {
  docs: ["document", "documents", "docs", "papers", "kagaz", "kaagaz", "dastavez", "दस्तावेज़", "दस्तावेज", "कागज़", "कागज", "নথি", "কাগজ", "ஆவண"],
  fee: ["fee", "fees", "cost", "charge", "charges", "price", "how much", "kitna", "kitne paise", "शुल्क", "फीस", "कितना", "खर्च", "ফি", "খরচ", "কত টাকা", "கட்டணம்", "செலவு", "எவ்வளவு"],
  time: ["how long", "how many days", "kitne din", "kab tak", "time does", "time will", "कितने दिन", "कितना समय", "কত দিন", "কতদিন", "எத்தனை நாள்", "எவ்வளவு நேரம்"],
  eligibility: ["eligible", "eligibility", "who can", "qualify", "criteria", "patr", "पात्र", "पात्रता", "কে পাবে", "যোগ্য", "যোগ্যতা", "தகுதி", "யார் பெறலாம்"],
  steps: ["how to", "how do i", "how can i", "process", "steps", "procedure", "kaise", "कैसे", "प्रक्रिया", "কিভাবে", "কীভাবে", "ধাপ", "எப்படி", "படிகள்", "நடைமுறை"],
  where: ["where do i", "which office", "office", "portal", "website", "kahan", "कहाँ", "কোথায়", "எங்கே", "அலுவலகம்"],
};

const EXPLAIN_WORDS = [
  "what is", "what's", "what are", "tell me", "explain", "about", "details", "detail", "information", "info", "meaning", "know more",
  "kya hai", "kya hota", "batao", "bataiye", "jankari",
  "क्या है", "क्या होता", "क्या होती", "के बारे में", "बताइए", "बताओ", "बताएं", "जानकारी", "समझाइए",
  "কী", "কি ", "সম্পর্কে", "বলুন", "জানতে চাই", "বুঝিয়ে",
  "என்ன", "பற்றி", "சொல்லுங்கள்", "விளக்கு", "விவரம்",
];

export function detectFocus(text: string): Focus | null {
  const t = ` ${norm(text)} `;
  for (const f of ["docs", "fee", "time", "eligibility", "steps", "where"] as Focus[]) {
    if (FOCUS_WORDS[f].some((w) => t.includes(norm(w)))) return f;
  }
  return null;
}

/** Asking to understand something, rather than asking Saathi to do it. */
export function wantsInfo(text: string): boolean {
  const t = ` ${norm(text)} `;
  if (detectFocus(text) && detectFocus(text) !== "where") return true;
  return EXPLAIN_WORDS.some((w) => t.includes(` ${norm(w)}`) || t.includes(norm(w) + " "));
}

/* -------------------------------------------------------- templates --- */

const T = {
  checking: l("Checking the official rules", "आधिकारिक नियम देख रहा हूँ", "সরকারি নিয়ম দেখছি", "அதிகாரப்பூர்வ விதிகளைப் பார்க்கிறேன்"),
  found: l("Rules, fees and documents found", "नियम, शुल्क और दस्तावेज़ मिले", "নিয়ম, ফি ও নথি পাওয়া গেছে", "விதிகள், கட்டணம், ஆவணங்கள் கிடைத்தன"),
  glance: l("At a glance", "एक नज़र में", "এক নজরে", "ஒரே பார்வையில்"),
  fee: l("Fee", "शुल्क", "ফি", "கட்டணம்"),
  amount: l("Amount due", "देय राशि", "বকেয়া", "செலுத்த வேண்டியது"),
  takes: l("Usually takes", "आम तौर पर लगता है", "সাধারণত লাগে", "வழக்கமாக ஆகும் நேரம்"),
  office: l("Handled by", "ज़िम्मेदार विभाग", "দায়িত্বে", "பொறுப்பு"),
  portal: l("Official portal", "आधिकारिक पोर्टल", "সরকারি পোর্টাল", "அதிகாரப்பூர்வ தளம்"),
  benefit: l("Benefit", "लाभ", "সুবিধা", "நன்மை"),
  free: l("Free", "निःशुल्क", "বিনামূল্যে", "இலவசம்"),
  docs: l("Documents you'll need", "ज़रूरी दस्तावेज़", "প্রয়োজনীয় নথি", "தேவையான ஆவணங்கள்"),
  who: l("Who can apply", "कौन आवेदन कर सकता है", "কে আবেদন করতে পারেন", "யார் விண்ணப்பிக்கலாம்"),
  tip: l(
    "I can do this with you right now — you can speak every field instead of typing, and nothing is submitted or paid until you approve it.",
    "मैं अभी आपके साथ यह कर सकता हूँ — हर फ़ील्ड टाइप करने की बजाय बोलकर भरी जा सकती है, और आपकी मंज़ूरी के बिना कुछ जमा या भुगतान नहीं होता।",
    "আমি এখনই আপনার সাথে এটি করতে পারি — প্রতিটি ঘর টাইপ না করে বলে পূরণ করা যায়, আর আপনার অনুমতি ছাড়া কিছুই জমা বা পরিশোধ হয় না।",
    "இப்போதே உங்களுடன் இதைச் செய்யலாம் — ஒவ்வொரு புலத்தையும் தட்டச்சு செய்யாமல் பேசி நிரப்பலாம்; உங்கள் ஒப்புதல் இல்லாமல் எதுவும் சமர்ப்பிக்கப்படாது, செலுத்தப்படாது.",
  ),
  human: l("Talk to a person", "किसी व्यक्ति से बात करनी है", "একজন মানুষের সাথে কথা বলতে চাই", "ஒரு மனிதரிடம் பேச வேண்டும்"),
};

const CTA: Record<ApplyKind, L> = {
  apply: l("Apply now", "अभी आवेदन करें", "এখনই আবেদন করুন", "இப்போது விண்ணப்பி"),
  pay: l("Pay now", "अभी भुगतान करें", "এখনই পরিশোধ করুন", "இப்போது செலுத்து"),
  renew: l("Renew now", "अभी नवीनीकरण करें", "এখনই নবায়ন করুন", "இப்போது புதுப்பி"),
  register: l("Register now", "अभी पंजीकरण करें", "এখনই নিবন্ধন করুন", "இப்போது பதிவு செய்"),
  download: l("Download now", "अभी डाउनलोड करें", "এখনই ডাউনলোড করুন", "இப்போது பதிவிறக்கு"),
  grievance: l("File it now", "अभी दर्ज करें", "এখনই দাখিল করুন", "இப்போது பதிவு செய்"),
};

const INTRO: Record<CoreLocale, (s: string, intro: string, dept: string, portal: string) => string> = {
  en: (s, i, d, p) => `${s} — ${i} It's handled by ${d}, on ${p}. Here's everything you need to know.`,
  hi: (s, i, d, p) => `${s} — ${i} यह काम ${d} करता है, ${p} पर। आपको जो जानना है, सब यहाँ है।`,
  bn: (s, i, d, p) => `${s} — ${i} এটি ${d} দেখে, ${p}-এ। যা জানা দরকার, সব এখানে।`,
  ta: (s, i, d, p) => `${s} — ${i} இதை ${d} கையாளுகிறது, ${p} தளத்தில். நீங்கள் தெரிந்துகொள்ள வேண்டியவை இதோ.`,
};

const STEPS_TITLE: Record<CoreLocale, (n: number) => string> = {
  en: (n) => `How it works — ${n} steps`,
  hi: (n) => `यह कैसे होता है — ${n} चरण`,
  bn: (n) => `কীভাবে হয় — ${n}টি ধাপ`,
  ta: (n) => `இது எப்படி — ${n} படிகள்`,
};

const ABOUT: Record<CoreLocale, (name: string) => string> = {
  en: (n) => `Tell me about ${n}`,
  hi: (n) => `${n} के बारे में बताइए`,
  bn: (n) => `${n} সম্পর্কে বলুন`,
  ta: (n) => `${n} பற்றிச் சொல்லுங்கள்`,
};

const DOCS_OF: Record<CoreLocale, (name: string) => string> = {
  en: (n) => `What documents do I need for ${n}?`,
  hi: (n) => `${n} के लिए कौन से दस्तावेज़ चाहिए?`,
  bn: (n) => `${n}-এর জন্য কোন নথি লাগবে?`,
  ta: (n) => `${n}-க்கு என்ன ஆவணங்கள் தேவை?`,
};

const ensureStop = (s: string) => (/[.!?।]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/** The journey a citizen actually goes through, by kind of service. */
function journey(flow: ApplyFlow, lc: Locale, core: CoreLocale): string[] {
  const sections = flow.steps.map((s) => loc(s.title, lc)).join(" · ");
  const fee = flow.fee && flow.fee !== "Free" ? flow.fee : null;
  const time = loc(flow.timeline, lc);
  const P = flow.portal;
  const J: Record<CoreLocale, Record<ApplyKind, string[]>> = {
    en: {
      apply: [`Sign in with Aadhaar and a one-time password (OTP)`, `Fill in: ${sections}`, `Attach documents — or fetch them from DigiLocker`, fee ? `Review and pay the ${fee} fee by UPI` : `Review your answers — there's no fee`, `Submit to ${P} and get a reference number`, `Track it — usually ${time}`],
      pay: [`Sign in with Aadhaar and OTP`, `Saathi fetches what's due from ${P}`, `Check the amount and the account it goes to`, `Pay by UPI after you approve`, `Get an instant, verifiable receipt`],
      renew: [`Sign in with Aadhaar and OTP`, `Your existing record is fetched from ${P}`, `Confirm or update: ${sections}`, fee ? `Pay the ${fee} fee by UPI` : `Review — there's no fee`, `Submit and track it — usually ${time}`],
      register: [`Sign in with Aadhaar and OTP`, `Fill in: ${sections}`, `Attach documents if asked`, `Submit to ${P}`, `Get a confirmation — usually ${time}`],
      download: [`Sign in with Aadhaar and OTP`, `Verify your identity on ${P}`, `Download the official copy`, `Save it to your DigiLocker wallet`],
      grievance: [`Describe the problem in your own words — by voice if you like`, `Add the office and any reference numbers`, `Submit to ${P}`, `Track every step; officers must reply within the time limit`],
    },
    hi: {
      apply: [`आधार और ओटीपी से साइन इन करें`, `भरें: ${sections}`, `दस्तावेज़ लगाएँ — या डिजिलॉकर से लाएँ`, fee ? `जाँचें और ${fee} शुल्क यूपीआई से दें` : `अपने उत्तर जाँचें — कोई शुल्क नहीं`, `${P} पर जमा करें और संदर्भ संख्या पाएँ`, `ट्रैक करें — आम तौर पर ${time}`],
      pay: [`आधार और ओटीपी से साइन इन करें`, `साथी ${P} से बकाया राशि लाता है`, `राशि और खाता जाँचें`, `मंज़ूरी के बाद यूपीआई से भुगतान करें`, `तुरंत, सत्यापित होने वाली रसीद पाएँ`],
      renew: [`आधार और ओटीपी से साइन इन करें`, `आपका मौजूदा रिकॉर्ड ${P} से लाया जाता है`, `पुष्टि या अपडेट करें: ${sections}`, fee ? `${fee} शुल्क यूपीआई से दें` : `जाँचें — कोई शुल्क नहीं`, `जमा करें और ट्रैक करें — आम तौर पर ${time}`],
      register: [`आधार और ओटीपी से साइन इन करें`, `भरें: ${sections}`, `माँगे जाने पर दस्तावेज़ लगाएँ`, `${P} पर जमा करें`, `पुष्टि पाएँ — आम तौर पर ${time}`],
      download: [`आधार और ओटीपी से साइन इन करें`, `${P} पर पहचान सत्यापित करें`, `आधिकारिक प्रति डाउनलोड करें`, `इसे अपने डिजिलॉकर वॉलेट में सहेजें`],
      grievance: [`समस्या अपने शब्दों में बताएँ — चाहें तो बोलकर`, `कार्यालय और संदर्भ संख्या जोड़ें`, `${P} पर जमा करें`, `हर चरण ट्रैक करें; अधिकारियों को समय-सीमा में जवाब देना होता है`],
    },
    bn: {
      apply: [`আধার ও ওটিপি দিয়ে সাইন ইন করুন`, `পূরণ করুন: ${sections}`, `নথি যুক্ত করুন — বা ডিজিলকার থেকে আনুন`, fee ? `যাচাই করে ${fee} ফি ইউপিআই-তে দিন` : `উত্তর যাচাই করুন — কোনো ফি নেই`, `${P}-এ জমা দিয়ে রেফারেন্স নম্বর পান`, `ট্র্যাক করুন — সাধারণত ${time}`],
      pay: [`আধার ও ওটিপি দিয়ে সাইন ইন করুন`, `সাথী ${P} থেকে বকেয়া আনে`, `পরিমাণ ও অ্যাকাউন্ট যাচাই করুন`, `অনুমতির পর ইউপিআই-তে পরিশোধ করুন`, `সঙ্গে সঙ্গে যাচাইযোগ্য রসিদ পান`],
      renew: [`আধার ও ওটিপি দিয়ে সাইন ইন করুন`, `আপনার রেকর্ড ${P} থেকে আনা হয়`, `নিশ্চিত বা আপডেট করুন: ${sections}`, fee ? `${fee} ফি ইউপিআই-তে দিন` : `যাচাই করুন — কোনো ফি নেই`, `জমা দিয়ে ট্র্যাক করুন — সাধারণত ${time}`],
      register: [`আধার ও ওটিপি দিয়ে সাইন ইন করুন`, `পূরণ করুন: ${sections}`, `চাইলে নথি যুক্ত করুন`, `${P}-এ জমা দিন`, `নিশ্চিতকরণ পান — সাধারণত ${time}`],
      download: [`আধার ও ওটিপি দিয়ে সাইন ইন করুন`, `${P}-এ পরিচয় যাচাই করুন`, `সরকারি কপি ডাউনলোড করুন`, `ডিজিলকার ওয়ালেটে সংরক্ষণ করুন`],
      grievance: [`সমস্যাটি নিজের ভাষায় বলুন — চাইলে বলে`, `দপ্তর ও রেফারেন্স নম্বর যোগ করুন`, `${P}-এ জমা দিন`, `প্রতিটি ধাপ ট্র্যাক করুন; আধিকারিকদের সময়ের মধ্যে উত্তর দিতে হয়`],
    },
    ta: {
      apply: [`ஆதார் மற்றும் OTP மூலம் உள்நுழையுங்கள்`, `நிரப்புங்கள்: ${sections}`, `ஆவணங்களை இணையுங்கள் — அல்லது டிஜிலாக்கரிலிருந்து பெறுங்கள்`, fee ? `சரிபார்த்து ${fee} கட்டணத்தை UPI மூலம் செலுத்துங்கள்` : `பதில்களைச் சரிபாருங்கள் — கட்டணம் இல்லை`, `${P}-இல் சமர்ப்பித்து குறிப்பு எண்ணைப் பெறுங்கள்`, `கண்காணியுங்கள் — வழக்கமாக ${time}`],
      pay: [`ஆதார் மற்றும் OTP மூலம் உள்நுழையுங்கள்`, `சாத்தி ${P}-இலிருந்து நிலுவையைப் பெறும்`, `தொகையையும் கணக்கையும் சரிபாருங்கள்`, `ஒப்புதலுக்குப் பின் UPI மூலம் செலுத்துங்கள்`, `உடனடி, சரிபார்க்கக்கூடிய ரசீது பெறுங்கள்`],
      renew: [`ஆதார் மற்றும் OTP மூலம் உள்நுழையுங்கள்`, `உங்கள் பதிவு ${P}-இலிருந்து பெறப்படும்`, `உறுதிசெய்யுங்கள் அல்லது புதுப்பியுங்கள்: ${sections}`, fee ? `${fee} கட்டணத்தை UPI மூலம் செலுத்துங்கள்` : `சரிபாருங்கள் — கட்டணம் இல்லை`, `சமர்ப்பித்துக் கண்காணியுங்கள் — வழக்கமாக ${time}`],
      register: [`ஆதார் மற்றும் OTP மூலம் உள்நுழையுங்கள்`, `நிரப்புங்கள்: ${sections}`, `கேட்டால் ஆவணங்களை இணையுங்கள்`, `${P}-இல் சமர்ப்பியுங்கள்`, `உறுதிப்படுத்தல் பெறுங்கள் — வழக்கமாக ${time}`],
      download: [`ஆதார் மற்றும் OTP மூலம் உள்நுழையுங்கள்`, `${P}-இல் அடையாளத்தைச் சரிபாருங்கள்`, `அதிகாரப்பூர்வ நகலைப் பதிவிறக்குங்கள்`, `டிஜிலாக்கர் வாலட்டில் சேமியுங்கள்`],
      grievance: [`பிரச்சினையை உங்கள் சொற்களில் சொல்லுங்கள் — விரும்பினால் பேசி`, `அலுவலகம், குறிப்பு எண்களைச் சேருங்கள்`, `${P}-இல் சமர்ப்பியுங்கள்`, `ஒவ்வொரு படியையும் கண்காணியுங்கள்; அதிகாரிகள் கால வரம்பில் பதிலளிக்க வேண்டும்`],
    },
  };
  return J[core][flow.kind];
}

/** Two neighbouring services people often ask about next. */
function related(id: string): string[] {
  const ids = APPLY_FLOW_IDS;
  const scheme = getScheme(id);
  const group = scheme ? ids.filter((x) => getScheme(x)) : ids.filter((x) => !getScheme(x) && x.split("_")[0] === id.split("_")[0]);
  const at = group.indexOf(id);
  const picks = [group[at + 1], group[at - 1], group[at + 2]].filter((x): x is string => !!x && x !== id);
  return picks.slice(0, 2);
}

const nameOf = (id: string): L => getScheme(id)?.name ?? getTask(id)?.name ?? getApplyFlow(id).service;

/* ----------------------------------------------------------- answers --- */

/** A full, sourced answer about one service or scheme, led by what was asked. */
export function topicAnswer(id: string, focus: Focus | null, locale: Locale): Block[] {
  const flow = getApplyFlow(id);
  const scheme = getScheme(id);
  const name = nameOf(id);
  const intro = scheme?.desc ?? flow.intro;
  const core = (lc: Locale): CoreLocale => (isCoreLocale(lc) ? lc : "en");

  const facts: Block = {
    kind: "info",
    variant: "facts",
    title: T.glance,
    rows: [
      ...(flow.kind === "pay" && flow.amount ? [{ label: T.amount, value: { en: flow.amount, hi: flow.amount, bn: flow.amount, ta: flow.amount } }] : []),
      ...(flow.kind !== "pay" ? [{ label: T.fee, value: flow.fee && flow.fee !== "Free" ? { en: flow.fee, hi: flow.fee, bn: flow.fee, ta: flow.fee } : T.free }] : []),
      ...(scheme && scheme.benefit != null
        ? [{ label: T.benefit, value: compose((lc) => `₹${scheme.benefit!.toLocaleString("en-IN")} ${loc(scheme.benefitNote, lc)}`, locale) }]
        : []),
      { label: T.takes, value: flow.timeline },
      { label: T.office, value: flow.department },
      { label: T.portal, value: { en: flow.portal, hi: flow.portal, bn: flow.portal, ta: flow.portal } },
    ],
  };
  const docs: Block = { kind: "info", variant: "list", title: T.docs, items: flow.documents };
  const who: Block | null = scheme ? { kind: "info", variant: "list", title: T.who, items: scheme.eligibility } : null;
  const steps: Block = {
    kind: "info",
    variant: "steps",
    title: compose((lc, c) => STEPS_TITLE[c](journey(flow, lc, c).length), locale),
    items: (() => {
      const per = (["en", "hi", "bn", "ta"] as const).map((c) => journey(flow, c, c));
      const cur = !isCoreLocale(locale) ? journey(flow, locale, "en") : null;
      return per[0].map((_, i) => ({ en: per[0][i], hi: per[1][i], bn: per[2][i], ta: per[3][i], ...(cur ? { [locale]: cur[i] } : {}) }) as L);
    })(),
  };

  // Lead with what was asked; everything else follows.
  const order: (Block | null)[] =
    focus === "docs" ? [docs, facts, who, steps]
    : focus === "eligibility" ? [who, facts, docs, steps]
    : focus === "steps" ? [steps, docs, facts, who]
    : [facts, who, docs, steps];

  const rel = related(id);
  const suggestions: Suggestion[] = [
    { label: CTA[flow.kind], href: `/prototype/apply/?id=${id}` },
    ...(focus !== "docs" ? [{ label: compose((lc, c) => DOCS_OF[c](loc(name, lc)), locale), send: compose((lc, c) => DOCS_OF[c](loc(name, lc)), locale) }] : []),
    ...rel.map((r) => ({ label: compose((lc, c) => ABOUT[c](loc(nameOf(r), lc)), locale), send: compose((lc, c) => ABOUT[c](loc(nameOf(r), lc)), locale) })),
    { label: T.human, send: T.human },
  ];

  return [
    { kind: "thinking", label: T.checking, ms: 700 },
    { kind: "tool", source: flow.portal, ms: 900, action: name, result: T.found },
    {
      kind: "text",
      text: compose((lc) => INTRO[core(lc)](loc(name, lc), ensureStop(loc(intro, lc)), loc(flow.department, lc), flow.portal), locale),
    },
    ...(scheme ? [{ kind: "cards", cards: [{ kind: "scheme", schemeId: id, reason: scheme.eligibility[0] }] } as Block] : []),
    ...(order.filter(Boolean) as Block[]),
    { kind: "text", text: T.tip },
    { kind: "suggestions", items: suggestions },
  ];
}

/* --------------------------------------------------------------- FAQ --- */

export type FaqId = "about" | "privacy" | "official" | "offline" | "free" | "scam" | "digilocker";

const FAQ_WORDS: Record<FaqId, string[]> = {
  about: ["what can you do", "what do you do", "what is saathi", "who are you", "how does saathi work", "how does this work", "your features", "what can i ask", "tum kya kar sakte", "तुम क्या कर सकते", "आप क्या कर सकते", "साथी क्या है", "तुम कौन हो", "আপনি কী করতে পারেন", "তুমি কী করতে পারো", "সাথী কী", "நீ என்ன செய்ய முடியும்", "நீங்கள் என்ன செய்ய முடியும்", "சாத்தி என்றால்"],
  privacy: ["privacy", "my data", "data safe", "is it safe", "secure", "security", "who can see", "who sees my", "consent", "dpdp", "डेटा", "सुरक्षित", "गोपनीयता", "सहमति", "তথ্য নিরাপদ", "গোপনীয়তা", "সম্মতি", "தரவு", "தனியுரிமை", "ஒப்புதல்"],
  official: ["is this official", "official app", "is it real", "is this real", "fake", "genuine", "government app", "real website", "असली", "नकली", "सरकारी ऐप", "আসল", "ভুয়া", "সরকারি অ্যাপ", "உண்மையா", "போலி", "அரசு செயலி"],
  offline: ["offline", "no internet", "without internet", "network", "weak signal", "2g", "slow internet", "इंटरनेट नहीं", "नेटवर्क", "ইন্টারনেট নেই", "নেটওয়ার্ক", "இணையம் இல்லை", "நெட்வொர்க்"],
  free: ["is saathi free", "is it free", "free to use", "do i have to pay to use", "cost to use", "मुफ़्त है", "फ्री है", "বিনামূল্যে", "இலவசமா"],
  scam: ["agent", "middleman", "dalal", "bribe", "fraud", "scam", "otp call", "someone asked for otp", "दलाल", "रिश्वत", "धोखा", "ठगी", "দালাল", "ঘুষ", "প্রতারণা", "தரகர்", "லஞ்சம்", "மோசடி"],
  digilocker: ["digilocker", "my documents", "document wallet", "where are my documents", "डिजिलॉकर", "मेरे दस्तावेज़", "ডিজিলকার", "আমার নথি", "டிஜிலாக்கர்", "என் ஆவணங்கள்"],
};

export function findFaq(text: string): FaqId | null {
  const t = ` ${norm(text)} `;
  let best: FaqId | null = null;
  let bestLen = 0;
  for (const id of Object.keys(FAQ_WORDS) as FaqId[]) {
    for (const w of FAQ_WORDS[id]) {
      const n = norm(w);
      const hit = n.length <= 4 ? t.includes(` ${n} `) : t.includes(n);
      if (hit && n.length > bestLen) {
        best = id;
        bestLen = n.length;
      }
    }
  }
  return best;
}

const ask = (label: L): Suggestion => ({ label, send: label });
const Q = {
  dl: l("What documents do I need for a driving licence?", "ड्राइविंग लाइसेंस के लिए कौन से दस्तावेज़ चाहिए?", "ড্রাইভিং লাইসেন্সের জন্য কোন নথি লাগবে?", "ஓட்டுநர் உரிமத்துக்கு என்ன ஆவணங்கள் தேவை?"),
  kisan: l("Am I eligible for PM-KISAN?", "क्या मैं पीएम-किसान के लिए पात्र हूँ?", "আমি কি পিএম-কিসানের যোগ্য?", "நான் பிஎம்-கிசானுக்குத் தகுதியானவரா?"),
  challan: l("How do I pay a traffic challan?", "ट्रैफ़िक चालान कैसे भरें?", "ট্রাফিক চালান কীভাবে দেব?", "போக்குவரத்து அபராதத்தை எப்படிச் செலுத்துவது?"),
  income: l("How long does an income certificate take?", "आय प्रमाणपत्र में कितने दिन लगते हैं?", "আয়ের সনদ পেতে কত দিন লাগে?", "வருமானச் சான்றிதழுக்கு எத்தனை நாள் ஆகும்?"),
  privacy: l("Who can see my data?", "मेरा डेटा कौन देख सकता है?", "আমার তথ্য কে দেখতে পারে?", "என் தரவை யார் பார்க்கலாம்?"),
  complaint: l("How do I file a complaint?", "शिकायत कैसे दर्ज करें?", "অভিযোগ কীভাবে দাখিল করব?", "புகார் எப்படிப் பதிவு செய்வது?"),
};

export function faqAnswer(id: FaqId): Block[] {
  const text = (t: L, title: L, items: L[], suggestions: Suggestion[]): Block[] => [
    { kind: "text", text: t },
    { kind: "info", variant: "list", title, items },
    { kind: "suggestions", items: suggestions },
  ];
  switch (id) {
    case "about":
      return text(
        l(
          "I'm Saathi — one place for every government service. Ask me anything in your own words, by voice or text. I explain, I fill forms, and I act only when you say yes.",
          "मैं साथी हूँ — हर सरकारी सेवा के लिए एक जगह। अपने शब्दों में कुछ भी पूछिए, बोलकर या लिखकर। मैं समझाता हूँ, फ़ॉर्म भरता हूँ, और सिर्फ़ आपकी हाँ पर काम करता हूँ।",
          "আমি সাথী — প্রতিটি সরকারি পরিষেবার জন্য এক জায়গা। নিজের ভাষায় যা খুশি জিজ্ঞেস করুন, বলে বা লিখে। আমি বুঝিয়ে দিই, ফর্ম পূরণ করি, আর শুধু আপনার হ্যাঁ-তে কাজ করি।",
          "நான் சாத்தி — ஒவ்வொரு அரசுச் சேவைக்கும் ஒரே இடம். உங்கள் சொற்களில் எதையும் கேளுங்கள், பேசியோ எழுதியோ. நான் விளக்குவேன், படிவம் நிரப்புவேன், நீங்கள் சம்மதித்தால் மட்டுமே செயல்படுவேன்.",
        ),
        l("What I can do", "मैं क्या कर सकता हूँ", "আমি কী করতে পারি", "நான் என்ன செய்ய முடியும்"),
        [
          l("Explain 53 services and schemes — documents, fees, time and every step", "53 सेवाएँ और योजनाएँ समझाना — दस्तावेज़, शुल्क, समय और हर चरण", "৫৩টি পরিষেবা ও প্রকল্প বোঝানো — নথি, ফি, সময় ও প্রতিটি ধাপ", "53 சேவைகள், திட்டங்களை விளக்குதல் — ஆவணம், கட்டணம், நேரம், ஒவ்வொரு படி"),
          l("Find schemes you may qualify for, with the reason", "आप जिन योजनाओं के पात्र हो सकते हैं, कारण सहित", "যে প্রকল্পে আপনি যোগ্য হতে পারেন, কারণসহ", "நீங்கள் தகுதி பெறக்கூடிய திட்டங்கள், காரணத்துடன்"),
          l("Fill and submit applications — after your approval", "आवेदन भरना और जमा करना — आपकी मंज़ूरी के बाद", "আবেদন পূরণ ও জমা — আপনার অনুমতির পর", "விண்ணப்பம் நிரப்பிச் சமர்ப்பித்தல் — உங்கள் ஒப்புதலுக்குப் பின்"),
          l("Pay taxes, bills and challans by UPI, with a receipt", "कर, बिल और चालान यूपीआई से भरना, रसीद सहित", "কর, বিল ও চালান ইউপিআই-তে পরিশোধ, রসিদসহ", "வரி, கட்டணம், அபராதம் UPI மூலம், ரசீதுடன்"),
          l("Track applications with named officers and dates", "आवेदन ट्रैक करना — अधिकारी के नाम और तारीख सहित", "আবেদন ট্র্যাক — আধিকারিকের নাম ও তারিখসহ", "விண்ணப்பங்களைக் கண்காணித்தல் — அதிகாரி பெயர், தேதியுடன்"),
          l("Help a parent or child, in 23 languages", "माता-पिता या बच्चे की मदद, 23 भाषाओं में", "বাবা-মা বা সন্তানকে সাহায্য, ২৩টি ভাষায়", "பெற்றோர் அல்லது குழந்தைக்கு உதவி, 23 மொழிகளில்"),
        ],
        [ask(Q.dl), ask(Q.kisan), ask(Q.challan), ask(Q.privacy)],
      );
    case "privacy":
      return [
        ...text(
          l(
            "Your data moves only when you allow it — and you can always see who looked at it.",
            "आपका डेटा सिर्फ़ आपकी अनुमति से जाता है — और आप हमेशा देख सकते हैं कि किसने उसे देखा।",
            "আপনার তথ্য শুধু আপনার অনুমতিতে যায় — আর কে দেখেছে, তা সবসময় দেখতে পারেন।",
            "உங்கள் தரவு உங்கள் அனுமதியுடன் மட்டுமே செல்லும் — யார் பார்த்தார்கள் என்பதை எப்போதும் காணலாம்.",
          ),
          l("How your data is protected", "आपका डेटा कैसे सुरक्षित रहता है", "আপনার তথ্য কীভাবে সুরক্ষিত থাকে", "உங்கள் தரவு எப்படிப் பாதுகாக்கப்படுகிறது"),
          [
            l("A consent card before anything is shared: who asks, what, why and until when", "कुछ भी साझा होने से पहले सहमति कार्ड: कौन, क्या, क्यों और कब तक", "কিছু শেয়ারের আগে সম্মতি কার্ড: কে, কী, কেন ও কতদিন", "எதையும் பகிரும் முன் ஒப்புதல் அட்டை: யார், என்ன, ஏன், எதுவரை"),
            l("Every time an officer opens your documents, it's logged with a purpose", "हर बार जब कोई अधिकारी दस्तावेज़ खोलता है, उद्देश्य सहित दर्ज होता है", "আধিকারিক নথি খুললেই উদ্দেশ্যসহ লগ হয়", "அதிகாரி ஆவணத்தைத் திறக்கும் ஒவ்வொரு முறையும் நோக்கத்துடன் பதிவாகும்"),
            l("Revoke any access with one switch in Privacy & consent", "गोपनीयता व सहमति में एक स्विच से कोई भी अनुमति वापस लें", "গোপনীয়তা ও সম্মতিতে এক সুইচে অনুমতি ফেরান", "தனியுரிமை & ஒப்புதலில் ஒரே சுவிட்சில் அனுமதியைத் திரும்பப் பெறுங்கள்"),
            l("Aadhaar stays masked until an officer states why they need it", "आधार तब तक छिपा रहता है जब तक अधिकारी कारण न बताए", "আধিকারিক কারণ না বলা পর্যন্ত আধার লুকানো থাকে", "அதிகாரி காரணம் சொல்லும் வரை ஆதார் மறைக்கப்பட்டிருக்கும்"),
            l("No ads and no selling data — shaped by the DPDP Act, 2023", "कोई विज्ञापन नहीं, डेटा की बिक्री नहीं — डीपीडीपी अधिनियम, 2023 के अनुसार", "কোনো বিজ্ঞাপন নেই, তথ্য বিক্রি নেই — ডিপিডিপি আইন, ২০২৩ অনুযায়ী", "விளம்பரம் இல்லை, தரவு விற்பனை இல்லை — DPDP சட்டம், 2023 படி"),
          ],
          [{ label: l("Open Privacy & consent", "गोपनीयता व सहमति खोलें", "গোপনীয়তা ও সম্মতি খুলুন", "தனியுரிமை & ஒப்புதலைத் திற"), href: "/prototype/privacy/" }, ask(Q.complaint)],
        ),
      ];
    case "official":
      return text(
        l(
          "Honest answer: Saathi is a design concept, not an official Government of India app — all data here is sample data. Here's how to recognise real government services anywhere:",
          "सच कहूँ तो: साथी एक डिज़ाइन अवधारणा है, भारत सरकार का आधिकारिक ऐप नहीं — यहाँ का सारा डेटा नमूना है। असली सरकारी सेवाएँ ऐसे पहचानें:",
          "সত্যি বলতে: সাথী একটি ডিজাইন ধারণা, ভারত সরকারের সরকারি অ্যাপ নয় — এখানকার সব তথ্য নমুনা। আসল সরকারি পরিষেবা এভাবে চিনুন:",
          "நேர்மையாகச் சொன்னால்: சாத்தி ஒரு வடிவமைப்புக் கருத்து, இந்திய அரசின் அதிகாரப்பூர்வ செயலி அல்ல — இங்குள்ள தரவு மாதிரித் தரவு. உண்மையான அரசுச் சேவைகளை இப்படி அடையாளம் காணுங்கள்:",
        ),
        l("Spotting the real thing", "असली की पहचान", "আসল চেনার উপায়", "உண்மையானதை அறிவது"),
        [
          l("Government websites end in .gov.in or .nic.in", "सरकारी वेबसाइटें .gov.in या .nic.in पर खत्म होती हैं", "সরকারি ওয়েবসাইট .gov.in বা .nic.in-এ শেষ হয়", "அரசு இணையதளங்கள் .gov.in அல்லது .nic.in-இல் முடியும்"),
          l("Look for the padlock and https:// before sharing anything", "कुछ भी साझा करने से पहले ताला और https:// देखें", "কিছু শেয়ারের আগে তালা ও https:// দেখুন", "எதையும் பகிரும் முன் பூட்டுக் குறியையும் https://-ஐயும் பாருங்கள்"),
          l("Officials never ask for your OTP, PIN or a fee over a call or message", "अधिकारी कभी कॉल या संदेश पर ओटीपी, पिन या शुल्क नहीं माँगते", "আধিকারিকরা কখনো ফোন বা মেসেজে ওটিপি, পিন বা ফি চান না", "அதிகாரிகள் அழைப்பிலோ செய்தியிலோ OTP, PIN, கட்டணம் கேட்கமாட்டார்கள்"),
          l("Fees are paid only on the official portal, and you always get a receipt", "शुल्क सिर्फ़ आधिकारिक पोर्टल पर दिया जाता है, और रसीद हमेशा मिलती है", "ফি শুধু সরকারি পোর্টালে দেওয়া হয়, আর রসিদ সবসময় পাওয়া যায়", "கட்டணம் அதிகாரப்பூர்வ தளத்தில் மட்டும்; ரசீது எப்போதும் கிடைக்கும்"),
        ],
        [ask(Q.privacy), ask(Q.complaint)],
      );
    case "offline":
      return text(
        l(
          "Saathi is designed for weak and patchy signal. Forms save as you go, so a dropped connection never loses your answers — and a person can always help in person.",
          "साथी कमज़ोर और रुक-रुक कर आने वाले नेटवर्क के लिए बना है। फ़ॉर्म साथ-साथ सहेजे जाते हैं, इसलिए कनेक्शन टूटने पर भी उत्तर नहीं खोते — और कोई व्यक्ति हमेशा सामने मदद कर सकता है।",
          "সাথী দুর্বল ও অনিয়মিত নেটওয়ার্কের জন্য তৈরি। ফর্ম সঙ্গে সঙ্গে সংরক্ষিত হয়, তাই সংযোগ কাটলেও উত্তর হারায় না — আর একজন মানুষ সবসময় সরাসরি সাহায্য করতে পারেন।",
          "சாத்தி பலவீனமான, இடைவிடும் சிக்னலுக்காக வடிவமைக்கப்பட்டது. படிவங்கள் தொடர்ந்து சேமிக்கப்படுவதால் இணைப்பு துண்டித்தாலும் பதில்கள் இழக்கப்படாது — நேரில் உதவ ஒருவர் எப்போதும் இருப்பார்.",
        ),
        l("When the network is weak", "जब नेटवर्क कमज़ोर हो", "যখন নেটওয়ার্ক দুর্বল", "நெட்வொர்க் பலவீனமாக இருக்கும்போது"),
        [
          l("Your progress is saved after every step", "हर चरण के बाद आपकी प्रगति सहेजी जाती है", "প্রতিটি ধাপের পর অগ্রগতি সংরক্ষিত হয়", "ஒவ்வொரு படிக்குப் பிறகும் முன்னேற்றம் சேமிக்கப்படும்"),
          l("Pages are light — built to work on 2G", "पेज हल्के हैं — 2G पर चलने के लिए बने", "পেজ হালকা — 2G-তে চলার জন্য তৈরি", "பக்கங்கள் இலகுவானவை — 2G-இல் இயங்கும்படி"),
          l("Any Common Service Centre (CSC) can finish it with you", "कोई भी जन सेवा केंद्र (CSC) इसे आपके साथ पूरा कर सकता है", "যেকোনো কমন সার্ভিস সেন্টার (CSC) আপনার সাথে এটি শেষ করতে পারে", "எந்தப் பொதுச் சேவை மையமும் (CSC) உங்களுடன் முடிக்கலாம்"),
        ],
        [ask(T.human), ask(Q.dl)],
      );
    case "free":
      return text(
        l(
          "Using Saathi is free. You only pay the government's own fee for a service, which I always show before you start — and you never need to pay an agent.",
          "साथी का उपयोग मुफ़्त है। आप सिर्फ़ सेवा का सरकारी शुल्क देते हैं, जो मैं शुरू करने से पहले हमेशा दिखाता हूँ — और किसी एजेंट को पैसे देने की ज़रूरत नहीं।",
          "সাথী ব্যবহার বিনামূল্যে। আপনি শুধু পরিষেবার সরকারি ফি দেন, যা শুরুর আগেই দেখাই — আর কোনো দালালকে টাকা দিতে হয় না।",
          "சாத்தியைப் பயன்படுத்துவது இலவசம். சேவைக்கான அரசுக் கட்டணத்தை மட்டுமே செலுத்துவீர்கள் — அதைத் தொடங்கும் முன்பே காட்டுவேன்; தரகருக்குப் பணம் தர வேண்டியதில்லை.",
        ),
        l("Good to know", "जानने योग्य", "জেনে রাখুন", "தெரிந்துகொள்ளுங்கள்"),
        [
          l("Many services have no fee at all — I'll tell you which", "कई सेवाओं का कोई शुल्क नहीं — मैं बता दूँगा कौन सी", "অনেক পরিষেবার কোনো ফি নেই — কোনগুলো, বলে দেব", "பல சேவைகளுக்குக் கட்டணமே இல்லை — எவை என்று சொல்வேன்"),
          l("Every payment ends with a receipt you can verify", "हर भुगतान के बाद सत्यापित होने वाली रसीद मिलती है", "প্রতিটি পরিশোধের পর যাচাইযোগ্য রসিদ", "ஒவ்வொரு செலுத்துதலுக்கும் சரிபார்க்கக்கூடிய ரசீது"),
        ],
        [ask(Q.income), ask(Q.challan)],
      );
    case "scam":
      return text(
        l(
          "Please don't pay anyone extra or share your OTP. Government services never need a middleman — and if someone asked for money or your OTP, you can report it.",
          "कृपया किसी को अतिरिक्त पैसे न दें और अपना ओटीपी साझा न करें। सरकारी सेवाओं में किसी बिचौलिए की ज़रूरत नहीं होती — अगर किसी ने पैसे या ओटीपी माँगा है, तो आप शिकायत कर सकते हैं।",
          "দয়া করে কাউকে বাড়তি টাকা দেবেন না বা ওটিপি জানাবেন না। সরকারি পরিষেবায় দালালের দরকার হয় না — কেউ টাকা বা ওটিপি চাইলে অভিযোগ করতে পারেন।",
          "யாருக்கும் கூடுதல் பணம் தராதீர்கள், OTP-ஐப் பகிராதீர்கள். அரசுச் சேவைகளுக்குத் தரகர் தேவையில்லை — யாராவது பணம் அல்லது OTP கேட்டால் புகார் செய்யலாம்.",
        ),
        l("Stay safe", "सुरक्षित रहें", "নিরাপদ থাকুন", "பாதுகாப்பாக இருங்கள்"),
        [
          l("Your OTP is only for you — no official will ever ask for it", "ओटीपी सिर्फ़ आपके लिए है — कोई अधिकारी कभी नहीं माँगेगा", "ওটিপি শুধু আপনার — কোনো আধিকারিক কখনো চাইবেন না", "OTP உங்களுக்கு மட்டும் — எந்த அதிகாரியும் கேட்கமாட்டார்"),
          l("The fee shown in Saathi is the only fee", "साथी में दिखाया गया शुल्क ही एकमात्र शुल्क है", "সাথীতে দেখানো ফি-ই একমাত্র ফি", "சாத்தியில் காட்டப்படும் கட்டணமே ஒரே கட்டணம்"),
          l("You can file a complaint, and track it, in two minutes", "आप दो मिनट में शिकायत दर्ज और ट्रैक कर सकते हैं", "দুই মিনিটে অভিযোগ দাখিল ও ট্র্যাক করতে পারেন", "இரண்டு நிமிடத்தில் புகார் பதிவு செய்து கண்காணிக்கலாம்"),
        ],
        [{ label: l("File a complaint", "शिकायत दर्ज करें", "অভিযোগ দাখিল করুন", "புகார் பதிவு செய்"), href: "/prototype/apply/?id=griev_file" }, ask(T.human)],
      );
    case "digilocker":
      return text(
        l(
          "Your official documents live in your Saathi wallet, fetched from DigiLocker — Aadhaar, PAN, driving licence and more. I use them to fill forms, but only with your consent.",
          "आपके आधिकारिक दस्तावेज़ साथी वॉलेट में हैं, डिजिलॉकर से लाए गए — आधार, पैन, ड्राइविंग लाइसेंस और भी। मैं इनसे फ़ॉर्म भरता हूँ, पर सिर्फ़ आपकी सहमति से।",
          "আপনার সরকারি নথি সাথী ওয়ালেটে আছে, ডিজিলকার থেকে আনা — আধার, প্যান, ড্রাইভিং লাইসেন্স ও আরও। আমি এগুলো দিয়ে ফর্ম পূরণ করি, তবে শুধু আপনার সম্মতিতে।",
          "உங்கள் அதிகாரப்பூர்வ ஆவணங்கள் சாத்தி வாலட்டில் உள்ளன, டிஜிலாக்கரிலிருந்து பெறப்பட்டவை — ஆதார், PAN, ஓட்டுநர் உரிமம் மற்றும் பல. அவற்றைக் கொண்டு படிவம் நிரப்புவேன், உங்கள் ஒப்புதலுடன் மட்டும்.",
        ),
        l("Your wallet", "आपका वॉलेट", "আপনার ওয়ালেট", "உங்கள் வாலட்"),
        [
          l("Tap any card to view or share it", "देखने या साझा करने के लिए कोई भी कार्ड टैप करें", "দেখতে বা শেয়ার করতে যেকোনো কার্ডে ট্যাপ করুন", "பார்க்க அல்லது பகிர எந்த அட்டையையும் தட்டுங்கள்"),
          l("New certificates land here automatically, digitally signed", "नए प्रमाणपत्र अपने-आप यहाँ आते हैं, डिजिटल हस्ताक्षर सहित", "নতুন সনদ নিজে থেকেই এখানে আসে, ডিজিটাল স্বাক্ষরসহ", "புதிய சான்றிதழ்கள் தானாக இங்கு வரும், டிஜிட்டல் கையொப்பத்துடன்"),
        ],
        [{ label: l("Open my wallet", "मेरा वॉलेट खोलें", "আমার ওয়ালেট খুলুন", "என் வாலட்டைத் திற"), href: "/prototype/me/" }, ask(Q.privacy)],
      );
  }
}

/** Gentle suggestions for a request Saathi couldn't place: the closest services, then popular questions. */
export function closestTopics(text: string, n = 3): Suggestion[] {
  return rankTopics(text)
    .slice(0, n)
    .map((r) => ({ label: { en: ABOUT.en(nameOf(r.id).en), hi: ABOUT.hi(nameOf(r.id).hi), bn: ABOUT.bn(nameOf(r.id).bn), ta: ABOUT.ta(nameOf(r.id).ta) }, send: { en: ABOUT.en(nameOf(r.id).en), hi: ABOUT.hi(nameOf(r.id).hi), bn: ABOUT.bn(nameOf(r.id).bn), ta: ABOUT.ta(nameOf(r.id).ta) } }));
}

export const POPULAR: Suggestion[] = [ask(Q.dl), ask(Q.kisan), ask(Q.challan), ask(Q.income)];

export const topicName = nameOf;
