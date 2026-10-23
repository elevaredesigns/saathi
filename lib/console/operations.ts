/**
 * Everything a department runs besides the application queue: collections,
 * traffic challans, exam cycles, benefit transfers (DBT) and grievances.
 * Deterministic samples; the citizen's own challans come from the prototype.
 */
import { CHALLANS } from "@/lib/data/challans";
import { mulberry32 } from "@/lib/design/random";
import type { L } from "@/lib/mockData";
import { PROTOTYPE_TODAY } from "@/lib/utils/dateUtils";
import { getDepartment, type DeptId } from "./departments";
import { VIOLATIONS } from "./reasons";

const seedOf = (s: string) => Array.from(s).reduce((a, ch) => a * 33 + ch.charCodeAt(0), 5381) >>> 0;
const daysAgo = (d: number, h = 11, m = 0) => {
  const x = new Date(PROTOTYPE_TODAY);
  x.setDate(x.getDate() - d);
  x.setHours(h, m);
  return x.toISOString();
};
const PAYERS = ["Aarti Sharma", "Mohammed Ansari", "Ritu Gupta", "Suresh Yadav", "Neha Awasthi", "Karan Singh", "Farzana Qureshi", "Deepak Mishra", "Kavya Nigam", "Harish Dixit"];

/* ------------------------------------------------------------ payments --- */

export interface Payment {
  id: string;
  payer: string;
  purpose: L;
  amount: number;
  mode: "UPI" | "Card" | "Net banking" | "CSC cash";
  at: string;
  status: "settled" | "pending" | "failed";
}

const PURPOSES: Partial<Record<DeptId, L[]>> = {
  municipal: [
    { en: "Property tax 2026–27", hi: "संपत्ति कर 2026–27", bn: "সম্পত্তি কর ২০২৬–২৭", ta: "சொத்து வரி 2026–27" },
    { en: "Water & sewer charges", hi: "जल व सीवर शुल्क", bn: "জল ও নিকাশি শুল্ক", ta: "குடிநீர் & கழிவுநீர்க் கட்டணம்" },
    { en: "Birth certificate copy fee", hi: "जन्म प्रमाणपत्र प्रति शुल्क", bn: "জন্ম সনদের কপির ফি", ta: "பிறப்புச் சான்றிதழ் நகல் கட்டணம்" },
  ],
  transport: [
    { en: "Traffic challan", hi: "ट्रैफ़िक चालान", bn: "ট্রাফিক চালান", ta: "போக்குவரத்து அபராதம்" },
    { en: "Licence renewal fee", hi: "लाइसेंस नवीनीकरण शुल्क", bn: "লাইসেন্স নবীকরণ ফি", ta: "உரிமப் புதுப்பிப்புக் கட்டணம்" },
    { en: "HSRP number plate", hi: "एचएसआरपी नंबर प्लेट", bn: "এইচএসআরপি নম্বর প্লেট", ta: "HSRP எண் தகடு" },
  ],
  exams: [
    { en: "JEE Main application fee", hi: "जेईई मेन आवेदन शुल्क", bn: "জেইই মেন আবেদন ফি", ta: "JEE மெயின் விண்ணப்பக் கட்டணம்" },
    { en: "Board exam form fee", hi: "बोर्ड परीक्षा फ़ॉर्म शुल्क", bn: "বোর্ড পরীক্ষার ফর্ম ফি", ta: "வாரியத் தேர்வுப் படிவக் கட்டணம்" },
    { en: "Re-evaluation fee", hi: "पुनर्मूल्यांकन शुल्क", bn: "পুনর্মূল্যায়ন ফি", ta: "மறுமதிப்பீட்டுக் கட்டணம்" },
  ],
  finance: [
    { en: "APY contribution", hi: "एपीवाई अंशदान", bn: "এপিওয়াই অবদান", ta: "APY பங்களிப்பு" },
    { en: "PMSBY premium", hi: "पीएमएसबीवाई प्रीमियम", bn: "পিএমএসবিওয়াই প্রিমিয়াম", ta: "PMSBY பிரீமியம்" },
  ],
  incomeTax: [
    { en: "Self-assessment tax", hi: "स्व-निर्धारण कर", bn: "স্ব-মূল্যায়ন কর", ta: "சுய மதிப்பீட்டு வரி" },
    { en: "Refund re-issue", hi: "रिफ़ंड पुनः जारी", bn: "রিফান্ড পুনরায় প্রদান", ta: "திருப்பிச் செலுத்தல் மறுவெளியீடு" },
  ],
};
const AMOUNTS: Partial<Record<DeptId, number[]>> = {
  municipal: [2450, 1860, 3120, 640, 50],
  transport: [1000, 500, 400, 590, 2000],
  exams: [1000, 600, 500, 100],
  finance: [210, 20, 376],
  incomeTax: [4200, 12800, 960],
};

export function payments(deptId: DeptId): Payment[] {
  const purposes = PURPOSES[deptId];
  const amounts = AMOUNTS[deptId];
  if (!purposes || !amounts) return [];
  const rand = mulberry32(seedOf(`pay-${deptId}`));
  return Array.from({ length: 18 }, (_, i) => {
    const r = rand();
    return {
      id: `TXN-2026-${String(400000 + Math.floor(rand() * 599999))}`,
      payer: PAYERS[Math.floor(rand() * PAYERS.length)],
      purpose: purposes[Math.floor(rand() * purposes.length)],
      amount: amounts[Math.floor(rand() * amounts.length)],
      mode: r < 0.72 ? "UPI" : r < 0.84 ? "Net banking" : r < 0.94 ? "Card" : "CSC cash",
      at: daysAgo(Math.floor(i / 3), 9 + Math.floor(rand() * 9), Math.floor(rand() * 60)),
      status: rand() < 0.9 ? "settled" : rand() < 0.5 ? "pending" : "failed",
    } satisfies Payment;
  });
}

/* ------------------------------------------------------------- challans --- */

export interface JurisdictionChallan {
  no: string;
  vehicle: string;
  violationId: string;
  violation: L;
  section: string;
  fine: number;
  at: string;
  place: L | string;
  /** The citizen's own challan in the prototype. */
  live?: boolean;
  initial: "pending" | "paid" | "court";
}

const PLACES = ["GT Road, Rawatpur", "Mall Road", "Kalyanpur flyover", "Bada Chauraha", "Jajmau bridge", "VIP Road", "Fazalganj crossing", "Tatmill chauraha"];

export function jurisdictionChallans(): JurisdictionChallan[] {
  const own: JurisdictionChallan[] = CHALLANS.map((c) => ({
    no: c.no,
    vehicle: c.vehicle,
    violationId: c.evidence,
    violation: c.violation,
    section: c.section.replace("MV Act ", ""),
    fine: c.fine,
    at: c.when,
    place: c.place,
    live: true,
    initial: c.paid ? "paid" : "pending",
  }));
  const rand = mulberry32(seedOf("challans-up78"));
  const others: JurisdictionChallan[] = Array.from({ length: 14 }, (_, i) => {
    const v = VIOLATIONS[Math.floor(rand() * VIOLATIONS.length)];
    const r = rand();
    return {
      no: `UP7826${String(510000000 + Math.floor(rand() * 89999999))}`,
      vehicle: `UP78 ${["BT", "CM", "DZ", "EH", "FK", "GA"][Math.floor(rand() * 6)]} ${1000 + Math.floor(rand() * 8999)}`,
      violationId: v.id,
      violation: v.label,
      section: v.section,
      fine: v.fine,
      at: daysAgo(i, 8 + Math.floor(rand() * 12), Math.floor(rand() * 60)),
      place: PLACES[Math.floor(rand() * PLACES.length)],
      initial: r < 0.55 ? "pending" : r < 0.88 ? "paid" : "court",
    };
  });
  return [...own, ...others];
}

/* ---------------------------------------------------------------- exams --- */

export interface ExamCycle {
  id: string;
  name: string;
  body: L;
  forms: number;
  feePaid: number;
  photoIssues: number;
  examDate: string;
  stage: "formsOpen" | "correction" | "admitCards" | "results";
}

export const EXAM_CYCLES: ExamCycle[] = [
  { id: "jee", name: "JEE Main 2027 · Session 1", body: { en: "National Testing Agency", hi: "राष्ट्रीय परीक्षा एजेंसी", bn: "ন্যাশনাল টেস্টিং এজেন্সি", ta: "தேசியத் தேர்வு முகமை" }, forms: 48210, feePaid: 46984, photoIssues: 312, examDate: "2027-01-12", stage: "formsOpen" },
  { id: "board", name: "Board Supplementary 2026", body: { en: "State Board of Secondary Education", hi: "राज्य माध्यमिक शिक्षा बोर्ड", bn: "রাজ্য মাধ্যমিক শিক্ষা পর্ষদ", ta: "மாநில இடைநிலைக் கல்வி வாரியம்" }, forms: 9420, feePaid: 9377, photoIssues: 41, examDate: "2026-07-06", stage: "admitCards" },
  { id: "ssc", name: "SSC CGL 2027", body: { en: "Staff Selection Commission", hi: "कर्मचारी चयन आयोग", bn: "স্টাফ সিলেকশন কমিশন", ta: "பணியாளர் தேர்வாணையம்" }, forms: 126045, feePaid: 118802, photoIssues: 1204, examDate: "2027-03-02", stage: "correction" },
  { id: "reval", name: "Class XII Re-evaluation 2026", body: { en: "State Board of Secondary Education", hi: "राज्य माध्यमिक शिक्षा बोर्ड", bn: "রাজ্য মাধ্যমিক শিক্ষা পর্ষদ", ta: "மாநில இடைநிலைக் கல்வி வாரியம்" }, forms: 2310, feePaid: 2310, photoIssues: 0, examDate: "2026-06-15", stage: "results" },
];

export interface PhotoCheck {
  id: string;
  candidate: string;
  appNo: string;
  exam: string;
  issue: L;
}

export const PHOTO_CHECKS: PhotoCheck[] = [
  { id: "p1", candidate: "Kavya Nigam", appNo: "270410582216", exam: "JEE Main 2027", issue: { en: "Signature is blank", hi: "हस्ताक्षर ख़ाली है", bn: "স্বাক্ষর ফাঁকা", ta: "கையொப்பம் காலியாக உள்ளது" } },
  { id: "p2", candidate: "Mohammed Ansari", appNo: "270410913307", exam: "JEE Main 2027", issue: { en: "Face covered by glare", hi: "चेहरे पर चमक", bn: "মুখে আলোর ঝলক", ta: "முகத்தில் கண்ணை கூசும் ஒளி" } },
  { id: "p3", candidate: "Ritu Pandey", appNo: "SSC27CGL0048812", exam: "SSC CGL 2027", issue: { en: "Photo older than 3 months", hi: "फ़ोटो 3 महीने से पुरानी", bn: "ছবি ৩ মাসের বেশি পুরনো", ta: "புகைப்படம் 3 மாதத்துக்கு மேல் பழையது" } },
  { id: "p4", candidate: "Arvind Chauhan", appNo: "SSC27CGL0051904", exam: "SSC CGL 2027", issue: { en: "Cap or headwear in photo", hi: "फ़ोटो में टोपी", bn: "ছবিতে টুপি", ta: "புகைப்படத்தில் தொப்பி" } },
  { id: "p5", candidate: "Sneha Awasthi", appNo: "BSE26SUP07731", exam: "Board Supplementary", issue: { en: "Signature in capital letters", hi: "हस्ताक्षर बड़े अक्षरों में", bn: "স্বাক্ষর বড় হাতের অক্ষরে", ta: "கையொப்பம் பெரிய எழுத்துகளில்" } },
];

/* ------------------------------------------------------------------ DBT --- */

export interface DbtBatch {
  id: string;
  scheme: L;
  instalment: L;
  beneficiaries: number;
  amount: number;
  failed: number;
  initial: "awaiting" | "sent" | "credited";
}

const DBT: Partial<Record<DeptId, DbtBatch[]>> = {
  agriculture: [
    { id: "b1", scheme: { en: "PM-KISAN", hi: "पीएम-किसान", bn: "পিএম-কিসান", ta: "பிஎம்-கிசான்" }, instalment: { en: "Instalment 21 · Kanpur Nagar", hi: "किस्त 21 · कानपुर नगर", bn: "কিস্তি ২১ · কানপুর নগর", ta: "தவணை 21 · கான்பூர் நகர்" }, beneficiaries: 84210, amount: 168420000, failed: 1312, initial: "awaiting" },
    { id: "b2", scheme: { en: "PM-KISAN", hi: "पीएम-किसान", bn: "পিএম-কিসান", ta: "பிஎம்-கிசான்" }, instalment: { en: "Instalment 20 · Kanpur Nagar", hi: "किस्त 20 · कानपुर नगर", bn: "কিস্তি ২০ · কানপুর নগর", ta: "தவணை 20 · கான்பூர் நகர்" }, beneficiaries: 83604, amount: 167208000, failed: 402, initial: "credited" },
  ],
  health: [
    { id: "b1", scheme: { en: "Janani Suraksha Yojana", hi: "जननी सुरक्षा योजना", bn: "জননী সুরক্ষা যোজনা", ta: "ஜனனி சுரக்ஷா யோஜனா" }, instalment: { en: "May 2026 deliveries", hi: "मई 2026 प्रसव", bn: "মে ২০২৬ প্রসব", ta: "மே 2026 பிரசவங்கள்" }, beneficiaries: 2140, amount: 2996000, failed: 18, initial: "awaiting" },
  ],
  education: [
    { id: "b1", scheme: { en: "National Scholarship", hi: "राष्ट्रीय छात्रवृत्ति", bn: "জাতীয় বৃত্তি", ta: "தேசிய உதவித்தொகை" }, instalment: { en: "2025–26 · final list", hi: "2025–26 · अंतिम सूची", bn: "২০২৫–২৬ · চূড়ান্ত তালিকা", ta: "2025–26 · இறுதிப் பட்டியல்" }, beneficiaries: 6820, amount: 81840000, failed: 96, initial: "awaiting" },
  ],
  rural: [
    { id: "b1", scheme: { en: "MGNREGA wages", hi: "मनरेगा मज़दूरी", bn: "এমজিএনআরইজিএ মজুরি", ta: "MGNREGA ஊதியம்" }, instalment: { en: "Muster rolls · week 20", hi: "मस्टर रोल · सप्ताह 20", bn: "মাস্টার রোল · সপ্তাহ ২০", ta: "வருகைப் பதிவேடு · வாரம் 20" }, beneficiaries: 3915, amount: 9434150, failed: 57, initial: "awaiting" },
    { id: "b2", scheme: { en: "PMAY-G", hi: "पीएमएवाई-जी", bn: "পিএমএওয়াই-জি", ta: "PMAY-G" }, instalment: { en: "Second instalment", hi: "दूसरी किस्त", bn: "দ্বিতীয় কিস্তি", ta: "இரண்டாம் தவணை" }, beneficiaries: 412, amount: 32960000, failed: 3, initial: "sent" },
  ],
  labour: [
    { id: "b1", scheme: { en: "PM Vishwakarma toolkit", hi: "पीएम विश्वकर्मा टूलकिट", bn: "পিএম বিশ্বকর্মা টুলকিট", ta: "பிஎம் விஸ்வகர்மா கருவித்தொகுப்பு" }, instalment: { en: "e-voucher batch 7", hi: "ई-वाउचर बैच 7", bn: "ই-ভাউচার ব্যাচ ৭", ta: "மின்-வவுச்சர் தொகுதி 7" }, beneficiaries: 1180, amount: 17700000, failed: 11, initial: "awaiting" },
  ],
  women: [
    { id: "b1", scheme: { en: "PMMVY", hi: "पीएमएमवीवाई", bn: "পিএমএমভিওয়াই", ta: "PMMVY" }, instalment: { en: "First child · May 2026", hi: "पहला बच्चा · मई 2026", bn: "প্রথম সন্তান · মে ২০২৬", ta: "முதல் குழந்தை · மே 2026" }, beneficiaries: 1734, amount: 8670000, failed: 22, initial: "awaiting" },
  ],
  social: [
    { id: "b1", scheme: { en: "Old-age pension", hi: "वृद्धावस्था पेंशन", bn: "বার্ধক্য পেনশন", ta: "முதியோர் ஓய்வூதியம்" }, instalment: { en: "June 2026", hi: "जून 2026", bn: "জুন ২০২৬", ta: "ஜூன் 2026" }, beneficiaries: 51240, amount: 51240000, failed: 684, initial: "awaiting" },
  ],
};

export const dbtBatches = (deptId: DeptId): DbtBatch[] => DBT[deptId] ?? [];

/* ----------------------------------------------------------- grievances --- */

export interface Grievance {
  id: string;
  citizen: string;
  subject: L;
  openedAt: string;
  channel: "CPGRAMS" | "Saathi" | "Helpline";
}

const GRIEVANCE_SUBJECTS: L[] = [
  { en: "Application pending beyond the time limit", hi: "आवेदन समय सीमा से अधिक लंबित", bn: "আবেদন সময়সীমার বেশি বাকি", ta: "விண்ணப்பம் காலவரம்பைத் தாண்டி நிலுவையில்" },
  { en: "Asked to visit the office in person", hi: "कार्यालय आने को कहा गया", bn: "সশরীরে অফিসে আসতে বলা হয়েছে", ta: "அலுவலகத்துக்கு நேரில் வரச் சொன்னார்கள்" },
  { en: "Wrong details on the issued certificate", hi: "जारी प्रमाणपत्र पर ग़लत विवरण", bn: "প্রদত্ত সনদে ভুল বিবরণ", ta: "வழங்கிய சான்றிதழில் தவறான விவரங்கள்" },
  { en: "Payment deducted but not reflected", hi: "भुगतान कटा पर दर्ज नहीं हुआ", bn: "টাকা কেটেছে কিন্তু দেখাচ্ছে না", ta: "பணம் கழிக்கப்பட்டது, ஆனால் பதிவாகவில்லை" },
  { en: "Benefit not received", hi: "लाभ प्राप्त नहीं हुआ", bn: "সুবিধা পাওয়া যায়নি", ta: "பலன் கிடைக்கவில்லை" },
];

export function grievances(deptId: DeptId): Grievance[] {
  const rand = mulberry32(seedOf(`griev-${deptId}`));
  const n = deptId === "grievance" ? 12 : 5;
  const dept = getDepartment(deptId);
  return Array.from({ length: n }, (_, i) => ({
    id: `CPG-2026-${dept?.code ?? "GEN"}-${String(3100 + Math.floor(rand() * 6800))}`,
    citizen: PAYERS[Math.floor(rand() * PAYERS.length)],
    subject: GRIEVANCE_SUBJECTS[Math.floor(rand() * GRIEVANCE_SUBJECTS.length)],
    openedAt: daysAgo(2 + Math.floor(rand() * 34) + i),
    channel: rand() < 0.5 ? "CPGRAMS" : rand() < 0.7 ? "Saathi" : "Helpline",
  }));
}

/** Applications received per day over the last two weeks, for the overview chart. */
export function intakeSeries(deptId: DeptId, days = 14): number[] {
  const rand = mulberry32(seedOf(`intake-${deptId}`));
  const base = 20 + Math.floor(rand() * 60);
  return Array.from({ length: days }, (_, i) => {
    const weekday = (PROTOTYPE_TODAY.getDay() - (days - 1 - i) + 70) % 7;
    const weekend = weekday === 0 ? 0.35 : weekday === 6 ? 0.6 : 1;
    return Math.round((base + rand() * base * 0.6 + i * 1.2) * weekend);
  });
}
