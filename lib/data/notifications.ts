/** Inbox — every notification deep-links to where the citizen can act on it. */
import type { L } from "@/lib/mockData";

export type NotificationIcon = "check" | "clock" | "receipt" | "megaphone" | "alert" | "x";

export interface AppNotification {
  id: string;
  icon: NotificationIcon;
  title: L;
  body: L;
  when: string; // ISO
  href: string;
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n_ayushman",
    icon: "check",
    title: { en: "Ayushman card ready", hi: "आयुष्मान कार्ड तैयार", bn: "আয়ুষ্মান কার্ড তৈরি", ta: "ஆயுஷ்மான் அட்டை தயார்" },
    body: { en: "Download it or collect it from your nearest CSC.", hi: "इसे डाउनलोड करें या नज़दीकी CSC से लें।", bn: "ডাউনলোড করুন বা নিকটতম CSC থেকে নিন।", ta: "பதிவிறக்கவும் அல்லது அருகிலுள்ள CSC-இல் பெறவும்." },
    when: "2026-05-24T09:10:00+05:30",
    href: "/prototype/status/?id=app_ayushman",
  },
  {
    id: "n_birth",
    icon: "clock",
    title: { en: "Birth certificate moved to verification", hi: "जन्म प्रमाणपत्र सत्यापन में पहुँचा", bn: "জন্ম সনদ যাচাইয়ে গেছে", ta: "பிறப்புச் சான்றிதழ் சரிபார்ப்புக்குச் சென்றது" },
    body: { en: "Anil Kumar, field officer, will visit within 5 days.", hi: "क्षेत्र अधिकारी अनिल कुमार 5 दिनों में आएंगे।", bn: "ফিল্ড অফিসার অনিল কুমার 5 দিনের মধ্যে আসবেন।", ta: "கள அதிகாரி அனில் குமார் 5 நாட்களில் வருவார்." },
    when: "2026-05-23T16:40:00+05:30",
    href: "/prototype/status/?id=app_birth",
  },
  {
    id: "n_tax",
    icon: "receipt",
    title: { en: "Property tax reminder", hi: "संपत्ति कर अनुस्मारक", bn: "সম্পত্তি কর অনুস্মারক", ta: "சொத்து வரி நினைவூட்டல்" },
    body: { en: "₹2,450 due by 29 May. Pay in under a minute.", hi: "₹2,450 29 मई तक देय। एक मिनट में भुगतान करें।", bn: "₹2,450 29 মে-র মধ্যে দেয়। এক মিনিটে দিন।", ta: "₹2,450 மே 29-க்குள். ஒரு நிமிடத்தில் செலுத்துங்கள்." },
    when: "2026-05-22T08:00:00+05:30",
    href: "/prototype/apply/?id=taxes_property",
  },
  {
    id: "n_scheme",
    icon: "megaphone",
    title: { en: "New: PM Vishwakarma for artisans", hi: "नया: कारीगरों के लिए पीएम विश्वकर्मा", bn: "নতুন: কারিগরদের জন্য পিএম বিশ্বকর্মা", ta: "புதிது: கைவினைஞர்களுக்கு பிஎம் விஸ்வகர்மா" },
    body: { en: "Toolkit support of ₹15,000 and low-interest credit.", hi: "₹15,000 की टूलकिट सहायता और कम ब्याज पर ऋण।", bn: "₹15,000 টুলকিট সহায়তা ও কম সুদে ঋণ।", ta: "₹15,000 கருவித்தொகுப்பு உதவி மற்றும் குறைந்த வட்டிக் கடன்." },
    when: "2026-05-20T12:00:00+05:30",
    href: "/prototype/scheme/?id=vishwakarma",
  },
];
