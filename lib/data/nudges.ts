/**
 * "Needs attention" — proactive nudges on Home. Derived from prototype state so
 * they react to what the citizen does (paying the tax removes its nudge and a
 * "paid" confirmation takes its place).
 */
import type { SubmittedApplication } from "@/lib/context/PrototypeContext";
import type { L } from "@/lib/mockData";

export type NudgeIcon = "receipt" | "check" | "card" | "clock" | "plant";

export interface Nudge {
  id: string;
  tone: "saffron" | "green" | "navy";
  icon: NudgeIcon;
  title: L;
  body: L;
  cta: L;
  href: string;
}

const TAX_DUE: Nudge = {
  id: "tax_due",
  tone: "saffron",
  icon: "receipt",
  title: { en: "Property tax due in 5 days", hi: "संपत्ति कर 5 दिनों में देय", bn: "সম্পত্তি কর 5 দিনের মধ্যে দেয়", ta: "சொத்து வரி 5 நாட்களில் செலுத்த வேண்டும்" },
  body: { en: "Nagar Nigam, Kanpur · ₹2,450", hi: "नगर निगम, कानपुर · ₹2,450", bn: "নগর নিগম, কানপুর · ₹2,450", ta: "நகர நிகம், கான்பூர் · ₹2,450" },
  cta: { en: "Pay now", hi: "अभी भुगतान करें", bn: "এখনই দিন", ta: "இப்போது செலுத்து" },
  href: "/prototype/apply/?id=taxes_property",
};

const TAX_PAID: Nudge = {
  id: "tax_paid",
  tone: "green",
  icon: "check",
  title: { en: "Property tax paid", hi: "संपत्ति कर का भुगतान हो गया", bn: "সম্পত্তি কর পরিশোধ হয়েছে", ta: "சொத்து வரி செலுத்தப்பட்டது" },
  body: { en: "Receipt saved · no dues left this year", hi: "रसीद सहेजी गई · इस वर्ष कोई बकाया नहीं", bn: "রসিদ সংরক্ষিত · এ বছর কোনো বকেয়া নেই", ta: "ரசீது சேமிக்கப்பட்டது · இந்த ஆண்டு நிலுவை இல்லை" },
  cta: { en: "View receipt", hi: "रसीद देखें", bn: "রসিদ দেখুন", ta: "ரசீதைப் பார்" },
  href: "/prototype/track/",
};

const AYUSHMAN_READY: Nudge = {
  id: "ayushman_ready",
  tone: "green",
  icon: "card",
  title: { en: "Your Ayushman card is ready", hi: "आपका आयुष्मान कार्ड तैयार है", bn: "আপনার আয়ুষ্মান কার্ড তৈরি", ta: "உங்கள் ஆயுஷ்மான் அட்டை தயார்" },
  body: { en: "₹5 L health cover for your family", hi: "आपके परिवार के लिए ₹5 लाख का स्वास्थ्य कवर", bn: "আপনার পরিবারের জন্য ₹5 লাখ স্বাস্থ্য কভার", ta: "உங்கள் குடும்பத்திற்கு ₹5 லட்சம் சுகாதார காப்பீடு" },
  cta: { en: "View status", hi: "स्थिति देखें", bn: "অবস্থা দেখুন", ta: "நிலையைப் பார்" },
  href: "/prototype/status/?id=app_ayushman",
};

const BIRTH_REVIEW: Nudge = {
  id: "birth_review",
  tone: "navy",
  icon: "clock",
  title: { en: "Birth certificate in review", hi: "जन्म प्रमाणपत्र की समीक्षा जारी", bn: "জন্ম সনদ পর্যালোচনাধীন", ta: "பிறப்புச் சான்றிதழ் பரிசீலனையில்" },
  body: { en: "Priya Nair is verifying · about 3 days", hi: "प्रिया नायर सत्यापन कर रही हैं · लगभग 3 दिन", bn: "প্রিয়া নায়ার যাচাই করছেন · প্রায় 3 দিন", ta: "பிரியா நாயர் சரிபார்க்கிறார் · சுமார் 3 நாட்கள்" },
  cta: { en: "Track", hi: "ट्रैक करें", bn: "ট্র্যাক করুন", ta: "கண்காணி" },
  href: "/prototype/status/?id=app_birth",
};

const PMKISAN_STEP: Nudge = {
  id: "pmkisan_step",
  tone: "saffron",
  icon: "plant",
  title: { en: "PM-KISAN: one step left", hi: "पीएम-किसान: एक चरण बाकी", bn: "পিএম-কিসান: আর এক ধাপ", ta: "பிஎம்-கிசான்: இன்னும் ஒரு படி" },
  body: { en: "Add your land record to receive ₹6,000 a year", hi: "₹6,000 सालाना पाने के लिए भूमि अभिलेख जोड़ें", bn: "বছরে ₹6,000 পেতে জমির রেকর্ড যোগ করুন", ta: "ஆண்டுக்கு ₹6,000 பெற நில பதிவைச் சேர்க்கவும்" },
  cta: { en: "Continue", hi: "जारी रखें", bn: "চালিয়ে যান", ta: "தொடர்" },
  href: "/prototype/apply/?id=pmkisan",
};

export function buildNudges(state: { paidBills: string[]; submitted: SubmittedApplication[] }): Nudge[] {
  const paid = state.paidBills.includes("taxes_property") || state.paidBills.includes("land_tax");
  return [paid ? TAX_PAID : TAX_DUE, AYUSHMAN_READY, BIRTH_REVIEW, PMKISAN_STEP];
}
