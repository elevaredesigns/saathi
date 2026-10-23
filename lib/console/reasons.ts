/** Localized vocabulary a department console needs: flags, reasons, purposes. */
import type { L } from "@/lib/mockData";

export type FlagId = "nameMismatch" | "dobMismatch" | "addressChanged" | "manualDoc" | "photoQuality" | "duplicate" | "incomeLimit" | "outsideJurisdiction";

export const FLAGS: Record<FlagId, { label: L; detail: L; kyc?: boolean }> = {
  nameMismatch: {
    label: { en: "Name differs from Aadhaar", hi: "नाम आधार से अलग", bn: "নাম আধারের সঙ্গে মেলে না", ta: "பெயர் ஆதாரிலிருந்து வேறுபடுகிறது" },
    detail: { en: "The name typed on the form doesn't exactly match the e-KYC record.", hi: "फ़ॉर्म में लिखा नाम ई-केवाईसी रिकॉर्ड से पूरी तरह मेल नहीं खाता।", bn: "ফর্মে লেখা নাম ই-কেওয়াইসি রেকর্ডের সঙ্গে হুবহু মেলে না।", ta: "படிவத்தில் உள்ள பெயர் மின்-கேஒய்சி பதிவுடன் சரியாகப் பொருந்தவில்லை." },
    kyc: true,
  },
  dobMismatch: {
    label: { en: "Date of birth differs", hi: "जन्म तिथि अलग", bn: "জন্ম তারিখ আলাদা", ta: "பிறந்த தேதி வேறுபடுகிறது" },
    detail: { en: "The date of birth on the form and in Aadhaar are different.", hi: "फ़ॉर्म और आधार में जन्म तिथि अलग है।", bn: "ফর্ম ও আধারে জন্ম তারিখ আলাদা।", ta: "படிவத்திலும் ஆதாரிலும் பிறந்த தேதி வேறுபடுகிறது." },
    kyc: true,
  },
  addressChanged: {
    label: { en: "Address recently changed", hi: "पता हाल में बदला", bn: "ঠিকানা সম্প্রতি বদলেছে", ta: "முகவரி சமீபத்தில் மாறியது" },
    detail: { en: "Aadhaar address was updated in the last 30 days.", hi: "आधार पता पिछले 30 दिनों में अपडेट हुआ।", bn: "গত ৩০ দিনে আধার ঠিকানা আপডেট হয়েছে।", ta: "கடந்த 30 நாட்களில் ஆதார் முகவரி புதுப்பிக்கப்பட்டது." },
    kyc: true,
  },
  manualDoc: {
    label: { en: "Uploaded document", hi: "अपलोड किया दस्तावेज़", bn: "আপলোড করা নথি", ta: "பதிவேற்றிய ஆவணம்" },
    detail: { en: "At least one document was uploaded, not fetched from DigiLocker — check it by eye.", hi: "कम से कम एक दस्तावेज़ डिजीलॉकर से नहीं, अपलोड किया गया है — ध्यान से जाँचें।", bn: "অন্তত একটি নথি ডিজিলকার থেকে নয়, আপলোড করা — নিজে দেখে যাচাই করুন।", ta: "குறைந்தது ஒரு ஆவணம் டிஜிலாக்கரிலிருந்து அல்ல, பதிவேற்றப்பட்டது — கண்ணால் சரிபாருங்கள்." },
  },
  photoQuality: {
    label: { en: "Photo unclear", hi: "फ़ोटो अस्पष्ट", bn: "ছবি অস্পষ্ট", ta: "புகைப்படம் தெளிவில்லை" },
    detail: { en: "Face-match confidence is below the threshold.", hi: "चेहरा-मिलान का भरोसा सीमा से कम है।", bn: "মুখ মেলানোর নির্ভরতা সীমার নিচে।", ta: "முகப் பொருத்த நம்பகத்தன்மை வரம்புக்குக் கீழ் உள்ளது." },
    kyc: true,
  },
  duplicate: {
    label: { en: "Possible duplicate", hi: "संभावित दोहराव", bn: "সম্ভাব্য পুনরাবৃত্তি", ta: "இரட்டிப்பாக இருக்கலாம்" },
    detail: { en: "A similar application from the same Aadhaar exists this year.", hi: "इसी आधार से इस वर्ष ऐसा ही आवेदन मौजूद है।", bn: "একই আধার থেকে এ বছর একই রকম আবেদন আছে।", ta: "இதே ஆதாரிலிருந்து இந்த ஆண்டு இதுபோன்ற விண்ணப்பம் உள்ளது." },
  },
  incomeLimit: {
    label: { en: "Income near the limit", hi: "आय सीमा के क़रीब", bn: "আয় সীমার কাছাকাছি", ta: "வருமானம் வரம்புக்கு அருகில்" },
    detail: { en: "Declared income is within 5% of the eligibility ceiling.", hi: "घोषित आय पात्रता सीमा के 5% के भीतर है।", bn: "ঘোষিত আয় যোগ্যতার সীমার ৫%-এর মধ্যে।", ta: "அறிவித்த வருமானம் தகுதி வரம்பின் 5%-க்குள் உள்ளது." },
  },
  outsideJurisdiction: {
    label: { en: "Outside jurisdiction", hi: "अधिकार क्षेत्र से बाहर", bn: "এক্তিয়ারের বাইরে", ta: "அதிகார வரம்புக்கு வெளியே" },
    detail: { en: "The address falls under a neighbouring office.", hi: "पता पड़ोसी कार्यालय के अंतर्गत आता है।", bn: "ঠিকানাটি পাশের কার্যালয়ের অধীনে।", ta: "முகவரி அண்டை அலுவலகத்தின் கீழ் வருகிறது." },
  },
};

export const INFO_REASONS: { id: string; label: L; template: L }[] = [
  {
    id: "unclear",
    label: { en: "A document is unclear", hi: "कोई दस्तावेज़ अस्पष्ट है", bn: "একটি নথি অস্পষ্ট", ta: "ஒரு ஆவணம் தெளிவில்லை" },
    template: { en: "The address proof you uploaded is blurred. Please add a clear copy or fetch it from DigiLocker.", hi: "आपका अपलोड किया पता प्रमाण धुंधला है। कृपया साफ़ प्रति जोड़ें या डिजीलॉकर से लाएँ।", bn: "আপনার আপলোড করা ঠিকানার প্রমাণ ঝাপসা। স্পষ্ট কপি দিন বা ডিজিলকার থেকে আনুন।", ta: "நீங்கள் பதிவேற்றிய முகவரிச் சான்று மங்கலாக உள்ளது. தெளிவான நகலைச் சேர்க்கவும் அல்லது டிஜிலாக்கரிலிருந்து எடுக்கவும்." },
  },
  {
    id: "missing",
    label: { en: "A document is missing", hi: "कोई दस्तावेज़ नहीं है", bn: "একটি নথি নেই", ta: "ஒரு ஆவணம் இல்லை" },
    template: { en: "We need the hospital discharge summary to register the birth. You can add it from DigiLocker.", hi: "जन्म पंजीकरण के लिए अस्पताल डिस्चार्ज सारांश चाहिए। आप इसे डिजीलॉकर से जोड़ सकते हैं।", bn: "জন্ম নিবন্ধনের জন্য হাসপাতালের ডিসচার্জ সারাংশ দরকার। ডিজিলকার থেকে যোগ করতে পারেন।", ta: "பிறப்பைப் பதிவு செய்ய மருத்துவமனை வெளியேற்றச் சுருக்கம் தேவை. டிஜிலாக்கரிலிருந்து சேர்க்கலாம்." },
  },
  {
    id: "mismatch",
    label: { en: "Details don't match Aadhaar", hi: "विवरण आधार से मेल नहीं खाते", bn: "বিবরণ আধারের সঙ্গে মেলে না", ta: "விவரங்கள் ஆதாருடன் பொருந்தவில்லை" },
    template: { en: "Your name on the form differs from your Aadhaar. Please confirm the correct spelling.", hi: "फ़ॉर्म में आपका नाम आधार से अलग है। कृपया सही वर्तनी की पुष्टि करें।", bn: "ফর্মে আপনার নাম আধার থেকে আলাদা। সঠিক বানান নিশ্চিত করুন।", ta: "படிவத்தில் உள்ள உங்கள் பெயர் ஆதாரிலிருந்து வேறுபடுகிறது. சரியான எழுத்துக்கூட்டலை உறுதிப்படுத்தவும்." },
  },
  {
    id: "fieldVisit",
    label: { en: "A field visit is needed", hi: "स्थल निरीक्षण ज़रूरी", bn: "সরেজমিন পরিদর্শন দরকার", ta: "நேரில் ஆய்வு தேவை" },
    template: { en: "An officer will visit your address. Please share a convenient time in the next 5 days.", hi: "एक अधिकारी आपके पते पर आएँगे। कृपया अगले 5 दिनों में सुविधाजनक समय बताएँ।", bn: "একজন আধিকারিক আপনার ঠিকানায় যাবেন। আগামী ৫ দিনে সুবিধাজনক সময় জানান।", ta: "ஒரு அதிகாரி உங்கள் முகவரிக்கு வருவார். அடுத்த 5 நாட்களில் வசதியான நேரத்தைத் தெரிவிக்கவும்." },
  },
];

export const REJECT_REASONS: { id: string; label: L; rule: string }[] = [
  { id: "ineligible", label: { en: "Not eligible under the scheme rules", hi: "योजना नियमों के अंतर्गत पात्र नहीं", bn: "প্রকল্পের নিয়মে যোগ্য নয়", ta: "திட்ட விதிகளின்படி தகுதியில்லை" }, rule: "Rule 4(2)" },
  { id: "duplicate", label: { en: "Duplicate of an approved application", hi: "स्वीकृत आवेदन का दोहराव", bn: "অনুমোদিত আবেদনের পুনরাবৃত্তি", ta: "அங்கீகரிக்கப்பட்ட விண்ணப்பத்தின் இரட்டிப்பு" }, rule: "Rule 7" },
  { id: "invalidDoc", label: { en: "Document could not be verified", hi: "दस्तावेज़ सत्यापित नहीं हो सका", bn: "নথি যাচাই করা যায়নি", ta: "ஆவணத்தைச் சரிபார்க்க முடியவில்லை" }, rule: "Rule 9(1)" },
  { id: "jurisdiction", label: { en: "Belongs to another office", hi: "दूसरे कार्यालय का मामला", bn: "অন্য কার্যালয়ের বিষয়", ta: "வேறு அலுவலகத்தைச் சேர்ந்தது" }, rule: "Rule 3" },
];

export const ACCESS_PURPOSES: { id: string; label: L }[] = [
  { id: "verify", label: { en: "Verify identity for this application", hi: "इस आवेदन हेतु पहचान सत्यापन", bn: "এই আবেদনের জন্য পরিচয় যাচাই", ta: "இந்த விண்ணப்பத்துக்கான அடையாளச் சரிபார்ப்பு" } },
  { id: "mismatch", label: { en: "Resolve a data mismatch", hi: "डेटा बेमेल सुलझाना", bn: "তথ্যের অমিল মেটানো", ta: "தரவுப் பொருத்தமின்மையைத் தீர்த்தல்" } },
  { id: "audit", label: { en: "Audit or legal request", hi: "ऑडिट या कानूनी अनुरोध", bn: "অডিট বা আইনি অনুরোধ", ta: "தணிக்கை அல்லது சட்டக் கோரிக்கை" } },
];

export const VIOLATIONS: { id: string; label: L; section: string; fine: number }[] = [
  { id: "speed", label: { en: "Over-speeding", hi: "तेज़ रफ़्तार", bn: "অতিরিক্ত গতি", ta: "அதிவேகம்" }, section: "§183", fine: 1000 },
  { id: "redLight", label: { en: "Jumping a red light", hi: "लाल बत्ती पार करना", bn: "লাল বাতি অমান্য", ta: "சிவப்பு விளக்கை மீறுதல்" }, section: "§184", fine: 1000 },
  { id: "helmet", label: { en: "Riding without a helmet", hi: "बिना हेलमेट सवारी", bn: "হেলমেট ছাড়া বাইক চালানো", ta: "தலைக்கவசம் இல்லாமல் ஓட்டுதல்" }, section: "§194D", fine: 1000 },
  { id: "seatbelt", label: { en: "No seat belt", hi: "सीट बेल्ट नहीं", bn: "সিট বেল্ট নেই", ta: "சீட் பெல்ட் இல்லை" }, section: "§194B", fine: 1000 },
  { id: "parking", label: { en: "No-parking zone", hi: "नो-पार्किंग ज़ोन", bn: "নো-পার্কিং এলাকা", ta: "நிறுத்தத் தடை பகுதி" }, section: "§122/177", fine: 500 },
  { id: "insurance", label: { en: "Driving without insurance", hi: "बिना बीमा गाड़ी चलाना", bn: "বিমা ছাড়া গাড়ি চালানো", ta: "காப்பீடு இல்லாமல் ஓட்டுதல்" }, section: "§196", fine: 2000 },
];
