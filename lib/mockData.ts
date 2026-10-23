import {
  Armchair,
  Baby,
  Briefcase,
  Bus,
  Car,
  Exam,
  FileText,
  Fingerprint,
  FlowerLotus,
  GraduationCap,
  Heart,
  Heartbeat,
  House,
  MapTrifold,
  Megaphone,
  Plant,
  Receipt,
  Stethoscope,
  Storefront,
  Wallet,
  type Icon,
} from "@phosphor-icons/react";

import type { TileTone } from "@/components/system/ui/IconTile";

import type { CoreLocale, Locale } from "@/lib/i18n/config";
import { lookupData } from "@/lib/i18n/dataDictionary";

/**
 * A string authored in the four core languages, optionally with more. Other
 * languages come from the data dictionary, keyed by the English source.
 */
export type L = Record<CoreLocale, string> & Partial<Record<Locale, string>>;

export function loc(value: L, locale: Locale): string {
  return value[locale] ?? lookupData(locale, value.en) ?? value.en;
}

/* ---------------------------------------------------------------- depts --- */

const DEPT = {
  agri: { en: "Ministry of Agriculture", hi: "कृषि मंत्रालय", bn: "কৃষি মন্ত্রণালয়", ta: "வேளாண் அமைச்சகம்" },
  health: { en: "Ministry of Health", hi: "स्वास्थ्य मंत्रालय", bn: "স্বাস্থ্য মন্ত্রণালয়", ta: "சுகாதார அமைச்சகம்" },
  housing: { en: "Ministry of Housing", hi: "आवास मंत्रालय", bn: "আবাসন মন্ত্রণালয়", ta: "வீட்டுவசதி அமைச்சகம்" },
  finance: { en: "Ministry of Finance", hi: "वित्त मंत्रालय", bn: "অর্থ মন্ত্রণালয়", ta: "நிதி அமைச்சகம்" },
  women: { en: "Ministry of Women & Child", hi: "महिला एवं बाल मंत्रालय", bn: "নারী ও শিশু মন্ত্রণালয়", ta: "மகளிர் & குழந்தை அமைச்சகம்" },
  education: { en: "Ministry of Education", hi: "शिक्षा मंत्रालय", bn: "শিক্ষা মন্ত্রণালয়", ta: "கல்வி அமைச்சகம்" },
  labour: { en: "Ministry of Labour", hi: "श्रम मंत्रालय", bn: "শ্রম মন্ত্রণালয়", ta: "தொழிலாளர் அமைச்சகம்" },
  msme: { en: "Ministry of MSME", hi: "एमएसएमई मंत्रालय", bn: "এমএসএমই মন্ত্রণালয়", ta: "எம்.எஸ்.எம்.இ அமைச்சகம்" },
  petroleum: { en: "Ministry of Petroleum", hi: "पेट्रोलियम मंत्रालय", bn: "পেট্রোলিয়াম মন্ত্রণালয়", ta: "பெட்ரோலியம் அமைச்சகம்" },
} as const;

const NOTE = {
  perYear: { en: "per year", hi: "प्रति वर्ष", bn: "প্রতি বছর", ta: "ஆண்டுக்கு" },
  perMonth: { en: "per month", hi: "प्रति माह", bn: "প্রতি মাস", ta: "மாதம்" },
  oneTime: { en: "one-time", hi: "एकमुश्त", bn: "এককালীন", ta: "ஒருமுறை" },
  cover: { en: "cover", hi: "कवर", bn: "কভার", ta: "கவரேஜ்" },
  upToLoan: { en: "up to · loan", hi: "तक · ऋण", bn: "পর্যন্ত · ঋণ", ta: "வரை · கடன்" },
  subsidy: { en: "subsidy", hi: "सब्सिडी", bn: "ভর্তুকি", ta: "மானியம்" },
  toolkit: { en: "toolkit", hi: "टूलकिट", bn: "টুলকিট", ta: "கருவித்தொகுப்பு" },
} as const;

/* -------------------------------------------------------- life moments --- */

export interface LifeMoment {
  id: string;
  name: L;
  icon: Icon;
  tone: TileTone;
  services: string[];
  schemes: string[];
}

export const LIFE_MOMENTS: LifeMoment[] = [
  { id: "newBaby", icon: Baby, tone: "saffron", name: { en: "A new baby", hi: "नया बच्चा", bn: "নতুন শিশু", ta: "புதிய குழந்தை" }, services: ["certificates", "health", "identity"], schemes: ["jsy", "sukanya", "pmmvy"] },
  { id: "firstJob", icon: Briefcase, tone: "navy", name: { en: "First job", hi: "पहली नौकरी", bn: "প্রথম চাকরি", ta: "முதல் வேலை" }, services: ["identity", "exams", "money", "taxes"], schemes: ["apy", "pmsby"] },
  { id: "marriage", icon: Heart, tone: "violet", name: { en: "Marriage", hi: "विवाह", bn: "বিবাহ", ta: "திருமணம்" }, services: ["certificates", "identity"], schemes: [] },
  { id: "buyingHome", icon: House, tone: "teal", name: { en: "Buying a home", hi: "घर खरीदना", bn: "বাড়ি কেনা", ta: "வீடு வாங்குதல்" }, services: ["land", "money", "taxes"], schemes: ["pmay"] },
  { id: "education", icon: GraduationCap, tone: "violet", name: { en: "Education", hi: "शिक्षा", bn: "শিক্ষা", ta: "கல்வி" }, services: ["education", "exams", "certificates"], schemes: ["nsp", "sukanya"] },
  { id: "health", icon: Heartbeat, tone: "green", name: { en: "Health & illness", hi: "स्वास्थ्य व बीमारी", bn: "স্বাস্থ্য ও অসুস্থতা", ta: "உடல்நலம்" }, services: ["health", "money"], schemes: ["pmjay", "pmsby"] },
  { id: "retirement", icon: Armchair, tone: "saffron", name: { en: "Retirement", hi: "सेवानिवृत्ति", bn: "অবসর", ta: "ஓய்வு" }, services: ["money", "identity"], schemes: ["apy", "ignoaps"] },
  { id: "business", icon: Storefront, tone: "navy", name: { en: "Starting a business", hi: "व्यवसाय शुरू करना", bn: "ব্যবসা শুরু", ta: "வணிகம் தொடங்குதல்" }, services: ["money", "taxes", "employment"], schemes: ["mudra", "vishwakarma"] },
  { id: "farming", icon: Plant, tone: "green", name: { en: "Farming", hi: "खेती", bn: "কৃষিকাজ", ta: "விவசாயம்" }, services: ["money", "land"], schemes: ["pmkisan"] },
  { id: "vehicle", icon: Car, tone: "teal", name: { en: "Buying a vehicle", hi: "वाहन खरीदना", bn: "যানবাহন কেনা", ta: "வாகனம் வாங்குதல்" }, services: ["transport", "taxes"], schemes: [] },
  { id: "bereavement", icon: FlowerLotus, tone: "neutral", name: { en: "Loss of a loved one", hi: "किसी अपने का निधन", bn: "প্রিয়জনের মৃত্যু", ta: "உறவினர் இழப்பு" }, services: ["certificates", "money"], schemes: [] },
];

/* -------------------------------------------------------------- services --- */

export interface ServiceTask {
  id: string;
  name: L;
}

export interface Service {
  id: string;
  name: L;
  icon: Icon;
  tone: TileTone;
  blurb: L;
  tasks: ServiceTask[];
}

export const SERVICES: Service[] = [
  {
    id: "identity", icon: Fingerprint, tone: "navy",
    name: { en: "Identity & Aadhaar", hi: "पहचान व आधार", bn: "পরিচয় ও আধার", ta: "அடையாளம் & ஆதார்" },
    blurb: { en: "Manage your Aadhaar and identity records", hi: "अपना आधार व पहचान विवरण प्रबंधित करें", bn: "আপনার আধার ও পরিচয় তথ্য পরিচালনা করুন", ta: "உங்கள் ஆதார் & அடையாள விவரங்களை நிர்வகிக்கவும்" },
    tasks: [
      { id: "identity_addr", name: { en: "Update Aadhaar address", hi: "आधार पता अपडेट करें", bn: "আধার ঠিকানা আপডেট করুন", ta: "ஆதார் முகவரியைப் புதுப்பிக்கவும்" } },
      { id: "identity_mobile", name: { en: "Link mobile number", hi: "मोबाइल नंबर जोड़ें", bn: "মোবাইল নম্বর লিঙ্ক করুন", ta: "மொபைல் எண்ணை இணைக்கவும்" } },
      { id: "identity_eaadhaar", name: { en: "Download e-Aadhaar", hi: "ई-आधार डाउनलोड करें", bn: "ই-আধার ডাউনলোড করুন", ta: "மின்-ஆதார் பதிவிறக்கவும்" } },
    ],
  },
  {
    id: "certificates", icon: FileText, tone: "violet",
    name: { en: "Certificates", hi: "प्रमाणपत्र", bn: "সনদপত্র", ta: "சான்றிதழ்கள்" },
    blurb: { en: "Apply for and download official certificates", hi: "आधिकारिक प्रमाणपत्रों के लिए आवेदन व डाउनलोड करें", bn: "সরকারি সনদের জন্য আবেদন ও ডাউনলোড করুন", ta: "அரசு சான்றிதழ்களுக்கு விண்ணப்பித்து பதிவிறக்கவும்" },
    tasks: [
      { id: "cert_birth", name: { en: "Birth certificate", hi: "जन्म प्रमाणपत्र", bn: "জন্ম সনদ", ta: "பிறப்புச் சான்றிதழ்" } },
      { id: "cert_income", name: { en: "Income certificate", hi: "आय प्रमाणपत्र", bn: "আয়ের সনদ", ta: "வருமானச் சான்றிதழ்" } },
      { id: "cert_caste", name: { en: "Caste certificate", hi: "जाति प्रमाणपत्र", bn: "জাতি সনদ", ta: "சாதிச் சான்றிதழ்" } },
    ],
  },
  {
    id: "health", icon: Stethoscope, tone: "green",
    name: { en: "Health", hi: "स्वास्थ्य", bn: "স্বাস্থ্য", ta: "உடல்நலம்" },
    blurb: { en: "Health cards, hospitals and check-ups", hi: "स्वास्थ्य कार्ड, अस्पताल व जाँच", bn: "স্বাস্থ্য কার্ড, হাসপাতাল ও পরীক্ষা", ta: "சுகாதார அட்டை, மருத்துவமனை & பரிசோதனை" },
    tasks: [
      { id: "health_ayushman", name: { en: "Apply Ayushman card", hi: "आयुष्मान कार्ड के लिए आवेदन करें", bn: "আয়ুষ্মান কার্ডের জন্য আবেদন করুন", ta: "ஆயுஷ்மான் அட்டைக்கு விண்ணப்பிக்கவும்" } },
      { id: "health_hospital", name: { en: "Register at a hospital", hi: "अस्पताल में पंजीकरण करें", bn: "হাসপাতালে নিবন্ধন করুন", ta: "மருத்துவமனையில் பதிவு செய்யவும்" } },
      { id: "health_checkup", name: { en: "Book a health check-up", hi: "स्वास्थ्य जाँच बुक करें", bn: "স্বাস্থ্য পরীক্ষা বুক করুন", ta: "உடல்நலப் பரிசோதனையை முன்பதிவு செய்யவும்" } },
    ],
  },
  {
    id: "education", icon: GraduationCap, tone: "violet",
    name: { en: "Education", hi: "शिक्षा", bn: "শিক্ষা", ta: "கல்வி" },
    blurb: { en: "Scholarships, admissions and verification", hi: "छात्रवृत्ति, प्रवेश व सत्यापन", bn: "বৃত্তি, ভর্তি ও যাচাই", ta: "உதவித்தொகை, சேர்க்கை & சரிபார்ப்பு" },
    tasks: [
      { id: "edu_scholarship", name: { en: "Apply for scholarship", hi: "छात्रवृत्ति के लिए आवेदन करें", bn: "বৃত্তির জন্য আবেদন করুন", ta: "உதவித்தொகைக்கு விண்ணப்பிக்கவும்" } },
      { id: "edu_admission", name: { en: "School admission", hi: "स्कूल में प्रवेश", bn: "স্কুলে ভর্তি", ta: "பள்ளி சேர்க்கை" } },
      { id: "edu_verify", name: { en: "Verify a certificate", hi: "प्रमाणपत्र सत्यापित करें", bn: "সনদ যাচাই করুন", ta: "சான்றிதழைச் சரிபார்க்கவும்" } },
    ],
  },
  {
    id: "money", icon: Wallet, tone: "teal",
    name: { en: "Money & pensions", hi: "धन व पेंशन", bn: "অর্থ ও পেনশন", ta: "பணம் & ஓய்வூதியம்" },
    blurb: { en: "Pensions, savings and bank linking", hi: "पेंशन, बचत व बैंक लिंकिंग", bn: "পেনশন, সঞ্চয় ও ব্যাঙ্ক সংযোগ", ta: "ஓய்வூதியம், சேமிப்பு & வங்கி இணைப்பு" },
    tasks: [
      { id: "money_pension", name: { en: "Open pension account", hi: "पेंशन खाता खोलें", bn: "পেনশন অ্যাকাউন্ট খুলুন", ta: "ஓய்வூதியக் கணக்கைத் திறக்கவும்" } },
      { id: "money_oldage", name: { en: "Apply old-age pension", hi: "वृद्धावस्था पेंशन के लिए आवेदन करें", bn: "বার্ধক্য পেনশনের জন্য আবেদন করুন", ta: "முதியோர் ஓய்வூதியத்திற்கு விண்ணப்பிக்கவும்" } },
      { id: "money_bank", name: { en: "Link bank account", hi: "बैंक खाता जोड़ें", bn: "ব্যাঙ্ক অ্যাকাউন্ট লিঙ্ক করুন", ta: "வங்கிக் கணக்கை இணைக்கவும்" } },
    ],
  },
  {
    id: "land", icon: MapTrifold, tone: "saffron",
    name: { en: "Land & property", hi: "भूमि व संपत्ति", bn: "জমি ও সম্পত্তি", ta: "நிலம் & சொத்து" },
    blurb: { en: "Land records, tax and mutation", hi: "भूमि अभिलेख, कर व नामांतरण", bn: "জমির রেকর্ড, কর ও মিউটেশন", ta: "நில பதிவுகள், வரி & பெயர் மாற்றம்" },
    tasks: [
      { id: "land_record", name: { en: "Get land record copy", hi: "भूमि अभिलेख प्रति प्राप्त करें", bn: "জমির রেকর্ডের কপি নিন", ta: "நில பதிவு நகலைப் பெறவும்" } },
      { id: "land_tax", name: { en: "Pay property tax", hi: "संपत्ति कर भरें", bn: "সম্পত্তি কর পরিশোধ করুন", ta: "சொத்து வரி செலுத்தவும்" } },
      { id: "land_mutation", name: { en: "Apply for mutation", hi: "नामांतरण के लिए आवेदन करें", bn: "মিউটেশনের জন্য আবেদন করুন", ta: "பெயர் மாற்றத்திற்கு விண்ணப்பிக்கவும்" } },
    ],
  },
  {
    id: "transport", icon: Bus, tone: "navy",
    name: { en: "Transport & licence", hi: "परिवहन व लाइसेंस", bn: "পরিবহন ও লাইসেন্স", ta: "போக்குவரத்து & உரிமம்" },
    blurb: { en: "Licences, challans and vehicles", hi: "लाइसेंस, चालान व वाहन", bn: "লাইসেন্স, চালান ও যানবাহন", ta: "உரிமம், அபராதம் & வாகனங்கள்" },
    tasks: [
      { id: "transport_dl", name: { en: "Renew driving licence", hi: "ड्राइविंग लाइसेंस नवीनीकरण करें", bn: "ড্রাইভিং লাইসেন্স নবায়ন করুন", ta: "ஓட்டுநர் உரிமத்தைப் புதுப்பிக்கவும்" } },
      { id: "transport_challan", name: { en: "Pay traffic challan", hi: "ट्रैफ़िक चालान भरें", bn: "ট্রাফিক চালান পরিশোধ করুন", ta: "போக்குவரத்து அபராதம் செலுத்தவும்" } },
      { id: "transport_vehicle", name: { en: "New vehicle registration", hi: "नया वाहन पंजीकरण", bn: "নতুন যানবাহন নিবন্ধন", ta: "புதிய வாகனப் பதிவு" } },
      { id: "transport_ll", name: { en: "Apply for learner's licence", hi: "लर्नर लाइसेंस के लिए आवेदन करें", bn: "লার্নার লাইসেন্সের জন্য আবেদন করুন", ta: "பழகுநர் உரிமத்துக்கு விண்ணப்பிக்கவும்" } },
      { id: "transport_rc_transfer", name: { en: "Transfer vehicle ownership", hi: "वाहन स्वामित्व हस्तांतरण", bn: "যানবাহনের মালিকানা হস্তান্তর", ta: "வாகன உரிமை மாற்றம்" } },
      { id: "transport_rc_duplicate", name: { en: "Duplicate RC", hi: "डुप्लीकेट आरसी", bn: "ডুপ্লিকেট আরসি", ta: "நகல் ஆர்சி" } },
      { id: "transport_puc", name: { en: "Download PUC certificate", hi: "पीयूसी प्रमाणपत्र डाउनलोड करें", bn: "পিইউসি সনদ ডাউনলোড করুন", ta: "பியூசி சான்றிதழைப் பதிவிறக்கவும்" } },
      { id: "transport_hsrp", name: { en: "Book high-security number plate", hi: "हाई-सिक्योरिटी नंबर प्लेट बुक करें", bn: "হাই-সিকিউরিটি নম্বর প্লেট বুক করুন", ta: "உயர் பாதுகாப்பு எண் தகட்டை முன்பதிவு செய்யவும்" } },
    ],
  },
  {
    id: "exams", icon: Exam, tone: "violet",
    name: { en: "Exams & recruitment", hi: "परीक्षा व भर्ती", bn: "পরীক্ষা ও নিয়োগ", ta: "தேர்வுகள் & ஆட்சேர்ப்பு" },
    blurb: { en: "Exam forms, admit cards and results", hi: "परीक्षा फ़ॉर्म, प्रवेश पत्र व परिणाम", bn: "পরীক্ষার ফর্ম, অ্যাডমিট কার্ড ও ফলাফল", ta: "தேர்வுப் படிவங்கள், அனுமதிச் சீட்டு & முடிவுகள்" },
    tasks: [
      { id: "exam_nta", name: { en: "Entrance exam form (JEE · NEET · CUET)", hi: "प्रवेश परीक्षा फ़ॉर्म (JEE · NEET · CUET)", bn: "প্রবেশিকা পরীক্ষার ফর্ম (JEE · NEET · CUET)", ta: "நுழைவுத் தேர்வுப் படிவம் (JEE · NEET · CUET)" } },
      { id: "exam_board", name: { en: "Board exam form (private / supplementary)", hi: "बोर्ड परीक्षा फ़ॉर्म (प्राइवेट / पूरक)", bn: "বোর্ড পরীক্ষার ফর্ম (প্রাইভেট / সাপ্লিমেন্টারি)", ta: "வாரியத் தேர்வுப் படிவம் (தனித்தேர்வு / துணைத்தேர்வு)" } },
      { id: "exam_recruit", name: { en: "Government job exam form (SSC)", hi: "सरकारी नौकरी परीक्षा फ़ॉर्म (SSC)", bn: "সরকারি চাকরির পরীক্ষার ফর্ম (SSC)", ta: "அரசு வேலைத் தேர்வுப் படிவம் (SSC)" } },
      { id: "exam_admit", name: { en: "Download admit card", hi: "प्रवेश पत्र डाउनलोड करें", bn: "অ্যাডমিট কার্ড ডাউনলোড করুন", ta: "அனுமதிச் சீட்டைப் பதிவிறக்கவும்" } },
      { id: "exam_result", name: { en: "Get result & marksheet", hi: "परिणाम व अंकपत्र पाएँ", bn: "ফলাফল ও মার্কশিট নিন", ta: "முடிவு & மதிப்பெண் சான்றிதழ் பெறவும்" } },
      { id: "exam_reval", name: { en: "Apply for re-evaluation", hi: "पुनर्मूल्यांकन के लिए आवेदन करें", bn: "পুনর্মূল্যায়নের জন্য আবেদন করুন", ta: "மறுமதிப்பீட்டுக்கு விண்ணப்பிக்கவும்" } },
    ],
  },
  {
    id: "employment", icon: Briefcase, tone: "saffron",
    name: { en: "Jobs & labour", hi: "नौकरी व श्रम", bn: "চাকরি ও শ্রম", ta: "வேலை & தொழிலாளர்" },
    blurb: { en: "Jobs, skilling and labour welfare", hi: "नौकरी, कौशल व श्रमिक कल्याण", bn: "চাকরি, দক্ষতা ও শ্রমিক কল্যাণ", ta: "வேலை, திறன் & தொழிலாளர் நலன்" },
    tasks: [
      { id: "emp_jobcard", name: { en: "Apply for job card", hi: "जॉब कार्ड के लिए आवेदन करें", bn: "জব কার্ডের জন্য আবেদন করুন", ta: "வேலை அட்டைக்கு விண்ணப்பிக்கவும்" } },
      { id: "emp_skill", name: { en: "Register for skill training", hi: "कौशल प्रशिक्षण के लिए पंजीकरण करें", bn: "দক্ষতা প্রশিক্ষণের জন্য নিবন্ধন করুন", ta: "திறன் பயிற்சிக்குப் பதிவு செய்யவும்" } },
      { id: "emp_work", name: { en: "Apply for work", hi: "काम के लिए आवेदन करें", bn: "কাজের জন্য আবেদন করুন", ta: "வேலைக்கு விண்ணப்பிக்கவும்" } },
    ],
  },
  {
    id: "taxes", icon: Receipt, tone: "neutral",
    name: { en: "Taxes & bills", hi: "कर व बिल", bn: "কর ও বিল", ta: "வரி & கட்டணம்" },
    blurb: { en: "Pay taxes and utility bills", hi: "कर व उपयोगिता बिल भरें", bn: "কর ও ইউটিলিটি বিল পরিশোধ করুন", ta: "வரி & பயன்பாட்டுக் கட்டணங்களைச் செலுத்தவும்" },
    tasks: [
      { id: "taxes_property", name: { en: "Pay property tax", hi: "संपत्ति कर भरें", bn: "সম্পত্তি কর পরিশোধ করুন", ta: "சொத்து வரி செலுத்தவும்" } },
      { id: "taxes_income", name: { en: "File income tax return", hi: "आयकर रिटर्न दाखिल करें", bn: "আয়কর রিটার্ন দাখিল করুন", ta: "வருமான வரிக் கணக்கைத் தாக்கல் செய்யவும்" } },
      { id: "taxes_bill", name: { en: "Pay a utility bill", hi: "उपयोगिता बिल भरें", bn: "ইউটিলিটি বিল পরিশোধ করুন", ta: "பயன்பாட்டுக் கட்டணம் செலுத்தவும்" } },
    ],
  },
  {
    id: "grievance", icon: Megaphone, tone: "neutral",
    name: { en: "Grievances", hi: "शिकायतें", bn: "অভিযোগ", ta: "முறையீடுகள்" },
    blurb: { en: "Raise and track public complaints", hi: "सार्वजनिक शिकायतें दर्ज व ट्रैक करें", bn: "জনসাধারণের অভিযোগ জানান ও ট্র্যাক করুন", ta: "பொது முறையீடுகளைப் பதிவு செய்து கண்காணிக்கவும்" },
    tasks: [
      { id: "griev_file", name: { en: "File a complaint", hi: "शिकायत दर्ज करें", bn: "অভিযোগ দাখিল করুন", ta: "புகார் பதிவு செய்யவும்" } },
      { id: "griev_track", name: { en: "Track a complaint", hi: "शिकायत ट्रैक करें", bn: "অভিযোগ ট্র্যাক করুন", ta: "புகாரைக் கண்காணிக்கவும்" } },
      { id: "griev_feedback", name: { en: "Submit public feedback", hi: "सार्वजनिक प्रतिक्रिया दें", bn: "জনমত জমা দিন", ta: "பொது கருத்தைச் சமர்ப்பிக்கவும்" } },
    ],
  },
];

/* --------------------------------------------------------------- schemes --- */

export interface Scheme {
  id: string;
  name: L;
  desc: L;
  category: string;
  benefit: number | null;
  benefitNote: L;
  eligibility: L[];
  department: L;
  lifeMoments: string[];
  /** life-context tags (from onboarding) that make this "for you". */
  forContext: string[];
}

export const SCHEMES: Scheme[] = [
  {
    id: "pmkisan",
    name: { en: "PM-KISAN", hi: "पीएम-किसान", bn: "পিএম-কিসান", ta: "பிஎம்-கிசான்" },
    desc: { en: "Income support for farmers", hi: "किसानों के लिए आय सहायता", bn: "কৃষকদের জন্য আয় সহায়তা", ta: "விவசாயிகளுக்கு வருமான உதவி" },
    category: "money", benefit: 6000, benefitNote: NOTE.perYear, department: DEPT.agri,
    eligibility: [
      { en: "Land-holding farmer", hi: "भूमिधारक किसान", bn: "জমির মালিক কৃষক", ta: "நில உரிமை விவசாயி" },
      { en: "Aadhaar-linked", hi: "आधार से जुड़ा", bn: "আধার-সংযুক্ত", ta: "ஆதார் இணைக்கப்பட்டது" },
    ],
    lifeMoments: ["farming"], forContext: ["farmer"],
  },
  {
    id: "pmjay",
    name: { en: "Ayushman Bharat", hi: "आयुष्मान भारत", bn: "আয়ুষ্মান ভারত", ta: "ஆயுஷ்மான் பாரத்" },
    desc: { en: "Free hospital cover", hi: "मुफ़्त अस्पताल कवर", bn: "বিনামূল্যে হাসপাতাল কভার", ta: "இலவச மருத்துவமனை கவரேஜ்" },
    category: "health", benefit: 500000, benefitNote: NOTE.cover, department: DEPT.health,
    eligibility: [
      { en: "Low-income family", hi: "कम आय वाला परिवार", bn: "নিম্ন-আয়ের পরিবার", ta: "குறைந்த வருமான குடும்பம்" },
      { en: "SECC listed", hi: "SECC सूचीबद्ध", bn: "SECC তালিকাভুক্ত", ta: "SECC பட்டியல்" },
    ],
    lifeMoments: ["health"], forContext: [],
  },
  {
    id: "pmay",
    name: { en: "PM Awas Yojana", hi: "पीएम आवास योजना", bn: "পিএম আবাস যোজনা", ta: "பிஎம் ஆவாஸ் யோஜனா" },
    desc: { en: "Help to build or buy a home", hi: "घर बनाने या खरीदने में मदद", bn: "বাড়ি তৈরি বা কেনার সাহায্য", ta: "வீடு கட்ட/வாங்க உதவி" },
    category: "land", benefit: 267000, benefitNote: NOTE.subsidy, department: DEPT.housing,
    eligibility: [
      { en: "No pucca house", hi: "कोई पक्का घर नहीं", bn: "পাকা বাড়ি নেই", ta: "நிரந்தர வீடு இல்லை" },
      { en: "Within income limit", hi: "आय सीमा के भीतर", bn: "আয় সীমার মধ্যে", ta: "வருமான வரம்பில்" },
    ],
    lifeMoments: ["buyingHome"], forContext: ["home"],
  },
  {
    id: "jsy",
    name: { en: "Janani Suraksha Yojana", hi: "जननी सुरक्षा योजना", bn: "জননী সুরক্ষা যোজনা", ta: "ஜனனி சுரக்ஷா யோஜனா" },
    desc: { en: "Cash help for safe delivery", hi: "सुरक्षित प्रसव के लिए नकद मदद", bn: "নিরাপদ প্রসবের জন্য নগদ সাহায্য", ta: "பாதுகாப்பான பிரசவத்திற்கு பண உதவி" },
    category: "health", benefit: 1400, benefitNote: NOTE.oneTime, department: DEPT.health,
    eligibility: [
      { en: "Pregnant woman", hi: "गर्भवती महिला", bn: "গর্ভবতী মহিলা", ta: "கர்ப்பிணி பெண்" },
      { en: "Institutional birth", hi: "संस्थागत प्रसव", bn: "প্রাতিষ্ঠানিক প্রসব", ta: "மருத்துவமனை பிரசவம்" },
    ],
    lifeMoments: ["newBaby"], forContext: ["newBaby"],
  },
  {
    id: "sukanya",
    name: { en: "Sukanya Samriddhi", hi: "सुकन्या समृद्धि", bn: "সুকন্যা সমৃদ্ধি", ta: "சுகன்யா சம்ருத்தி" },
    desc: { en: "High-interest savings for a girl child", hi: "बेटी के लिए उच्च-ब्याज बचत", bn: "কন্যাসন্তানের জন্য উচ্চ-সুদের সঞ্চয়", ta: "பெண் குழந்தைக்கு உயர்-வட்டி சேமிப்பு" },
    category: "money", benefit: null, benefitNote: NOTE.perYear, department: DEPT.finance,
    eligibility: [
      { en: "Girl under 10", hi: "10 साल से कम की बालिका", bn: "১০ বছরের কম মেয়ে", ta: "10 வயதுக்குட்பட்ட பெண்" },
      { en: "Guardian account", hi: "अभिभावक खाता", bn: "অভিভাবক অ্যাকাউন্ট", ta: "பாதுகாவலர் கணக்கு" },
    ],
    lifeMoments: ["newBaby", "education"], forContext: ["newBaby"],
  },
  {
    id: "pmmvy",
    name: { en: "Matru Vandana", hi: "मातृ वंदना", bn: "মাতৃ বন্দনা", ta: "மாத்ரு வந்தனா" },
    desc: { en: "Maternity benefit for first child", hi: "पहले बच्चे पर मातृत्व लाभ", bn: "প্রথম সন্তানে মাতৃত্ব সুবিধা", ta: "முதல் குழந்தைக்கு மகப்பேறு உதவி" },
    category: "health", benefit: 5000, benefitNote: NOTE.oneTime, department: DEPT.women,
    eligibility: [
      { en: "Pregnant / nursing", hi: "गर्भवती / स्तनपान", bn: "গর্ভবতী / স্তন্যদাত্রী", ta: "கர்ப்பிணி / பாலூட்டும்" },
      { en: "First living child", hi: "पहला जीवित बच्चा", bn: "প্রথম জীবিত সন্তান", ta: "முதல் உயிருள்ள குழந்தை" },
    ],
    lifeMoments: ["newBaby"], forContext: ["newBaby"],
  },
  {
    id: "nsp",
    name: { en: "National Scholarship", hi: "राष्ट्रीय छात्रवृत्ति", bn: "জাতীয় বৃত্তি", ta: "தேசிய உதவித்தொகை" },
    desc: { en: "Scholarships for students", hi: "विद्यार्थियों के लिए छात्रवृत्ति", bn: "শিক্ষার্থীদের জন্য বৃত্তি", ta: "மாணவர்களுக்கு உதவித்தொகை" },
    category: "education", benefit: 20000, benefitNote: NOTE.perYear, department: DEPT.education,
    eligibility: [
      { en: "Enrolled student", hi: "नामांकित विद्यार्थी", bn: "নথিভুক্ত শিক্ষার্থী", ta: "சேர்க்கப்பட்ட மாணவர்" },
      { en: "Within income limit", hi: "आय सीमा के भीतर", bn: "আয় সীমার মধ্যে", ta: "வருமான வரம்பில்" },
    ],
    lifeMoments: ["education"], forContext: ["student"],
  },
  {
    id: "apy",
    name: { en: "Atal Pension Yojana", hi: "अटल पेंशन योजना", bn: "অটল পেনশন যোজনা", ta: "அடல் ஓய்வூதிய யோஜனா" },
    desc: { en: "Guaranteed pension after 60", hi: "60 के बाद गारंटीड पेंशन", bn: "৬০-এর পরে নিশ্চিত পেনশন", ta: "60-க்குப் பின் உறுதி ஓய்வூதியம்" },
    category: "money", benefit: 5000, benefitNote: NOTE.perMonth, department: DEPT.finance,
    eligibility: [
      { en: "Age 18–40", hi: "उम्र 18–40", bn: "বয়স ১৮–৪০", ta: "வயது 18–40" },
      { en: "Savings account", hi: "बचत खाता", bn: "সঞ্চয় অ্যাকাউন্ট", ta: "சேமிப்புக் கணக்கு" },
    ],
    lifeMoments: ["retirement", "firstJob"], forContext: [],
  },
  {
    id: "pmsby",
    name: { en: "Suraksha Bima", hi: "सुरक्षा बीमा", bn: "সুরক্ষা বিমা", ta: "சுரக்ஷா பீமா" },
    desc: { en: "Accident insurance", hi: "दुर्घटना बीमा", bn: "দুর্ঘটনা বিমা", ta: "விபத்து காப்பீடு" },
    category: "money", benefit: 200000, benefitNote: NOTE.cover, department: DEPT.finance,
    eligibility: [
      { en: "Age 18–70", hi: "उम्र 18–70", bn: "বয়স ১৮–৭০", ta: "வயது 18–70" },
      { en: "Bank account", hi: "बैंक खाता", bn: "ব্যাঙ্ক অ্যাকাউন্ট", ta: "வங்கிக் கணக்கு" },
    ],
    lifeMoments: ["health", "firstJob"], forContext: [],
  },
  {
    id: "ignoaps",
    name: { en: "Old Age Pension", hi: "वृद्धावस्था पेंशन", bn: "বার্ধক্য পেনশন", ta: "முதியோர் ஓய்வூதியம்" },
    desc: { en: "Monthly pension for seniors", hi: "वरिष्ठों के लिए मासिक पेंशन", bn: "প্রবীণদের জন্য মাসিক পেনশন", ta: "மூத்தோருக்கு மாதாந்திர ஓய்வூதியம்" },
    category: "money", benefit: 1000, benefitNote: NOTE.perMonth, department: DEPT.finance,
    eligibility: [
      { en: "Age 60+", hi: "उम्र 60+", bn: "বয়স ৬০+", ta: "வயது 60+" },
      { en: "BPL household", hi: "बीपीएल परिवार", bn: "বিপিএল পরিবার", ta: "வறுமைக் கோட்டின் கீழ்" },
    ],
    lifeMoments: ["retirement"], forContext: ["senior"],
  },
  {
    id: "mudra",
    name: { en: "PM Mudra Loan", hi: "पीएम मुद्रा ऋण", bn: "পিএম মুদ্রা ঋণ", ta: "பிஎம் முத்ரா கடன்" },
    desc: { en: "Collateral-free business loan", hi: "बिना गारंटी व्यवसाय ऋण", bn: "জামানতবিহীন ব্যবসায়িক ঋণ", ta: "பிணையமற்ற வணிகக் கடன்" },
    category: "employment", benefit: 1000000, benefitNote: NOTE.upToLoan, department: DEPT.msme,
    eligibility: [
      { en: "Small business", hi: "छोटा व्यवसाय", bn: "ছোট ব্যবসা", ta: "சிறு வணிகம்" },
      { en: "Non-corporate", hi: "ग़ैर-कॉर्पोरेट", bn: "নন-কর্পোরেট", ta: "கார்ப்பரேட் அல்லாத" },
    ],
    lifeMoments: ["business"], forContext: ["business"],
  },
  {
    id: "vishwakarma",
    name: { en: "PM Vishwakarma", hi: "पीएम विश्वकर्मा", bn: "পিএম বিশ্বকর্মা", ta: "பிஎம் விஷ்வகர்மா" },
    desc: { en: "Support for artisans & craftspeople", hi: "कारीगरों व शिल्पकारों के लिए सहायता", bn: "কারিগর ও শিল্পীদের সহায়তা", ta: "கைவினைஞர்களுக்கு ஆதரவு" },
    category: "employment", benefit: 15000, benefitNote: NOTE.toolkit, department: DEPT.msme,
    eligibility: [
      { en: "Traditional artisan", hi: "पारंपरिक कारीगर", bn: "ঐতিহ্যবাহী কারিগর", ta: "பாரம்பரிய கைவினைஞர்" },
      { en: "Aadhaar-linked", hi: "आधार से जुड़ा", bn: "আধার-সংযুক্ত", ta: "ஆதார் இணைக்கப்பட்டது" },
    ],
    lifeMoments: ["business"], forContext: ["business"],
  },
];

/* ----------------------------------------------------------- applications --- */

export type AppStatus =
  | "submitted"
  | "inProgress"
  | "approved"
  | "ready"
  | "pending"
  | "actionNeeded"
  | "rejected";

export interface TrackableApplication {
  id: string;
  service: L;
  ref: string;
  date: string; // ISO
  status: AppStatus;
}

export interface Application extends TrackableApplication {
  department: L;
}

export const APPLICATIONS: Application[] = [
  {
    id: "app_birth",
    service: { en: "Birth Certificate", hi: "जन्म प्रमाणपत्र", bn: "জন্ম সনদ", ta: "பிறப்புச் சான்றிதழ்" },
    status: "inProgress",
    ref: "BC-2026-UP-07734",
    date: "2026-05-18",
    department: { en: "Nagar Nigam, Kanpur", hi: "नगर निगम, कानपुर", bn: "নগর নিগম, কানপুর", ta: "நகர நிகம், கான்பூர்" },
  },
  {
    id: "app_ayushman",
    service: { en: "Ayushman Health Card", hi: "आयुष्मान स्वास्थ्य कार्ड", bn: "আয়ুষ্মান স্বাস্থ্য কার্ড", ta: "ஆயுஷ்மான் சுகாதார அட்டை" },
    status: "ready",
    ref: "AB-2026-9921-3382",
    date: "2026-05-10",
    department: DEPT.health,
  },
  {
    id: "app_pmkisan",
    service: { en: "PM-KISAN Registration", hi: "पीएम-किसान पंजीकरण", bn: "পিএম-কিসান নিবন্ধন", ta: "பிஎம்-கிசான் பதிவு" },
    status: "submitted",
    ref: "PMK-2026-UP-55120",
    date: "2026-05-22",
    department: DEPT.agri,
  },
  {
    id: "app_income",
    service: { en: "Income Certificate", hi: "आय प्रमाणपत्र", bn: "আয়ের সনদ", ta: "வருமானச் சான்றிதழ்" },
    status: "approved",
    ref: "INC-2026-UP-44210",
    date: "2026-04-28",
    department: { en: "Revenue Dept., UP", hi: "राजस्व विभाग, उ.प्र.", bn: "রাজস্ব দপ্তর, ইউপি", ta: "வருவாய்த் துறை, யூபி" },
  },
];

/* ---------------------------------------------------------------- family --- */

export interface FamilyMember {
  id: string;
  name: L;
  relation: L;
}

export const FAMILY: FamilyMember[] = [
  { id: "m_sunita", name: { en: "Sunita Devi", hi: "सुनीता देवी", bn: "সুনীতা দেবী", ta: "சுனிதா தேவி" }, relation: { en: "Mother", hi: "माता", bn: "মা", ta: "தாய்" } },
  { id: "m_ramesh", name: { en: "Ramesh Verma", hi: "रमेश वर्मा", bn: "রমেশ ভার্মা", ta: "ரமேஷ் வர்மா" }, relation: { en: "Father", hi: "पिता", bn: "বাবা", ta: "தந்தை" } },
  { id: "m_aanya", name: { en: "Aanya Verma", hi: "आन्या वर्मा", bn: "আন্যা ভার্মা", ta: "ஆன்யா வர்மா" }, relation: { en: "Daughter", hi: "बेटी", bn: "মেয়ে", ta: "மகள்" } },
];

/* ------------------------------------------------------------- documents --- */

export interface Document {
  id: string;
  name: L;
  number: string;
  verified: boolean;
}

export const DOCUMENTS: Document[] = [
  { id: "aadhaar", name: { en: "Aadhaar", hi: "आधार", bn: "আধার", ta: "ஆதார்" }, number: "···· ···· 6721", verified: true },
  { id: "pan", name: { en: "PAN Card", hi: "पैन कार्ड", bn: "প্যান কার্ড", ta: "பான் கார்டு" }, number: "·····321K", verified: true },
  { id: "dl", name: { en: "Driving Licence", hi: "ड्राइविंग लाइसेंस", bn: "ড্রাইভিং লাইসেন্স", ta: "ஓட்டுநர் உரிமம்" }, number: "UP·· 2019 ····", verified: true },
  { id: "voter", name: { en: "Voter ID", hi: "वोटर आईडी", bn: "ভোটার আইডি", ta: "வாக்காளர் அடையாளம்" }, number: "····· 4471", verified: false },
];

/* ------------------------------------------------------------- selectors --- */

export const getScheme = (id: string | null) =>
  SCHEMES.find((s) => s.id === id);
export const getMoment = (id: string | null) =>
  LIFE_MOMENTS.find((m) => m.id === id);
export const getService = (id: string | null) =>
  SERVICES.find((s) => s.id === id);
export const getFamilyMember = (id: string | null) =>
  FAMILY.find((m) => m.id === id);

export interface ServiceTaskRef extends ServiceTask {
  serviceId: string;
}

/** Find a task by id across every service (and which service owns it). */
export const getTask = (id: string | null): ServiceTaskRef | undefined => {
  if (!id) return undefined;
  for (const s of SERVICES) {
    const task = s.tasks.find((t) => t.id === id);
    if (task) return { ...task, serviceId: s.id };
  }
  return undefined;
};

/** Schemes matching the user's onboarding life-context, padded to a minimum. */
export function schemesForContext(context: string[], min = 4): Scheme[] {
  const matched = SCHEMES.filter((s) =>
    s.forContext.some((c) => context.includes(c)),
  );
  if (matched.length >= min) return matched;
  const extra = SCHEMES.filter((s) => !matched.includes(s));
  return [...matched, ...extra].slice(0, min);
}

/** Map an application status to a StatusPill variant. */
export const STATUS_VARIANT: Record<
  AppStatus,
  "active" | "success" | "pending" | "info"
> = {
  submitted: "info",
  inProgress: "active",
  approved: "success",
  ready: "success",
  pending: "pending",
  actionNeeded: "pending",
  rejected: "pending",
};
