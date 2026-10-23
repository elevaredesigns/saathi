/**
 * Traffic e-challans on the citizen's vehicle. Modelled on the Parivahan
 * eChallan system (camera-issued challans with evidence, payable online or
 * contestable in a Virtual Court). All numbers and fines are samples.
 */
import type { L } from "@/lib/mockData";

export type EvidenceKind = "speed" | "redLight" | "parking" | "seatbelt";

export interface Challan {
  no: string;
  vehicle: string;
  violation: L;
  section: string;
  fine: number;
  when: string; // ISO
  place: L;
  source: L;
  evidence: EvidenceKind;
  /** Short caption drawn onto the evidence frame. */
  reading?: string;
  /** Already settled before the demo starts. */
  paid?: boolean;
}

export const CITIZEN_VEHICLE = {
  number: "UP78 DX 4521",
  model: "Maruti Suzuki Swift · Petrol",
  licence: "UP78 2019 0004821",
};

export const CHALLAN_PAYEE: L = {
  en: "Kanpur Traffic Police · eChallan",
  hi: "कानपुर ट्रैफ़िक पुलिस · ई-चालान",
  bn: "কানপুর ট্রাফিক পুলিশ · ই-চালান",
  ta: "கான்பூர் போக்குவரத்துக் காவல் · இ-சலான்",
};

const CAMERA: L = { en: "ITMS camera", hi: "आईटीएमएस कैमरा", bn: "আইটিএমএস ক্যামেরা", ta: "ITMS கேமரா" };

export const CHALLANS: Challan[] = [
  {
    no: "UP78260512004231",
    vehicle: CITIZEN_VEHICLE.number,
    violation: { en: "Over-speeding", hi: "तेज़ रफ़्तार", bn: "অতিরিক্ত গতি", ta: "அதிவேகம்" },
    section: "MV Act §183",
    fine: 1000,
    when: "2026-05-12T18:42:00+05:30",
    place: { en: "GT Road, Rawatpur crossing", hi: "जीटी रोड, रावतपुर चौराहा", bn: "জিটি রোড, রাওয়াতপুর মোড়", ta: "ஜிடி சாலை, ராவத்பூர் சந்திப்பு" },
    source: CAMERA,
    evidence: "speed",
    reading: "78 km/h · limit 60",
  },
  {
    no: "UP78260503011907",
    vehicle: CITIZEN_VEHICLE.number,
    violation: { en: "Jumping a red light", hi: "लाल बत्ती पार करना", bn: "লাল বাতি অমান্য", ta: "சிவப்பு விளக்கை மீறுதல்" },
    section: "MV Act §184",
    fine: 1000,
    when: "2026-05-03T09:17:00+05:30",
    place: { en: "Mall Road, Phool Bagh signal", hi: "माल रोड, फूल बाग़ सिग्नल", bn: "মল রোড, ফুল বাগ সিগন্যাল", ta: "மால் சாலை, பூல் பாக் சிக்னல்" },
    source: CAMERA,
    evidence: "redLight",
    reading: "Signal red · 2.4 s",
  },
  {
    no: "UP78260421000618",
    vehicle: CITIZEN_VEHICLE.number,
    violation: { en: "Parking in a no-parking zone", hi: "नो-पार्किंग में पार्किंग", bn: "নো-পার্কিং এলাকায় পার্কিং", ta: "நிறுத்தத் தடை பகுதியில் நிறுத்துதல்" },
    section: "MV Act §122/177",
    fine: 500,
    when: "2026-04-21T13:05:00+05:30",
    place: { en: "Swaroop Nagar market", hi: "स्वरूप नगर बाज़ार", bn: "স্বরূপ নগর বাজার", ta: "ஸ்வரூப் நகர் சந்தை" },
    source: { en: "Traffic officer · handheld device", hi: "यातायात अधिकारी · हैंडहेल्ड डिवाइस", bn: "ট্রাফিক অফিসার · হ্যান্ডহেল্ড ডিভাইস", ta: "போக்குவரத்து அதிகாரி · கையடக்கக் கருவி" },
    evidence: "parking",
  },
  {
    no: "UP78260214007702",
    vehicle: CITIZEN_VEHICLE.number,
    violation: { en: "Driving without a seat belt", hi: "बिना सीट बेल्ट गाड़ी चलाना", bn: "সিট বেল্ট ছাড়া গাড়ি চালানো", ta: "சீட் பெல்ட் இல்லாமல் ஓட்டுதல்" },
    section: "MV Act §194B",
    fine: 1000,
    when: "2026-02-14T11:26:00+05:30",
    place: { en: "Kalyanpur flyover", hi: "कल्याणपुर फ़्लाईओवर", bn: "কল্যাণপুর ফ্লাইওভার", ta: "கல்யாண்பூர் மேம்பாலம்" },
    source: CAMERA,
    evidence: "seatbelt",
    paid: true,
  },
];

export const challanBillId = (no: string) => `challan_${no}`;

export function formatFine(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export const CONTEST_REASONS: { id: string; label: L }[] = [
  { id: "notMe", label: { en: "I wasn't driving the vehicle", hi: "मैं वाहन नहीं चला रहा था", bn: "আমি গাড়ি চালাচ্ছিলাম না", ta: "நான் வாகனம் ஓட்டவில்லை" } },
  { id: "sold", label: { en: "The vehicle had been sold", hi: "वाहन बेचा जा चुका था", bn: "গাড়িটি বিক্রি হয়ে গিয়েছিল", ta: "வாகனம் ஏற்கெனவே விற்கப்பட்டது" } },
  { id: "misread", label: { en: "The number plate was read wrongly", hi: "नंबर प्लेट ग़लत पढ़ी गई", bn: "নম্বর প্লেট ভুল পড়া হয়েছে", ta: "எண் தகடு தவறாகப் படிக்கப்பட்டது" } },
  { id: "emergency", label: { en: "It was a medical emergency", hi: "यह चिकित्सा आपातकाल था", bn: "এটি একটি চিকিৎসা জরুরি অবস্থা ছিল", ta: "அது மருத்துவ அவசரநிலை" } },
];
