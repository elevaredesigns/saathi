/**
 * Privacy dashboard data — consents (who may use what, for what, until when)
 * and an access log (who actually looked, and why). Modelled on India's
 * consent-based data sharing (DEPA / DPDP Act, 2023). Sample data.
 */
import type { L } from "@/lib/mockData";

export type ConsentIcon = "vault" | "building" | "plant";

export interface Consent {
  id: string;
  icon: ConsentIcon;
  party: L;
  data: L;
  purpose: L;
  validity: L;
}

export const CONSENTS: Consent[] = [
  {
    id: "c_digilocker",
    icon: "vault",
    party: { en: "DigiLocker → Saathi", hi: "डिजीलॉकर → साथी", bn: "ডিজিলকার → সাথী", ta: "டிஜிலாக்கர் → சாத்தி" },
    data: { en: "Aadhaar, PAN, Driving licence", hi: "आधार, पैन, ड्राइविंग लाइसेंस", bn: "আধার, প্যান, ড্রাইভিং লাইসেন্স", ta: "ஆதார், பான், ஓட்டுநர் உரிமம்" },
    purpose: { en: "Pre-fill your applications", hi: "आपके आवेदन पहले से भरने के लिए", bn: "আপনার আবেদন আগে থেকে পূরণ করতে", ta: "உங்கள் விண்ணப்பங்களை முன்கூட்டியே நிரப்ப" },
    validity: { en: "Until May 2027", hi: "मई 2027 तक", bn: "মে 2027 পর্যন্ত", ta: "மே 2027 வரை" },
  },
  {
    id: "c_registrar",
    icon: "building",
    party: { en: "Nagar Nigam, Kanpur", hi: "नगर निगम, कानपुर", bn: "নগর নিগম, কানপুর", ta: "நகர நிகம், கான்பூர்" },
    data: { en: "Name, address, hospital birth record", hi: "नाम, पता, अस्पताल जन्म रिकॉर्ड", bn: "নাম, ঠিকানা, হাসপাতালের জন্ম রেকর্ড", ta: "பெயர், முகவரி, மருத்துவமனை பிறப்பு பதிவு" },
    purpose: { en: "Birth certificate BC-2026-UP-07734", hi: "जन्म प्रमाणपत्र BC-2026-UP-07734", bn: "জন্ম সনদ BC-2026-UP-07734", ta: "பிறப்புச் சான்றிதழ் BC-2026-UP-07734" },
    validity: { en: "Ends when the application closes", hi: "आवेदन बंद होने पर समाप्त", bn: "আবেদন বন্ধ হলে শেষ", ta: "விண்ணப்பம் முடிந்ததும் முடியும்" },
  },
  {
    id: "c_pmkisan",
    icon: "plant",
    party: { en: "PM-KISAN · Dept. of Agriculture", hi: "पीएम-किसान · कृषि विभाग", bn: "পিএম-কিসান · কৃষি দপ্তর", ta: "பிஎம்-கிசான் · வேளாண் துறை" },
    data: { en: "Land record, bank account", hi: "भूमि अभिलेख, बैंक खाता", bn: "জমির রেকর্ড, ব্যাঙ্ক অ্যাকাউন্ট", ta: "நில பதிவு, வங்கிக் கணக்கு" },
    purpose: { en: "Instalment payments to your account", hi: "आपके खाते में किस्तों का भुगतान", bn: "আপনার অ্যাকাউন্টে কিস্তি প্রদান", ta: "உங்கள் கணக்கில் தவணை செலுத்துதல்" },
    validity: { en: "Until you opt out", hi: "जब तक आप बाहर न निकलें", bn: "যতক্ষণ না আপনি বেরিয়ে যান", ta: "நீங்கள் விலகும் வரை" },
  },
];

export interface AccessEvent {
  id: string;
  who: L;
  what: L;
  purpose: L;
  when: string; // ISO
}

export const ACCESS_LOG: AccessEvent[] = [
  {
    id: "a1",
    who: { en: "Priya Nair · Nagar Nigam", hi: "प्रिया नायर · नगर निगम", bn: "প্রিয়া নায়ার · নগর নিগম", ta: "பிரியா நாயர் · நகர நிகம்" },
    what: { en: "Viewed address proof", hi: "पते का प्रमाण देखा", bn: "ঠিকানার প্রমাণ দেখেছেন", ta: "முகவரிச் சான்றைப் பார்த்தார்" },
    purpose: { en: "Birth certificate verification", hi: "जन्म प्रमाणपत्र सत्यापन", bn: "জন্ম সনদ যাচাই", ta: "பிறப்புச் சான்றிதழ் சரிபார்ப்பு" },
    when: "2026-05-20T11:42:00+05:30",
  },
  {
    id: "a2",
    who: { en: "Saathi (on your request)", hi: "साथी (आपके अनुरोध पर)", bn: "সাথী (আপনার অনুরোধে)", ta: "சாத்தி (உங்கள் கோரிக்கையின் பேரில்)" },
    what: { en: "Fetched PAN from DigiLocker", hi: "डिजीलॉकर से पैन प्राप्त किया", bn: "ডিজিলকার থেকে প্যান আনা হয়েছে", ta: "டிஜிலாக்கரிலிருந்து பான் பெறப்பட்டது" },
    purpose: { en: "Income certificate application", hi: "आय प्रमाणपत्र आवेदन", bn: "আয়ের সনদের আবেদন", ta: "வருமானச் சான்றிதழ் விண்ணப்பம்" },
    when: "2026-04-28T18:05:00+05:30",
  },
  {
    id: "a3",
    who: { en: "S. Reddy · Revenue Dept.", hi: "एस. रेड्डी · राजस्व विभाग", bn: "এস. রেড্ডি · রাজস্ব দপ্তর", ta: "எஸ். ரெட்டி · வருவாய்த் துறை" },
    what: { en: "Approved income certificate", hi: "आय प्रमाणपत्र स्वीकृत किया", bn: "আয়ের সনদ অনুমোদন করেছেন", ta: "வருமானச் சான்றிதழை அங்கீகரித்தார்" },
    purpose: { en: "INC-2026-UP-44210", hi: "INC-2026-UP-44210", bn: "INC-2026-UP-44210", ta: "INC-2026-UP-44210" },
    when: "2026-05-04T10:15:00+05:30",
  },
  {
    id: "a4",
    who: { en: "PM-KISAN system", hi: "पीएम-किसान प्रणाली", bn: "পিএম-কিসান ব্যবস্থা", ta: "பிஎம்-கிசான் அமைப்பு" },
    what: { en: "Checked bank account is Aadhaar-linked", hi: "जाँचा कि बैंक खाता आधार से जुड़ा है", bn: "ব্যাঙ্ক অ্যাকাউন্ট আধার-সংযুক্ত কিনা দেখেছে", ta: "வங்கிக் கணக்கு ஆதாருடன் இணைந்ததா என்று சரிபார்த்தது" },
    purpose: { en: "Instalment eligibility", hi: "किस्त पात्रता", bn: "কিস্তির যোগ্যতা", ta: "தவணைத் தகுதி" },
    when: "2026-05-22T09:30:00+05:30",
  },
];
