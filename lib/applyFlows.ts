import { L, getScheme, getTask } from "@/lib/mockData";

/* ============================================================== types === */

export type ApplyKind =
  | "apply"
  | "pay"
  | "renew"
  | "register"
  | "download"
  | "grievance";

export type FieldType = "text" | "select" | "readout";

export interface ApplyField {
  id: string;
  label: L;
  type?: FieldType; // default "text"
  options?: string[]; // for select (proper nouns / codes — shown as-is)
  value?: string; // for readout (pre-fetched sample value)
  placeholder?: string;
}

export interface StepVoice {
  transcript: L;
  extract: Record<string, L>;
}

export interface ApplyStep {
  title: L;
  note?: L;
  fields: ApplyField[];
  voice?: StepVoice;
}

export interface ApplyFlow {
  id: string;
  kind: ApplyKind;
  service: L;
  portal: string; // real portal name (proper noun, shown as-is)
  department: L;
  intro: L;
  timeline: L;
  fee?: string; // e.g. "₹400" or "Free"
  amount?: string; // for pay flows — the payable amount
  documents: L[];
  steps: ApplyStep[];
}

/* ===================================================== per-kind intros === */

const KIND_INTRO: Record<ApplyKind, L> = {
  apply: {
    en: "Apply online in a few guided steps — we'll save your progress.",
    hi: "कुछ आसान चरणों में ऑनलाइन आवेदन करें — आपकी प्रगति सहेजी जाएगी।",
    bn: "কয়েকটি সহজ ধাপে অনলাইনে আবেদন করুন — আপনার অগ্রগতি সংরক্ষিত থাকবে।",
    ta: "சில எளிய படிகளில் ஆன்லைனில் விண்ணப்பிக்கவும் — உங்கள் முன்னேற்றம் சேமிக்கப்படும்.",
  },
  pay: {
    en: "Pay securely and get an instant receipt.",
    hi: "सुरक्षित भुगतान करें और तुरंत रसीद पाएं।",
    bn: "নিরাপদে পরিশোধ করুন এবং সঙ্গে সঙ্গে রসিদ পান।",
    ta: "பாதுகாப்பாக செலுத்தி உடனடி ரசீது பெறுங்கள்.",
  },
  renew: {
    en: "Renew in a few steps — we'll fetch your existing record.",
    hi: "कुछ चरणों में नवीनीकरण करें — आपका मौजूदा रिकॉर्ड लाया जाएगा।",
    bn: "কয়েকটি ধাপে নবায়ন করুন — আপনার বিদ্যমান রেকর্ড আনা হবে।",
    ta: "சில படிகளில் புதுப்பிக்கவும் — உங்கள் தற்போதைய பதிவு பெறப்படும்.",
  },
  register: {
    en: "Register in a few quick steps.",
    hi: "कुछ त्वरित चरणों में पंजीकरण करें।",
    bn: "কয়েকটি দ্রুত ধাপে নিবন্ধন করুন।",
    ta: "சில விரைவான படிகளில் பதிவு செய்யவும்.",
  },
  download: {
    en: "Verify your identity and download instantly.",
    hi: "अपनी पहचान सत्यापित करें और तुरंत डाउनलोड करें।",
    bn: "আপনার পরিচয় যাচাই করে সঙ্গে সঙ্গে ডাউনলোড করুন।",
    ta: "உங்கள் அடையாளத்தைச் சரிபார்த்து உடனடியாகப் பதிவிறக்கவும்.",
  },
  grievance: {
    en: "Raise your complaint — you'll get a tracking ID.",
    hi: "अपनी शिकायत दर्ज करें — आपको एक ट्रैकिंग आईडी मिलेगी।",
    bn: "আপনার অভিযোগ জানান — একটি ট্র্যাকিং আইডি পাবেন।",
    ta: "உங்கள் புகாரைப் பதிவு செய்யுங்கள் — கண்காணிப்பு ஐடி கிடைக்கும்.",
  },
};

/* ============================================== localized field atoms === */
/* Labels are localized & reused; option/value/placeholder are sample data. */

const F = {
  aadhaar: { id: "aadhaar", label: { en: "Aadhaar number", hi: "आधार संख्या", bn: "আধার নম্বর", ta: "ஆதார் எண்" }, placeholder: "XXXX XXXX 6721" },
  eid: { id: "eid", label: { en: "Enrolment ID (EID)", hi: "नामांकन आईडी (EID)", bn: "নথিভুক্তি আইডি (EID)", ta: "பதிவு ஐடி (EID)" } },
  mobile: { id: "mobile", label: { en: "Mobile number", hi: "मोबाइल नंबर", bn: "মোবাইল নম্বর", ta: "மொபைல் எண்" }, placeholder: "98765 43210" },
  otp: { id: "otp", label: { en: "OTP", hi: "ओटीपी", bn: "ওটিপি", ta: "ஓடிபி" }, placeholder: "••••••" },
  fullName: { id: "fullName", label: { en: "Full name", hi: "पूरा नाम", bn: "পুরো নাম", ta: "முழுப் பெயர்" } },
  fatherName: { id: "fatherName", label: { en: "Father's name", hi: "पिता का नाम", bn: "বাবার নাম", ta: "தந்தையின் பெயர்" } },
  motherName: { id: "motherName", label: { en: "Mother's name", hi: "माता का नाम", bn: "মায়ের নাম", ta: "தாயின் பெயர்" } },
  husbandName: { id: "husbandName", label: { en: "Husband's name", hi: "पति का नाम", bn: "স্বামীর নাম", ta: "கணவரின் பெயர்" } },
  guardianName: { id: "guardianName", label: { en: "Guardian's name", hi: "अभिभावक का नाम", bn: "অভিভাবকের নাম", ta: "பாதுகாவலரின் பெயர்" } },
  dob: { id: "dob", label: { en: "Date of birth", hi: "जन्म तिथि", bn: "জন্ম তারিখ", ta: "பிறந்த தேதி" }, placeholder: "DD / MM / YYYY" },
  gender: { id: "gender", label: { en: "Gender", hi: "लिंग", bn: "লিঙ্গ", ta: "பாலினம்" }, type: "select", options: ["Female", "Male", "Other"] },
  relation: { id: "relation", label: { en: "Relationship", hi: "संबंध", bn: "সম্পর্ক", ta: "உறவுமுறை" } },
  address: { id: "address", label: { en: "Address", hi: "पता", bn: "ঠিকানা", ta: "முகவரி" } },
  newAddress: { id: "newAddress", label: { en: "New address", hi: "नया पता", bn: "নতুন ঠিকানা", ta: "புதிய முகவரி" } },
  state: { id: "state", label: { en: "State", hi: "राज्य", bn: "রাজ্য", ta: "மாநிலம்" } },
  district: { id: "district", label: { en: "District", hi: "जिला", bn: "জেলা", ta: "மாவட்டம்" } },
  block: { id: "block", label: { en: "Block / Tehsil", hi: "ब्लॉक / तहसील", bn: "ব্লক / তহশিল", ta: "வட்டம் / தாலுகா" } },
  village: { id: "village", label: { en: "Village / Town", hi: "गाँव / शहर", bn: "গ্রাম / শহর", ta: "கிராமம் / நகரம்" } },
  pincode: { id: "pincode", label: { en: "PIN code", hi: "पिन कोड", bn: "পিন কোড", ta: "பின் கோடு" }, placeholder: "208001" },
  bankAccount: { id: "bankAccount", label: { en: "Bank account number", hi: "बैंक खाता संख्या", bn: "ব্যাঙ্ক অ্যাকাউন্ট নম্বর", ta: "வங்கிக் கணக்கு எண்" } },
  ifsc: { id: "ifsc", label: { en: "IFSC code", hi: "आईएफएससी कोड", bn: "আইএফএসসি কোড", ta: "ஐஎஃப்எஸ்சி குறியீடு" }, placeholder: "SBIN0001234" },
  bankName: { id: "bankName", label: { en: "Bank name", hi: "बैंक का नाम", bn: "ব্যাঙ্কের নাম", ta: "வங்கியின் பெயர்" } },
  pan: { id: "pan", label: { en: "PAN", hi: "पैन", bn: "প্যান", ta: "பான்" }, placeholder: "ABCDE1234K" },
  rationCard: { id: "rationCard", label: { en: "Ration card number", hi: "राशन कार्ड संख्या", bn: "রেশন কার্ড নম্বর", ta: "ரேஷன் கார்டு எண்" } },
  annualIncome: { id: "annualIncome", label: { en: "Annual family income (₹)", hi: "वार्षिक पारिवारिक आय (₹)", bn: "বার্ষিক পারিবারিক আয় (₹)", ta: "ஆண்டு குடும்ப வருமானம் (₹)" } },
  occupation: { id: "occupation", label: { en: "Occupation", hi: "व्यवसाय", bn: "পেশা", ta: "தொழில்" } },
  category: { id: "category", label: { en: "Category", hi: "श्रेणी", bn: "শ্রেণি", ta: "பிரிவு" }, type: "select", options: ["General", "OBC", "SC", "ST", "EWS"] },
  caste: { id: "caste", label: { en: "Caste", hi: "जाति", bn: "জাতি", ta: "சாதி" } },
  email: { id: "email", label: { en: "Email", hi: "ईमेल", bn: "ইমেল", ta: "மின்னஞ்சல்" } },
  purpose: { id: "purpose", label: { en: "Purpose", hi: "प्रयोजन", bn: "উদ্দেশ্য", ta: "நோக்கம்" } },
  nominee: { id: "nominee", label: { en: "Nominee name", hi: "नामिती का नाम", bn: "নমিনির নাম", ta: "வாரிசுதாரர் பெயர்" } },
  vehicleNo: { id: "vehicleNo", label: { en: "Vehicle number", hi: "वाहन संख्या", bn: "যানবাহন নম্বর", ta: "வாகன எண்" }, placeholder: "UP78 AB 1234" },
  chassisNo: { id: "chassisNo", label: { en: "Chassis number", hi: "चेसिस संख्या", bn: "চ্যাসিস নম্বর", ta: "சேஸிஸ் எண்" } },
  engineNo: { id: "engineNo", label: { en: "Engine number", hi: "इंजन संख्या", bn: "ইঞ্জিন নম্বর", ta: "என்ஜின் எண்" } },
  makerModel: { id: "makerModel", label: { en: "Maker & model", hi: "निर्माता व मॉडल", bn: "প্রস্তুতকারক ও মডেল", ta: "தயாரிப்பாளர் & மாடல்" } },
  dlNumber: { id: "dlNumber", label: { en: "Licence number", hi: "लाइसेंस संख्या", bn: "লাইসেন্স নম্বর", ta: "உரிம எண்" }, placeholder: "UP78 2019 0001234" },
  propertyId: { id: "propertyId", label: { en: "Property ID", hi: "संपत्ति आईडी", bn: "সম্পত্তি আইডি", ta: "சொத்து ஐடி" }, placeholder: "PID-0392-KNP" },
  khasra: { id: "khasra", label: { en: "Khasra / Khata no.", hi: "खसरा / खाता संख्या", bn: "খসরা / খাতা নম্বর", ta: "கஸ்ரா / காதா எண்" } },
  consumerNo: { id: "consumerNo", label: { en: "Consumer number", hi: "उपभोक्ता संख्या", bn: "গ্রাহক নম্বর", ta: "நுகர்வோர் எண்" } },
  mcpNo: { id: "mcpNo", label: { en: "MCP card number", hi: "एमसीपी कार्ड संख्या", bn: "এমসিপি কার্ড নম্বর", ta: "எம்சிபி அட்டை எண்" } },
  lmp: { id: "lmp", label: { en: "Last menstrual period (LMP)", hi: "अंतिम माहवारी तिथि (LMP)", bn: "শেষ ঋতুস্রাবের তারিখ (LMP)", ta: "கடைசி மாதவிடாய் தேதி (LMP)" }, placeholder: "DD / MM / YYYY" },
  childName: { id: "childName", label: { en: "Child's name", hi: "बच्चे का नाम", bn: "শিশুর নাম", ta: "குழந்தையின் பெயர்" } },
  institution: { id: "institution", label: { en: "Institution", hi: "संस्थान", bn: "প্রতিষ্ঠান", ta: "நிறுவனம்" } },
  course: { id: "course", label: { en: "Course / Class", hi: "पाठ्यक्रम / कक्षा", bn: "কোর্স / শ্রেণি", ta: "பாடநெறி / வகுப்பு" } },
  admissionYear: { id: "admissionYear", label: { en: "Year of admission", hi: "प्रवेश वर्ष", bn: "ভর্তির বছর", ta: "சேர்க்கை ஆண்டு" } },
  rollNo: { id: "rollNo", label: { en: "Roll number", hi: "अनुक्रमांक", bn: "রোল নম্বর", ta: "பதிவு எண்" } },
  examYear: { id: "examYear", label: { en: "Year of passing", hi: "उत्तीर्ण वर्ष", bn: "উত্তীর্ণের বছর", ta: "தேர்ச்சி ஆண்டு" } },
  board: { id: "board", label: { en: "Board / University", hi: "बोर्ड / विश्वविद्यालय", bn: "বোর্ড / বিশ্ববিদ্যালয়", ta: "வாரியம் / பல்கலைக்கழகம்" } },
  businessName: { id: "businessName", label: { en: "Business name", hi: "व्यवसाय का नाम", bn: "ব্যবসার নাম", ta: "வணிகப் பெயர்" } },
  businessType: { id: "businessType", label: { en: "Business activity", hi: "व्यवसाय गतिविधि", bn: "ব্যবসার ধরন", ta: "வணிக நடவடிக்கை" } },
  loanCategory: { id: "loanCategory", label: { en: "Loan category", hi: "ऋण श्रेणी", bn: "ঋণের শ্রেণি", ta: "கடன் வகை" }, type: "select", options: ["Shishu (up to ₹50k)", "Kishore (₹50k–5L)", "Tarun (₹5L–10L)"] },
  loanAmount: { id: "loanAmount", label: { en: "Loan amount (₹)", hi: "ऋण राशि (₹)", bn: "ঋণের পরিমাণ (₹)", ta: "கடன் தொகை (₹)" } },
  trade: { id: "trade", label: { en: "Trade", hi: "व्यवसाय/शिल्प", bn: "পেশা/শিল্প", ta: "தொழில்/கைவினை" }, type: "select", options: ["Carpenter", "Tailor", "Potter", "Blacksmith", "Goldsmith", "Cobbler", "Mason", "Barber"] },
  pensionAmount: { id: "pensionAmount", label: { en: "Pension amount", hi: "पेंशन राशि", bn: "পেনশনের পরিমাণ", ta: "ஓய்வூதியத் தொகை" }, type: "select", options: ["₹1,000", "₹2,000", "₹3,000", "₹4,000", "₹5,000"] },
  depositAmount: { id: "depositAmount", label: { en: "Opening deposit (₹)", hi: "प्रारंभिक जमा (₹)", bn: "প্রারম্ভিক জমা (₹)", ta: "தொடக்க வைப்பு (₹)" }, placeholder: "≥ ₹250" },
  subject: { id: "subject", label: { en: "Subject", hi: "विषय", bn: "বিষয়", ta: "பொருள்" } },
  description: { id: "description", label: { en: "Description", hi: "विवरण", bn: "বিবরণ", ta: "விவரம்" } },
  rating: { id: "rating", label: { en: "Your rating", hi: "आपकी रेटिंग", bn: "আপনার রেটিং", ta: "உங்கள் மதிப்பீடு" }, type: "select", options: ["Excellent", "Good", "Average", "Poor"] },
  sector: { id: "sector", label: { en: "Sector", hi: "क्षेत्र", bn: "ক্ষেত্র", ta: "துறை" } },
  hospital: { id: "hospital", label: { en: "Hospital", hi: "अस्पताल", bn: "হাসপাতাল", ta: "மருத்துவமனை" } },
  hospDept: { id: "hospDept", label: { en: "Department", hi: "विभाग", bn: "বিভাগ", ta: "பிரிவு" }, type: "select", options: ["General Medicine", "Paediatrics", "Orthopaedics", "Gynaecology", "Cardiology"] },
  slot: { id: "slot", label: { en: "Appointment slot", hi: "अपॉइंटमेंट स्लॉट", bn: "অ্যাপয়েন্টমেন্ট স্লট", ta: "சந்திப்பு நேரம்" }, type: "select", options: ["Today 10:00–11:00", "Tomorrow 09:00–10:00", "Tomorrow 16:00–17:00"] },
  package: { id: "package", label: { en: "Check-up package", hi: "जाँच पैकेज", bn: "পরীক্ষার প্যাকেজ", ta: "பரிசோதனை தொகுப்பு" }, type: "select", options: ["General wellness", "Diabetes profile", "Heart profile", "Full body"] },
  assessYear: { id: "assessYear", label: { en: "Assessment year", hi: "निर्धारण वर्ष", bn: "মূল্যায়ন বছর", ta: "மதிப்பீட்டு ஆண்டு" }, type: "select", options: ["AY 2026–27", "AY 2025–26"] },
  itrForm: { id: "itrForm", label: { en: "ITR form", hi: "आईटीआर फॉर्म", bn: "আইটিআর ফর্ম", ta: "ஐடிஆர் படிவம்" }, type: "select", options: ["ITR-1 (Sahaj)", "ITR-2", "ITR-3", "ITR-4 (Sugam)"] },
  grossIncome: { id: "grossIncome", label: { en: "Gross total income (₹)", hi: "सकल कुल आय (₹)", bn: "মোট আয় (₹)", ta: "மொத்த வருமானம் (₹)" } },
  deductions: { id: "deductions", label: { en: "Deductions (80C etc.)", hi: "कटौतियाँ (80C आदि)", bn: "ছাড় (80C ইত্যাদি)", ta: "கழிவுகள் (80C முதலியன)" } },
  billerCategory: { id: "billerCategory", label: { en: "Bill type", hi: "बिल प्रकार", bn: "বিলের ধরন", ta: "கட்டண வகை" }, type: "select", options: ["Electricity", "Water", "Piped gas", "Broadband"] },
  biller: { id: "biller", label: { en: "Biller / Board", hi: "बिलर / बोर्ड", bn: "বিলার / বোর্ড", ta: "பில்லர் / வாரியம்" } },
  newMobile: { id: "newMobile", label: { en: "New mobile number", hi: "नया मोबाइल नंबर", bn: "নতুন মোবাইল নম্বর", ta: "புதிய மொபைல் எண்" }, placeholder: "98765 43210" },
  centre: { id: "centre", label: { en: "Aadhaar Seva Kendra", hi: "आधार सेवा केंद्र", bn: "আধার সেবা কেন্দ্র", ta: "ஆதார் சேவை மையம்" }, type: "select", options: ["Kanpur — Mall Road", "Kanpur — Kakadeo", "Kanpur — Govind Nagar"] },
  apptDate: { id: "apptDate", label: { en: "Appointment date", hi: "अपॉइंटमेंट तिथि", bn: "অ্যাপয়েন্টমেন্টের তারিখ", ta: "சந்திப்புத் தேதி" }, type: "select", options: ["Mon, 1 Jun", "Tue, 2 Jun", "Wed, 3 Jun"] },
  transferBasis: { id: "transferBasis", label: { en: "Basis of transfer", hi: "हस्तांतरण का आधार", bn: "হস্তান্তরের ভিত্তি", ta: "மாற்றத்தின் அடிப்படை" }, type: "select", options: ["Sale", "Inheritance", "Gift"] },
  newOwner: { id: "newOwner", label: { en: "New owner's name", hi: "नए मालिक का नाम", bn: "নতুন মালিকের নাম", ta: "புதிய உரிமையாளர் பெயர்" } },
  education: { id: "education", label: { en: "Highest education", hi: "उच्चतम शिक्षा", bn: "সর্বোচ্চ শিক্ষা", ta: "உயர் கல்வி" } },
  experience: { id: "experience", label: { en: "Work experience", hi: "कार्य अनुभव", bn: "কাজের অভিজ্ঞতা", ta: "பணி அனுபவம்" } },
  jobRole: { id: "jobRole", label: { en: "Preferred role", hi: "वांछित भूमिका", bn: "পছন্দের ভূমিকা", ta: "விரும்பிய பணி" } },
  familyCount: { id: "familyCount", label: { en: "Adults in household", hi: "परिवार में वयस्क", bn: "পরিবারে প্রাপ্তবয়স্ক", ta: "குடும்பத்தில் பெரியவர்கள்" } },
  panchayat: { id: "panchayat", label: { en: "Gram Panchayat", hi: "ग्राम पंचायत", bn: "গ্রাম পঞ্চায়েত", ta: "கிராம பஞ்சாயத்து" } },
  ministry: { id: "ministry", label: { en: "Department / Ministry", hi: "विभाग / मंत्रालय", bn: "দপ্তর / মন্ত্রণালয়", ta: "துறை / அமைச்சகம்" } },
  regNo: { id: "regNo", label: { en: "Registration number", hi: "पंजीकरण संख्या", bn: "নিবন্ধন নম্বর", ta: "பதிவு எண்" } },
  examName: { id: "examName", label: { en: "Examination", hi: "परीक्षा", bn: "পরীক্ষা", ta: "தேர்வு" }, type: "select", options: ["JEE Main 2027 · Session 1", "NEET (UG) 2027", "CUET (UG) 2027"] },
  boardExam: { id: "boardExam", label: { en: "Exam type", hi: "परीक्षा का प्रकार", bn: "পরীক্ষার ধরন", ta: "தேர்வு வகை" }, type: "select", options: ["Class X · Private", "Class XII · Private", "Supplementary / Compartment"] },
  sscExam: { id: "sscExam", label: { en: "Examination", hi: "परीक्षा", bn: "পরীক্ষা", ta: "தேர்வு" }, type: "select", options: ["SSC CGL 2027", "SSC CHSL 2027", "SSC GD Constable 2027"] },
  examCity1: { id: "examCity1", label: { en: "Exam city · 1st choice", hi: "परीक्षा शहर · पहली पसंद", bn: "পরীক্ষার শহর · প্রথম পছন্দ", ta: "தேர்வு நகரம் · முதல் விருப்பம்" }, type: "select", options: ["Kanpur", "Lucknow", "Prayagraj", "Agra"] },
  examCity2: { id: "examCity2", label: { en: "Exam city · 2nd choice", hi: "परीक्षा शहर · दूसरी पसंद", bn: "পরীক্ষার শহর · দ্বিতীয় পছন্দ", ta: "தேர்வு நகரம் · இரண்டாம் விருப்பம்" }, type: "select", options: ["Lucknow", "Kanpur", "Varanasi", "Delhi"] },
  qualifying: { id: "qualifying", label: { en: "Qualifying exam status", hi: "योग्यता परीक्षा की स्थिति", bn: "যোগ্যতা পরীক্ষার অবস্থা", ta: "தகுதித் தேர்வு நிலை" }, type: "select", options: ["Appearing in Class XII", "Passed Class XII"] },
  subjects: { id: "subjects", label: { en: "Subjects", hi: "विषय", bn: "বিষয়", ta: "பாடங்கள்" }, type: "select", options: ["Physics, Chemistry, Maths", "Physics, Chemistry, Biology", "Commerce", "Humanities"] },
  revalSubject: { id: "revalSubject", label: { en: "Subject for re-evaluation", hi: "पुनर्मूल्यांकन हेतु विषय", bn: "পুনর্মূল্যায়নের বিষয়", ta: "மறுமதிப்பீட்டுப் பாடம்" }, type: "select", options: ["Mathematics", "Physics", "English", "Hindi"] },
  applicationNo: { id: "applicationNo", label: { en: "Application number", hi: "आवेदन संख्या", bn: "আবেদন নম্বর", ta: "விண்ணப்ப எண்" }, placeholder: "270410XXXXXX" },
  bloodGroup: { id: "bloodGroup", label: { en: "Blood group", hi: "रक्त समूह", bn: "রক্তের গ্রুপ", ta: "இரத்த வகை" }, type: "select", options: ["A+", "B+", "O+", "AB+", "A−", "B−", "O−", "AB−"] },
  rto: { id: "rto", label: { en: "RTO", hi: "आरटीओ", bn: "আরটিও", ta: "RTO" }, type: "select", options: ["UP-78 Kanpur Nagar", "UP-77 Kanpur Dehat", "UP-32 Lucknow"] },
  llSlot: { id: "llSlot", label: { en: "Online test slot", hi: "ऑनलाइन टेस्ट स्लॉट", bn: "অনলাইন টেস্ট স্লট", ta: "ஆன்லைன் தேர்வு நேரம்" }, type: "select", options: ["Today · 4:00 PM", "Tomorrow · 11:00 AM", "Tomorrow · 3:00 PM"] },
  llClass: { id: "llClass", label: { en: "Licence class", hi: "लाइसेंस श्रेणी", bn: "লাইসেন্স শ্রেণি", ta: "உரிம வகை" }, type: "select", options: ["MCWG · Motorcycle with gear", "LMV · Car", "MCWG + LMV"] },
  duplicateReason: { id: "duplicateReason", label: { en: "Reason", hi: "कारण", bn: "কারণ", ta: "காரணம்" }, type: "select", options: ["Lost", "Damaged / torn", "Stolen"] },
  fitment: { id: "fitment", label: { en: "Fitment", hi: "फ़िटमेंट", bn: "ফিটমেন্ট", ta: "பொருத்துதல்" }, type: "select", options: ["At dealer · Civil Lines", "Home fitment (+₹200)"] },
  chassisLast5: { id: "chassisLast5", label: { en: "Last 5 digits of chassis no.", hi: "चेसिस संख्या के अंतिम 5 अंक", bn: "চ্যাসিস নম্বরের শেষ ৫ অঙ্ক", ta: "சேஸிஸ் எண்ணின் கடைசி 5 இலக்கங்கள்" }, placeholder: "48213" },
} satisfies Record<string, ApplyField>;

/* ---- readout (pre-fetched) field atoms — display only ---- */

const RO = {
  ownerName: { id: "ro_owner", type: "readout" as FieldType, label: { en: "Owner", hi: "स्वामी", bn: "মালিক", ta: "உரிமையாளர்" } },
  holderName: { id: "ro_holder", type: "readout" as FieldType, label: { en: "Name on record", hi: "रिकॉर्ड में नाम", bn: "রেকর্ডে নাম", ta: "பதிவில் பெயர்" } },
  validUpto: { id: "ro_valid", type: "readout" as FieldType, label: { en: "Valid up to", hi: "वैध तिथि तक", bn: "বৈধ যতদিন", ta: "செல்லுபடியாகும் வரை" } },
  vehicleClass: { id: "ro_cov", type: "readout" as FieldType, label: { en: "Class of vehicle", hi: "वाहन श्रेणी", bn: "যানবাহন শ্রেণি", ta: "வாகன வகை" } },
  assessedValue: { id: "ro_assessed", type: "readout" as FieldType, label: { en: "Assessed value", hi: "निर्धारित मूल्य", bn: "নির্ধারিত মূল্য", ta: "மதிப்பிடப்பட்ட மதிப்பு" } },
  duesAmount: { id: "ro_dues", type: "readout" as FieldType, label: { en: "Amount due", hi: "देय राशि", bn: "বকেয়া পরিমাণ", ta: "செலுத்த வேண்டிய தொகை" } },
  billAmount: { id: "ro_bill", type: "readout" as FieldType, label: { en: "Bill amount", hi: "बिल राशि", bn: "বিলের পরিমাণ", ta: "கட்டணத் தொகை" } },
  dueDate: { id: "ro_due", type: "readout" as FieldType, label: { en: "Due date", hi: "देय तिथि", bn: "শেষ তারিখ", ta: "கடைசி தேதி" } },
  pendingChallans: { id: "ro_chal", type: "readout" as FieldType, label: { en: "Pending challans", hi: "लंबित चालान", bn: "বকেয়া চালান", ta: "நிலுவை அபராதங்கள்" } },
  challanTotal: { id: "ro_chaltot", type: "readout" as FieldType, label: { en: "Total payable", hi: "कुल देय", bn: "মোট প্রদেয়", ta: "மொத்தம் செலுத்த வேண்டியது" } },
  taxPayable: { id: "ro_tax", type: "readout" as FieldType, label: { en: "Tax payable", hi: "देय कर", bn: "প্রদেয় কর", ta: "செலுத்த வேண்டிய வரி" } },
  eligibility: { id: "ro_elig", type: "readout" as FieldType, label: { en: "Eligibility", hi: "पात्रता", bn: "যোগ্যতা", ta: "தகுதி" } },
  recordFound: { id: "ro_rec", type: "readout" as FieldType, label: { en: "Record found", hi: "रिकॉर्ड मिला", bn: "রেকর্ড পাওয়া গেছে", ta: "பதிவு கிடைத்தது" } },
  status: { id: "ro_status", type: "readout" as FieldType, label: { en: "Current status", hi: "वर्तमान स्थिति", bn: "বর্তমান অবস্থা", ta: "தற்போதைய நிலை" } },
  rcVehicle: { id: "ro_rcveh", type: "readout" as FieldType, label: { en: "Vehicle", hi: "वाहन", bn: "যানবাহন", ta: "வாகனம்" } },
  pucValid: { id: "ro_puc", type: "readout" as FieldType, label: { en: "PUC valid up to", hi: "पीयूसी वैध तिथि", bn: "পিইউসি বৈধ যতদিন", ta: "பியூசி செல்லுபடி" } },
  examCentre: { id: "ro_centre", type: "readout" as FieldType, label: { en: "Exam centre", hi: "परीक्षा केंद्र", bn: "পরীক্ষা কেন্দ্র", ta: "தேர்வு மையம்" } },
  examDate: { id: "ro_examdate", type: "readout" as FieldType, label: { en: "Date & shift", hi: "तिथि व पाली", bn: "তারিখ ও শিফট", ta: "தேதி & ஷிஃப்ட்" } },
  marks: { id: "ro_marks", type: "readout" as FieldType, label: { en: "Marks awarded", hi: "प्राप्त अंक", bn: "প্রাপ্ত নম্বর", ta: "பெற்ற மதிப்பெண்" } },
} satisfies Record<string, ApplyField>;

/* ============================================ localized step titles === */

const S = {
  identity: { en: "Identity & Aadhaar", hi: "पहचान व आधार", bn: "পরিচয় ও আধার", ta: "அடையாளம் & ஆதார்" },
  applicant: { en: "Applicant details", hi: "आवेदक का विवरण", bn: "আবেদনকারীর বিবরণ", ta: "விண்ணப்பதாரர் விவரம்" },
  personal: { en: "Personal details", hi: "व्यक्तिगत विवरण", bn: "ব্যক্তিগত বিবরণ", ta: "தனிப்பட்ட விவரம்" },
  family: { en: "Family details", hi: "परिवार का विवरण", bn: "পরিবারের বিবরণ", ta: "குடும்ப விவரம்" },
  addr: { en: "Address", hi: "पता", bn: "ঠিকানা", ta: "முகவரி" },
  bank: { en: "Bank details", hi: "बैंक विवरण", bn: "ব্যাঙ্ক বিবরণ", ta: "வங்கி விவரம்" },
  eligibility: { en: "Eligibility check", hi: "पात्रता जाँच", bn: "যোগ্যতা যাচাই", ta: "தகுதி சரிபார்ப்பு" },
  ekyc: { en: "e-KYC", hi: "ई-केवाईसी", bn: "ই-কেওয়াইসি", ta: "மின்-கேஒய்சி" },
  verify: { en: "Verify identity", hi: "पहचान सत्यापित करें", bn: "পরিচয় যাচাই করুন", ta: "அடையாளம் சரிபார்க்கவும்" },
  payment: { en: "Payment", hi: "भुगतान", bn: "পরিশোধ", ta: "கட்டணம்" },
  vehicle: { en: "Vehicle details", hi: "वाहन विवरण", bn: "যানবাহন বিবরণ", ta: "வாகன விவரம்" },
  property: { en: "Property details", hi: "संपत्ति विवरण", bn: "সম্পত্তির বিবরণ", ta: "சொத்து விவரம்" },
  nominee: { en: "Nominee", hi: "नामिती", bn: "নমিনি", ta: "வாரிசுதாரர்" },
  academic: { en: "Academic details", hi: "शैक्षणिक विवरण", bn: "শিক্ষাগত বিবরণ", ta: "கல்வி விவரம்" },
  incomeCat: { en: "Income & category", hi: "आय व श्रेणी", bn: "আয় ও শ্রেণি", ta: "வருமானம் & பிரிவு" },
  loan: { en: "Loan details", hi: "ऋण विवरण", bn: "ঋণের বিবরণ", ta: "கடன் விவரம்" },
  complaint: { en: "Complaint details", hi: "शिकायत विवरण", bn: "অভিযোগের বিবরণ", ta: "புகார் விவரம்" },
  pregnancy: { en: "Pregnancy details", hi: "गर्भावस्था विवरण", bn: "গর্ভাবস্থার বিবরণ", ta: "கர்ப்ப விவரம்" },
  child: { en: "Child's details", hi: "बच्चे का विवरण", bn: "শিশুর বিবরণ", ta: "குழந்தையின் விவரம்" },
  scheme: { en: "Scheme details", hi: "योजना विवरण", bn: "প্রকল্পের বিবরণ", ta: "திட்ட விவரம்" },
  account: { en: "Account details", hi: "खाता विवरण", bn: "অ্যাকাউন্ট বিবরণ", ta: "கணக்கு விவரம்" },
  certificate: { en: "Certificate details", hi: "प्रमाणपत्र विवरण", bn: "সনদের বিবরণ", ta: "சான்றிதழ் விவரம்" },
  lookup: { en: "Find your record", hi: "अपना रिकॉर्ड खोजें", bn: "আপনার রেকর্ড খুঁজুন", ta: "உங்கள் பதிவைத் தேடுங்கள்" },
  transfer: { en: "Transfer details", hi: "हस्तांतरण विवरण", bn: "হস্তান্তরের বিবরণ", ta: "மாற்ற விவரம்" },
  appointment: { en: "Appointment", hi: "अपॉइंटमेंट", bn: "অ্যাপয়েন্টমেন্ট", ta: "சந்திப்பு" },
  return: { en: "Income & tax", hi: "आय व कर", bn: "আয় ও কর", ta: "வருமானம் & வரி" },
  feedback: { en: "Your feedback", hi: "आपकी प्रतिक्रिया", bn: "আপনার মতামত", ta: "உங்கள் கருத்து" },
  jobseeker: { en: "Jobseeker profile", hi: "नौकरी प्रोफ़ाइल", bn: "চাকরিপ্রার্থীর প্রোফাইল", ta: "வேலைதேடுவோர் சுயவிவரம்" },
  exam: { en: "Exam & centre", hi: "परीक्षा व केंद्र", bn: "পরীক্ষা ও কেন্দ্র", ta: "தேர்வு & மையம்" },
  education2: { en: "Qualifying education", hi: "योग्यता शिक्षा", bn: "যোগ্যতাসূচক শিক্ষা", ta: "தகுதிக் கல்வி" },
  test: { en: "Learner's test", hi: "लर्नर टेस्ट", bn: "লার্নার টেস্ট", ta: "பழகுநர் தேர்வு" },
  rc: { en: "Registration certificate", hi: "पंजीकरण प्रमाणपत्र", bn: "নিবন্ধন সনদ", ta: "பதிவுச் சான்றிதழ்" },
  buyer: { en: "Buyer details", hi: "खरीदार का विवरण", bn: "ক্রেতার বিবরণ", ta: "வாங்குபவர் விவரம்" },
  plate: { en: "Plate & fitment", hi: "प्लेट व फ़िटमेंट", bn: "প্লেট ও ফিটমেন্ট", ta: "தகடு & பொருத்துதல்" },
  paper: { en: "Paper details", hi: "प्रश्नपत्र विवरण", bn: "প্রশ্নপত্রের বিবরণ", ta: "தாள் விவரம்" },
} satisfies Record<string, L>;

/* ============================================ localized document atoms === */

const D = {
  aadhaar: { en: "Aadhaar card", hi: "आधार कार्ड", bn: "আধার কার্ড", ta: "ஆதார் அட்டை" },
  pan: { en: "PAN card", hi: "पैन कार्ड", bn: "প্যান কার্ড", ta: "பான் கார்டு" },
  photo: { en: "Passport-size photo", hi: "पासपोर्ट साइज़ फ़ोटो", bn: "পাসপোর্ট সাইজ ছবি", ta: "பாஸ்போர்ட் அளவு புகைப்படம்" },
  bankPassbook: { en: "Bank passbook", hi: "बैंक पासबुक", bn: "ব্যাঙ্ক পাসবই", ta: "வங்கி பாஸ்புக்" },
  incomeProof: { en: "Income certificate", hi: "आय प्रमाणपत्र", bn: "আয়ের সনদ", ta: "வருமானச் சான்றிதழ்" },
  casteProof: { en: "Caste certificate", hi: "जाति प्रमाणपत्र", bn: "জাতি সনদ", ta: "சாதிச் சான்றிதழ்" },
  fatherCaste: { en: "Father's caste certificate", hi: "पिता का जाति प्रमाणपत्र", bn: "বাবার জাতি সনদ", ta: "தந்தையின் சாதிச் சான்றிதழ்" },
  landRecord: { en: "Land record (Khasra/Khatauni)", hi: "भूमि अभिलेख (खसरा/खतौनी)", bn: "জমির রেকর্ড (খসরা/খতিয়ান)", ta: "நில பதிவு (கஸ்ரா/கதௌனி)" },
  rationCard: { en: "Ration card", hi: "राशन कार्ड", bn: "রেশন কার্ড", ta: "ரேஷன் கார்டு" },
  addressProof: { en: "Address proof", hi: "पता प्रमाण", bn: "ঠিকানার প্রমাণ", ta: "முகவரிச் சான்று" },
  birthCert: { en: "Birth certificate", hi: "जन्म प्रमाणपत्र", bn: "জন্ম সনদ", ta: "பிறப்புச் சான்றிதழ்" },
  medical1A: { en: "Medical certificate (Form 1A)", hi: "चिकित्सा प्रमाणपत्र (फॉर्म 1A)", bn: "মেডিকেল সনদ (ফর্ম 1A)", ta: "மருத்துவச் சான்றிதழ் (படிவம் 1A)" },
  form9: { en: "Application Form 9", hi: "आवेदन फॉर्म 9", bn: "আবেদন ফর্ম 9", ta: "விண்ணப்பப் படிவம் 9" },
  oldDl: { en: "Existing driving licence", hi: "मौजूदा ड्राइविंग लाइसेंस", bn: "বিদ্যমান ড্রাইভিং লাইসেন্স", ta: "தற்போதைய ஓட்டுநர் உரிமம்" },
  marksheet: { en: "Latest marksheet", hi: "नवीनतम अंकपत्र", bn: "সর্বশেষ মার্কশিট", ta: "சமீபத்திய மதிப்பெண் பட்டியல்" },
  bonafide: { en: "Bonafide certificate", hi: "बोनाफाइड प्रमाणपत्र", bn: "বোনাফাইড সনদ", ta: "போனாஃபைடு சான்றிதழ்" },
  saleDeed: { en: "Sale deed", hi: "बिक्री विलेख", bn: "বিক্রয় দলিল", ta: "விற்பனை பத்திரம்" },
  insurance: { en: "Insurance certificate", hi: "बीमा प्रमाणपत्र", bn: "বিমা সনদ", ta: "காப்பீட்டுச் சான்றிதழ்" },
  puc: { en: "PUC certificate", hi: "पीयूसी प्रमाणपत्र", bn: "পিইউসি সনদ", ta: "பியூசி சான்றிதழ்" },
  form20: { en: "Form 20 (registration)", hi: "फॉर्म 20 (पंजीकरण)", bn: "ফর্ম 20 (নিবন্ধন)", ta: "படிவம் 20 (பதிவு)" },
  invoice: { en: "Dealer invoice", hi: "डीलर चालान", bn: "ডিলার ইনভয়েস", ta: "டீலர் விலைப்பட்டியல்" },
  mcpCard: { en: "MCP card", hi: "एमसीपी कार्ड", bn: "এমসিপি কার্ড", ta: "எம்சிபி அட்டை" },
  deathCert: { en: "Death certificate", hi: "मृत्यु प्रमाणपत्र", bn: "মৃত্যু সনদ", ta: "இறப்புச் சான்றிதழ்" },
  salarySlip: { en: "Salary slip / self-declaration", hi: "वेतन पर्ची / स्व-घोषणा", bn: "বেতন স্লিপ / স্ব-ঘোষণা", ta: "சம்பள சீட்டு / சுய அறிவிப்பு" },
  form16: { en: "Form 16", hi: "फॉर्म 16", bn: "ফর্ম 16", ta: "படிவம் 16" },
  educationProof: { en: "Education proof", hi: "शिक्षा प्रमाण", bn: "শিক্ষার প্রমাণ", ta: "கல்விச் சான்று" },
  signature: { en: "Scanned signature", hi: "स्कैन किया हस्ताक्षर", bn: "স্ক্যান করা স্বাক্ষর", ta: "ஸ்கேன் செய்த கையொப்பம்" },
  classX: { en: "Class X certificate (date of birth)", hi: "कक्षा 10 प्रमाणपत्र (जन्म तिथि)", bn: "দশম শ্রেণির সনদ (জন্ম তারিখ)", ta: "10ஆம் வகுப்புச் சான்றிதழ் (பிறந்த தேதி)" },
  pwdCert: { en: "Disability certificate (if applicable)", hi: "दिव्यांगता प्रमाणपत्र (यदि लागू)", bn: "প্রতিবন্ধী সনদ (প্রযোজ্য হলে)", ta: "மாற்றுத்திறன் சான்றிதழ் (பொருந்தினால்)" },
  rcCopy: { en: "Registration certificate (RC)", hi: "पंजीकरण प्रमाणपत्र (आरसी)", bn: "নিবন্ধন সনদ (আরসি)", ta: "பதிவுச் சான்றிதழ் (RC)" },
  form2930: { en: "Forms 29 & 30 (transfer)", hi: "फॉर्म 29 व 30 (हस्तांतरण)", bn: "ফর্ম ২৯ ও ৩০ (হস্তান্তর)", ta: "படிவங்கள் 29 & 30 (மாற்றம்)" },
  form26: { en: "Form 26 (duplicate RC)", hi: "फॉर्म 26 (डुप्लीकेट आरसी)", bn: "ফর্ম ২৬ (ডুপ্লিকেট আরসি)", ta: "படிவம் 26 (நகல் RC)" },
  policeReport: { en: "Police report (if lost or stolen)", hi: "पुलिस रिपोर्ट (खोने या चोरी पर)", bn: "পুলিশ রিপোর্ট (হারালে বা চুরি হলে)", ta: "காவல் அறிக்கை (தொலைந்தால் / திருடப்பட்டால்)" },
  form2: { en: "Form 2 (learner's licence)", hi: "फॉर्म 2 (लर्नर लाइसेंस)", bn: "ফর্ম ২ (লার্নার লাইসেন্স)", ta: "படிவம் 2 (பழகுநர் உரிமம்)" },
} satisfies Record<string, L>;

/* ===================================================== timeline atoms === */

const T = {
  instant: { en: "Instant", hi: "तुरंत", bn: "তৎক্ষণাৎ", ta: "உடனடி" },
  sameDay: { en: "Same day", hi: "उसी दिन", bn: "একই দিনে", ta: "அதே நாள்" },
  d3: { en: "3–5 days", hi: "3–5 दिन", bn: "3–5 দিন", ta: "3–5 நாட்கள்" },
  d7: { en: "7–10 days", hi: "7–10 दिन", bn: "7–10 দিন", ta: "7–10 நாட்கள்" },
  d15: { en: "~15 days", hi: "लगभग 15 दिन", bn: "প্রায় 15 দিন", ta: "சுமார் 15 நாட்கள்" },
  d30: { en: "~30 days", hi: "लगभग 30 दिन", bn: "প্রায় 30 দিন", ta: "சுமார் 30 நாட்கள்" },
  cycle: { en: "Next disbursement cycle", hi: "अगले संवितरण चक्र में", bn: "পরবর্তী বিতরণ চক্রে", ta: "அடுத்த விநியோக சுழற்சியில்" },
  schedule: { en: "As per the exam calendar", hi: "परीक्षा कैलेंडर के अनुसार", bn: "পরীক্ষার ক্যালেন্ডার অনুযায়ী", ta: "தேர்வு அட்டவணைப்படி" },
} satisfies Record<string, L>;

/* ====================================================== departments === */

const DEPT = {
  revenue: { en: "Revenue Department", hi: "राजस्व विभाग", bn: "রাজস্ব দপ্তর", ta: "வருவாய்த் துறை" },
  uidai: { en: "UIDAI", hi: "यूआईडीएआई", bn: "ইউআইডিএআই", ta: "யுஐடிஏஐ" },
  municipal: { en: "Municipal Corporation", hi: "नगर निगम", bn: "পৌর নিগম", ta: "நகராட்சி" },
  transport: { en: "Transport Department (RTO)", hi: "परिवहन विभाग (आरटीओ)", bn: "পরিবহন দপ্তর (আরটিও)", ta: "போக்குவரத்துத் துறை (RTO)" },
  incomeTax: { en: "Income Tax Department", hi: "आयकर विभाग", bn: "আয়কর দপ্তর", ta: "வருமான வரித் துறை" },
  education: { en: "Department of Education", hi: "शिक्षा विभाग", bn: "শিক্ষা দপ্তর", ta: "கல்வித் துறை" },
  health: { en: "Department of Health", hi: "स्वास्थ्य विभाग", bn: "স্বাস্থ্য দপ্তর", ta: "சுகாதாரத் துறை" },
  labour: { en: "Department of Labour", hi: "श्रम विभाग", bn: "শ্রম দপ্তর", ta: "தொழிலாளர் துறை" },
  rural: { en: "Ministry of Rural Development", hi: "ग्रामीण विकास मंत्रालय", bn: "গ্রামীণ উন্নয়ন মন্ত্রণালয়", ta: "ஊரக வளர்ச்சி அமைச்சகம்" },
  finance: { en: "Ministry of Finance", hi: "वित्त मंत्रालय", bn: "অর্থ মন্ত্রণালয়", ta: "நிதி அமைச்சகம்" },
  social: { en: "Social Welfare Department", hi: "समाज कल्याण विभाग", bn: "সমাজকল্যাণ দপ্তর", ta: "சமூக நலத் துறை" },
  power: { en: "Utility / Service Provider", hi: "उपयोगिता / सेवा प्रदाता", bn: "ইউটিলিটি / পরিষেবা প্রদানকারী", ta: "பயன்பாடு / சேவை வழங்குநர்" },
  admin: { en: "Dept. of Administrative Reforms", hi: "प्रशासनिक सुधार विभाग", bn: "প্রশাসনিক সংস্কার দপ্তর", ta: "நிர்வாக சீர்திருத்தத் துறை" },
  nta: { en: "National Testing Agency", hi: "राष्ट्रीय परीक्षा एजेंसी", bn: "ন্যাশনাল টেস্টিং এজেন্সি", ta: "தேசியத் தேர்வு முகமை" },
  board: { en: "State Board of Secondary Education", hi: "राज्य माध्यमिक शिक्षा बोर्ड", bn: "রাজ্য মাধ্যমিক শিক্ষা পর্ষদ", ta: "மாநில இடைநிலைக் கல்வி வாரியம்" },
  ssc: { en: "Staff Selection Commission", hi: "कर्मचारी चयन आयोग", bn: "স্টাফ সিলেকশন কমিশন", ta: "பணியாளர் தேர்வாணையம்" },
} satisfies Record<string, L>;

/* ===================================== reusable "personal details" voice === */

const PERSONAL_VOICE: StepVoice = {
  transcript: {
    en: "I'm Rakesh Verma, mobile 98765 43210, from 14 Civil Lines, Kanpur.",
    hi: "मैं राकेश वर्मा, मोबाइल 98765 43210, 14 सिविल लाइन्स, कानपुर से।",
    bn: "আমি রাকেশ ভার্মা, মোবাইল 98765 43210, 14 সিভিল লাইনস, কানপুর থেকে।",
    ta: "நான் ரகேஷ் வர்மா, மொபைல் 98765 43210, 14 சிவில் லைன்ஸ், கான்பூர்.",
  },
  extract: {
    fullName: { en: "Rakesh Verma", hi: "राकेश वर्मा", bn: "রাকেশ ভার্মা", ta: "ரகேஷ் வர்மா" },
    mobile: { en: "98765 43210", hi: "98765 43210", bn: "98765 43210", ta: "98765 43210" },
    address: { en: "14 Civil Lines, Kanpur", hi: "14 सिविल लाइन्स, कानपुर", bn: "14 সিভিল লাইনস, কানপুর", ta: "14 சிவில் லைன்ஸ், கான்பூர்" },
  },
};

const ro = (atom: ApplyField, value: string): ApplyField => ({ ...atom, value });

/* ========================================= the hero: birth certificate === */

const BIRTH_CERTIFICATE: ApplyFlow = {
  id: "birthCertificate",
  kind: "apply",
  service: { en: "Birth Certificate", hi: "जन्म प्रमाणपत्र", bn: "জন্ম সনদ", ta: "பிறப்புச் சான்றிதழ்" },
  portal: "e-District",
  department: { en: "Nagar Nigam (Municipal)", hi: "नगर निगम", bn: "নগর নিগম", ta: "நகர நிகம்" },
  intro: {
    en: "Register your newborn and get the certificate.",
    hi: "अपने नवजात का पंजीकरण करें और प्रमाणपत्र पाएं।",
    bn: "আপনার নবজাতককে নিবন্ধন করে সনদ পান।",
    ta: "உங்கள் குழந்தையைப் பதிவு செய்து சான்றிதழைப் பெறுங்கள்.",
  },
  timeline: T.d7,
  fee: "₹30",
  documents: [D.aadhaar, D.addressProof, { en: "Hospital birth record", hi: "अस्पताल जन्म रिकॉर्ड", bn: "হাসপাতাল জন্ম রেকর্ড", ta: "மருத்துவமனை பிறப்பு பதிவு" }],
  steps: [
    {
      title: S.child,
      fields: [
        F.childName,
        F.dob,
        F.gender,
        { id: "placeOfBirth", label: { en: "Place of birth", hi: "जन्म स्थान", bn: "জন্মস্থান", ta: "பிறந்த இடம்" } },
      ],
      voice: {
        transcript: {
          en: "She's my daughter Aanya, born on 12 March 2026 at Hallet Hospital, Kanpur.",
          hi: "यह मेरी बेटी आन्या है, जन्म 12 मार्च 2026 को हैलट अस्पताल, कानपुर में हुआ।",
          bn: "এ আমার মেয়ে আন্যা, 12 মার্চ 2026 হ্যালেট হাসপাতাল, কানপুরে জন্ম।",
          ta: "இவள் என் மகள் ஆன்யா, 12 மார்ச் 2026 அன்று ஹாலெட் மருத்துவமனை, கான்பூரில் பிறந்தாள்.",
        },
        extract: {
          childName: { en: "Aanya", hi: "आन्या", bn: "আন্যা", ta: "ஆன்யா" },
          dob: { en: "12 Mar 2026", hi: "12 मार्च 2026", bn: "12 মার্চ 2026", ta: "12 மார்ச் 2026" },
          gender: { en: "Female", hi: "महिला", bn: "মহিলা", ta: "பெண்" },
          placeOfBirth: { en: "Hallet Hospital, Kanpur", hi: "हैलट अस्पताल, कानपुर", bn: "হ্যালেট হাসপাতাল, কানপুর", ta: "ஹாலெட் மருத்துவமனை, கான்பூர்" },
        },
      },
    },
    {
      title: { en: "Parents & address", hi: "माता-पिता व पता", bn: "পিতামাতা ও ঠিকানা", ta: "பெற்றோர் & முகவரி" },
      fields: [F.motherName, F.fatherName, F.address],
      voice: {
        transcript: {
          en: "Mother Sunita Verma, father Rakesh Verma. We live at 14 Civil Lines, Kanpur.",
          hi: "माता सुनीता वर्मा, पिता राकेश वर्मा। हम 14 सिविल लाइन्स, कानपुर में रहते हैं।",
          bn: "মা সুনীতা ভার্মা, বাবা রাকেশ ভার্মা। আমরা 14 সিভিল লাইনস, কানপুরে থাকি।",
          ta: "தாய் சுனிதா வர்மா, தந்தை ரகேஷ் வர்மா. நாங்கள் 14 சிவில் லைன்ஸ், கான்பூரில் வசிக்கிறோம்.",
        },
        extract: {
          motherName: { en: "Sunita Verma", hi: "सुनीता वर्मा", bn: "সুনীতা ভার্মা", ta: "சுனிதா வர்மா" },
          fatherName: { en: "Rakesh Verma", hi: "राकेश वर्मा", bn: "রাকেশ ভার্মা", ta: "ரகேஷ் வர்மா" },
          address: { en: "14 Civil Lines, Kanpur", hi: "14 सिविल लाइन्स, कानपुर", bn: "14 সিভিল লাইনস, কানপুর", ta: "14 சிவில் லைன்ஸ், கான்பூர்" },
        },
      },
    },
  ],
};

/* =================================================== flow blueprints === */
/* Each entry models the real portal's process. service name + (scheme)
 * intro are pulled from mockData in getApplyFlow to avoid re-localizing.  */

interface Blueprint {
  kind: ApplyKind;
  portal: string;
  department?: L; // schemes fall back to scheme.department
  timeline: L;
  fee?: string;
  amount?: string;
  documents: L[];
  steps: ApplyStep[];
  introOverride?: L;
}

const BLUEPRINTS: Record<string, Blueprint> = {
  /* ----------------------------------------------------- schemes ----- */
  pmkisan: {
    kind: "apply",
    portal: "PM-KISAN",
    timeline: T.cycle,
    fee: "Free",
    documents: [D.aadhaar, D.landRecord, D.bankPassbook],
    steps: [
      { title: S.identity, fields: [F.aadhaar, F.fullName, F.fatherName, F.gender, F.category] },
      { title: { en: "Land & address", hi: "भूमि व पता", bn: "জমি ও ঠিকানা", ta: "நிலம் & முகவரி" }, fields: [F.state, F.district, F.village, F.khasra] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc, F.mobile] },
    ],
  },
  pmjay: {
    kind: "apply",
    portal: "Ayushman Bharat (PM-JAY)",
    timeline: T.sameDay,
    fee: "Free",
    documents: [D.aadhaar, D.rationCard],
    steps: [
      { title: S.eligibility, fields: [F.mobile, F.rationCard, F.state, ro(RO.eligibility, "Eligible family found (SECC)")] },
      { title: S.ekyc, fields: [F.aadhaar, F.fullName, F.dob, F.gender] },
    ],
  },
  pmay: {
    kind: "apply",
    portal: "PMAY (Awaassoft)",
    timeline: T.d30,
    fee: "Free",
    documents: [D.aadhaar, D.incomeProof, D.bankPassbook, D.photo],
    steps: [
      { title: S.applicant, fields: [F.aadhaar, F.fullName, F.mobile, F.category] },
      { title: S.incomeCat, fields: [F.annualIncome, { id: "houseStatus", label: { en: "Current house", hi: "वर्तमान घर", bn: "বর্তমান বাড়ি", ta: "தற்போதைய வீடு" }, type: "select", options: ["No house", "Kutcha (1 room)", "Kutcha (2 rooms)"] }] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc] },
    ],
  },
  jsy: {
    kind: "apply",
    portal: "JSY (NHM)",
    department: DEPT.health,
    timeline: T.d15,
    fee: "Free",
    documents: [D.mcpCard, D.aadhaar, D.bankPassbook],
    steps: [
      { title: { en: "Mother's details", hi: "माता का विवरण", bn: "মায়ের বিবরণ", ta: "தாயின் விவரம்" }, fields: [F.fullName, F.husbandName, F.aadhaar, F.dob] },
      { title: S.pregnancy, fields: [F.lmp, F.mcpNo, { id: "facility", label: { en: "Delivery facility", hi: "प्रसव सुविधा", bn: "প্রসব কেন্দ্র", ta: "பிரசவ மையம்" }, type: "select", options: ["Govt. district hospital", "CHC", "PHC", "Accredited private"] }] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc] },
    ],
  },
  sukanya: {
    kind: "apply",
    portal: "India Post / Bank",
    timeline: T.sameDay,
    fee: "₹250 min deposit",
    documents: [D.birthCert, D.aadhaar, D.photo],
    steps: [
      { title: S.child, fields: [F.childName, F.dob, { id: "birthCertNo", label: { en: "Birth certificate no.", hi: "जन्म प्रमाणपत्र संख्या", bn: "জন্ম সনদ নম্বর", ta: "பிறப்புச் சான்றிதழ் எண்" } }] },
      { title: { en: "Guardian", hi: "अभिभावक", bn: "অভিভাবক", ta: "பாதுகாவலர்" }, fields: [F.guardianName, F.aadhaar, F.pan, F.relation] },
      { title: S.account, fields: [F.depositAmount, F.bankName] },
    ],
  },
  pmmvy: {
    kind: "apply",
    portal: "PMMVY (Anganwadi)",
    department: DEPT.health,
    timeline: T.d15,
    fee: "Free",
    documents: [D.mcpCard, D.aadhaar, D.bankPassbook],
    steps: [
      { title: { en: "Mother's details", hi: "माता का विवरण", bn: "মায়ের বিবরণ", ta: "தாயின் விவரம்" }, fields: [F.fullName, F.aadhaar, F.dob, F.husbandName] },
      { title: S.pregnancy, fields: [F.lmp, F.mcpNo] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc] },
    ],
  },
  nsp: {
    kind: "apply",
    portal: "National Scholarship Portal",
    department: DEPT.education,
    timeline: T.d30,
    fee: "Free",
    documents: [D.marksheet, D.incomeProof, D.casteProof, D.bonafide, D.bankPassbook, D.aadhaar],
    steps: [
      { title: { en: "Student registration", hi: "विद्यार्थी पंजीकरण", bn: "শিক্ষার্থী নিবন্ধন", ta: "மாணவர் பதிவு" }, fields: [F.fullName, F.dob, F.gender, F.mobile, F.aadhaar] },
      { title: S.academic, fields: [F.institution, F.course, F.admissionYear] },
      { title: S.incomeCat, fields: [F.annualIncome, F.category] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc] },
    ],
  },
  apy: {
    kind: "apply",
    portal: "APY (Bank)",
    timeline: T.sameDay,
    fee: "Auto-debit",
    documents: [D.aadhaar, D.bankPassbook],
    steps: [
      { title: S.applicant, fields: [F.fullName, F.aadhaar, F.dob, F.mobile] },
      { title: S.scheme, fields: [F.pensionAmount, ro(RO.status, "Auto-debit from savings account")] },
      { title: S.nominee, fields: [F.nominee, F.relation, F.bankAccount] },
    ],
  },
  pmsby: {
    kind: "apply",
    portal: "PMSBY (Bank)",
    timeline: T.instant,
    fee: "₹20 / year",
    documents: [D.aadhaar, D.bankPassbook],
    steps: [
      { title: S.applicant, fields: [F.fullName, F.dob, F.mobile, F.aadhaar] },
      { title: S.account, fields: [F.bankAccount, F.ifsc, ro(RO.status, "₹20 annual auto-debit consent")] },
      { title: S.nominee, fields: [F.nominee, F.relation] },
    ],
  },
  ignoaps: {
    kind: "apply",
    portal: "NSAP",
    department: DEPT.rural,
    timeline: T.d30,
    fee: "Free",
    documents: [D.aadhaar, D.bankPassbook, { en: "BPL card", hi: "बीपीएल कार्ड", bn: "বিপিএল কার্ড", ta: "பிபிஎல் கார்டு" }, { en: "Age proof", hi: "आयु प्रमाण", bn: "বয়সের প্রমাণ", ta: "வயதுச் சான்று" }],
    steps: [
      { title: S.applicant, fields: [F.aadhaar, F.fullName, F.dob, F.gender] },
      { title: S.addr, fields: [F.state, F.district, F.village, F.rationCard] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc] },
    ],
  },
  mudra: {
    kind: "apply",
    portal: "Udyamimitra",
    department: DEPT.finance,
    timeline: T.d15,
    fee: "No collateral",
    documents: [D.aadhaar, D.pan, D.bankPassbook, { en: "Business proof / quotation", hi: "व्यवसाय प्रमाण / कोटेशन", bn: "ব্যবসার প্রমাণ / কোটেশন", ta: "வணிகச் சான்று / விலைப்பட்டியல்" }],
    steps: [
      { title: S.applicant, fields: [F.fullName, F.aadhaar, F.pan, F.mobile] },
      { title: { en: "Business", hi: "व्यवसाय", bn: "ব্যবসা", ta: "வணிகம்" }, fields: [F.businessName, F.businessType] },
      { title: S.loan, fields: [F.loanCategory, F.loanAmount] },
    ],
  },
  vishwakarma: {
    kind: "apply",
    portal: "PM Vishwakarma",
    department: DEPT.labour,
    timeline: T.d30,
    fee: "Free",
    documents: [D.aadhaar, D.bankPassbook, D.rationCard],
    steps: [
      { title: S.applicant, fields: [F.aadhaar, F.fullName, F.mobile] },
      { title: { en: "Trade & address", hi: "व्यवसाय व पता", bn: "পেশা ও ঠিকানা", ta: "தொழில் & முகவரி" }, fields: [F.trade, F.village, F.district] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc] },
    ],
  },

  /* ------------------------------------------------ identity tasks ----- */
  identity_addr: {
    kind: "apply",
    portal: "myAadhaar (UIDAI)",
    department: DEPT.uidai,
    timeline: T.d7,
    fee: "₹50",
    documents: [D.addressProof],
    steps: [
      { title: S.verify, fields: [ro(RO.holderName, "Rakesh Verma"), F.aadhaar, F.otp] },
      { title: { en: "New address", hi: "नया पता", bn: "নতুন ঠিকানা", ta: "புதிய முகவரி" }, fields: [F.newAddress, F.state, F.district, F.pincode] },
    ],
  },
  identity_mobile: {
    kind: "register",
    portal: "Aadhaar Seva Kendra (UIDAI)",
    department: DEPT.uidai,
    timeline: T.sameDay,
    fee: "₹50",
    documents: [D.aadhaar],
    steps: [
      { title: S.verify, fields: [F.aadhaar, F.fullName] },
      { title: { en: "Mobile update", hi: "मोबाइल अपडेट", bn: "মোবাইল আপডেট", ta: "மொபைல் புதுப்பிப்பு" }, fields: [F.newMobile] },
      { title: S.appointment, fields: [F.centre, F.apptDate] },
    ],
  },
  identity_eaadhaar: {
    kind: "download",
    portal: "myAadhaar (UIDAI)",
    department: DEPT.uidai,
    timeline: T.instant,
    fee: "Free",
    documents: [],
    steps: [
      { title: S.verify, fields: [F.aadhaar, F.otp, ro(RO.holderName, "Rakesh Verma")] },
    ],
  },

  /* --------------------------------------------- certificate tasks ----- */
  cert_income: {
    kind: "apply",
    portal: "e-District",
    department: DEPT.revenue,
    timeline: T.d15,
    fee: "₹30",
    documents: [D.aadhaar, D.rationCard, D.salarySlip, D.addressProof],
    steps: [
      { title: S.applicant, fields: [F.fullName, F.fatherName, F.aadhaar, F.address] },
      { title: { en: "Income details", hi: "आय विवरण", bn: "আয়ের বিবরণ", ta: "வருமான விவரம்" }, fields: [F.annualIncome, F.occupation, F.purpose] },
    ],
  },
  cert_caste: {
    kind: "apply",
    portal: "e-District",
    department: DEPT.social,
    timeline: T.d15,
    fee: "₹30",
    documents: [D.aadhaar, D.rationCard, D.fatherCaste, D.addressProof],
    steps: [
      { title: S.applicant, fields: [F.fullName, F.fatherName, F.aadhaar, F.address] },
      { title: { en: "Caste details", hi: "जाति विवरण", bn: "জাতির বিবরণ", ta: "சாதி விவரம்" }, fields: [F.caste, F.category, F.purpose] },
    ],
  },

  /* -------------------------------------------------- health tasks ----- */
  health_ayushman: {
    kind: "apply",
    portal: "ABHA / PM-JAY",
    department: DEPT.health,
    timeline: T.sameDay,
    fee: "Free",
    documents: [D.aadhaar, D.rationCard],
    steps: [
      { title: S.eligibility, fields: [F.mobile, F.rationCard, ro(RO.eligibility, "Eligible family found")] },
      { title: S.ekyc, fields: [F.aadhaar, F.fullName, F.dob, F.gender] },
    ],
  },
  health_hospital: {
    kind: "register",
    portal: "ABHA / e-Hospital",
    department: DEPT.health,
    timeline: T.instant,
    fee: "₹10 (OPD slip)",
    documents: [],
    steps: [
      { title: { en: "Patient details", hi: "मरीज़ का विवरण", bn: "রোগীর বিবরণ", ta: "நோயாளி விவரம்" }, fields: [F.fullName, F.dob, F.gender, F.mobile] },
      { title: S.appointment, fields: [F.hospital, F.hospDept, F.slot] },
    ],
  },
  health_checkup: {
    kind: "register",
    portal: "e-Hospital",
    department: DEPT.health,
    timeline: T.instant,
    fee: "From ₹200",
    documents: [],
    steps: [
      { title: { en: "Patient details", hi: "मरीज़ का विवरण", bn: "রোগীর বিবরণ", ta: "நோயாளி விவரம்" }, fields: [F.fullName, F.dob, F.mobile] },
      { title: S.appointment, fields: [F.package, F.hospital, F.slot] },
    ],
  },

  /* ----------------------------------------------- education tasks ----- */
  edu_scholarship: {
    kind: "apply",
    portal: "National Scholarship Portal",
    department: DEPT.education,
    timeline: T.d30,
    fee: "Free",
    documents: [D.marksheet, D.incomeProof, D.casteProof, D.bonafide, D.bankPassbook],
    steps: [
      { title: { en: "Student registration", hi: "विद्यार्थी पंजीकरण", bn: "শিক্ষার্থী নিবন্ধন", ta: "மாணவர் பதிவு" }, fields: [F.fullName, F.dob, F.mobile, F.aadhaar] },
      { title: S.academic, fields: [F.institution, F.course, F.admissionYear] },
      { title: S.incomeCat, fields: [F.annualIncome, F.category] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc] },
    ],
  },
  edu_admission: {
    kind: "apply",
    portal: "RTE / State School Portal",
    department: DEPT.education,
    timeline: T.d30,
    fee: "Free (RTE)",
    documents: [D.birthCert, D.addressProof, D.incomeProof, D.casteProof, D.photo],
    steps: [
      { title: S.child, fields: [F.childName, F.dob, F.gender] },
      { title: { en: "Parent & income", hi: "अभिभावक व आय", bn: "অভিভাবক ও আয়", ta: "பெற்றோர் & வருமானம்" }, fields: [F.guardianName, F.aadhaar, F.annualIncome, F.category] },
      { title: { en: "School preference", hi: "स्कूल वरीयता", bn: "স্কুল পছন্দ", ta: "பள்ளி விருப்பம்" }, fields: [F.institution, F.course] },
    ],
  },
  edu_verify: {
    kind: "download",
    portal: "DigiLocker",
    department: DEPT.education,
    timeline: T.instant,
    fee: "Free",
    documents: [],
    steps: [
      { title: S.certificate, fields: [F.board, F.rollNo, F.examYear, ro(RO.recordFound, "Verified — Class XII, 2021")] },
    ],
  },

  /* --------------------------------------------------- money tasks ----- */
  money_pension: {
    kind: "apply",
    portal: "eNPS (NPS Trust)",
    department: DEPT.finance,
    timeline: T.d3,
    fee: "₹500 min",
    documents: [D.aadhaar, D.pan, D.bankPassbook, D.photo],
    steps: [
      { title: S.applicant, fields: [F.fullName, F.aadhaar, F.pan, F.dob] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc] },
      { title: S.nominee, fields: [F.nominee, F.relation] },
    ],
  },
  money_oldage: {
    kind: "apply",
    portal: "NSAP",
    department: DEPT.rural,
    timeline: T.d30,
    fee: "Free",
    documents: [D.aadhaar, D.bankPassbook, { en: "BPL card", hi: "बीपीएल कार्ड", bn: "বিপিএল কার্ড", ta: "பிபிஎல் கார்டு" }, { en: "Age proof", hi: "आयु प्रमाण", bn: "বয়সের প্রমাণ", ta: "வயதுச் சான்று" }],
    steps: [
      { title: S.applicant, fields: [F.aadhaar, F.fullName, F.dob, F.gender] },
      { title: S.addr, fields: [F.state, F.district, F.village, F.rationCard] },
      { title: S.bank, fields: [F.bankAccount, F.ifsc] },
    ],
  },
  money_bank: {
    kind: "register",
    portal: "DBT / Aadhaar Seeding",
    department: DEPT.finance,
    timeline: T.d3,
    fee: "Free",
    documents: [D.aadhaar, D.bankPassbook],
    steps: [
      { title: S.account, fields: [F.bankName, F.bankAccount, F.ifsc] },
      { title: S.verify, fields: [F.aadhaar, F.otp, ro(RO.status, "Consent for Aadhaar seeding (DBT)")] },
    ],
  },

  /* ---------------------------------------------------- land tasks ----- */
  land_record: {
    kind: "download",
    portal: "Bhulekh",
    department: DEPT.revenue,
    timeline: T.instant,
    fee: "₹15",
    documents: [],
    steps: [
      { title: S.lookup, fields: [F.state, F.district, F.block, F.village, F.khasra, ro(RO.recordFound, "Khata 142 · Rakesh Verma · 0.42 ha")] },
    ],
  },
  land_tax: {
    kind: "pay",
    portal: "ULB / Nagar Nigam",
    department: DEPT.municipal,
    timeline: T.instant,
    amount: "₹2,450",
    documents: [],
    steps: [
      { title: S.property, fields: [F.propertyId, ro(RO.ownerName, "Rakesh Verma"), ro(RO.assessedValue, "₹24.6 L"), ro(RO.duesAmount, "₹2,450")] },
    ],
  },
  land_mutation: {
    kind: "apply",
    portal: "e-District / Bhulekh",
    department: DEPT.revenue,
    timeline: T.d30,
    fee: "₹100",
    documents: [D.saleDeed, D.landRecord, D.aadhaar],
    steps: [
      { title: S.property, fields: [F.khasra, ro(RO.ownerName, "Rakesh Verma")] },
      { title: S.transfer, fields: [F.newOwner, F.transferBasis, { id: "deedNo", label: { en: "Deed / Reg. number", hi: "विलेख / पंजी संख्या", bn: "দলিল / রেজি. নম্বর", ta: "பத்திரம் / பதிவு எண்" } }] },
    ],
  },

  /* ----------------------------------------------- transport tasks ----- */
  transport_dl: {
    kind: "renew",
    portal: "Sarathi (Parivahan)",
    department: DEPT.transport,
    timeline: T.d7,
    fee: "₹400",
    documents: [D.oldDl, D.medical1A, D.photo, D.form9],
    steps: [
      { title: S.lookup, fields: [F.dlNumber, F.dob, ro(RO.holderName, "Rakesh Verma"), ro(RO.validUpto, "expired 14 Apr 2026"), ro(RO.vehicleClass, "LMV, MCWG")] },
      { title: S.personal, fields: [F.address, F.mobile], voice: PERSONAL_VOICE },
    ],
  },
  transport_challan: {
    kind: "pay",
    portal: "eChallan (Parivahan)",
    department: DEPT.transport,
    timeline: T.instant,
    amount: "₹1,500",
    documents: [],
    steps: [
      { title: S.lookup, fields: [F.vehicleNo, ro(RO.pendingChallans, "2 challans"), ro(RO.challanTotal, "₹1,500")] },
    ],
  },
  transport_vehicle: {
    kind: "register",
    portal: "Vahan (Parivahan)",
    department: DEPT.transport,
    timeline: T.d7,
    fee: "Road tax + ₹600",
    documents: [D.form20, D.invoice, D.insurance, D.puc, D.addressProof, D.aadhaar],
    steps: [
      { title: S.vehicle, fields: [F.chassisNo, F.engineNo, F.makerModel] },
      { title: { en: "Owner & documents", hi: "मालिक व दस्तावेज़", bn: "মালিক ও নথি", ta: "உரிமையாளர் & ஆவணங்கள்" }, fields: [F.fullName, F.aadhaar, F.address] },
    ],
  },

  transport_ll: {
    kind: "apply",
    portal: "Sarathi (Parivahan)",
    department: DEPT.transport,
    timeline: T.sameDay,
    fee: "₹200",
    documents: [D.aadhaar, D.addressProof, D.photo, D.signature, D.form2],
    steps: [
      { title: S.applicant, fields: [F.fullName, F.dob, F.bloodGroup, F.aadhaar] },
      { title: S.personal, fields: [F.address, F.mobile], voice: PERSONAL_VOICE },
      { title: S.test, note: { en: "The test is taken online, from home, with face authentication.", hi: "टेस्ट घर से, चेहरे के सत्यापन के साथ ऑनलाइन होता है।", bn: "টেস্টটি ঘর থেকে, মুখ যাচাইসহ অনলাইনে হয়।", ta: "தேர்வு வீட்டிலிருந்தே, முக அங்கீகாரத்துடன் ஆன்லைனில் நடைபெறும்." }, fields: [F.rto, F.llClass, F.llSlot] },
    ],
  },
  transport_rc_transfer: {
    kind: "apply",
    portal: "Vahan (Parivahan)",
    department: DEPT.transport,
    timeline: T.d7,
    fee: "₹300 + tax",
    documents: [D.rcCopy, D.form2930, D.insurance, D.puc, D.addressProof],
    steps: [
      { title: S.rc, fields: [F.vehicleNo, ro(RO.ownerName, "Rakesh Verma"), ro(RO.rcVehicle, "Maruti Suzuki Swift · Petrol · 2019")] },
      { title: S.buyer, fields: [F.newOwner, F.aadhaar, F.newMobile, F.address] },
      { title: S.transfer, fields: [F.transferBasis] },
    ],
  },
  transport_rc_duplicate: {
    kind: "apply",
    portal: "Vahan (Parivahan)",
    department: DEPT.transport,
    timeline: T.d7,
    fee: "₹300",
    documents: [D.form26, D.policeReport, D.insurance, D.puc],
    steps: [
      { title: S.rc, fields: [F.vehicleNo, F.chassisLast5, ro(RO.ownerName, "Rakesh Verma")] },
      { title: S.applicant, fields: [F.duplicateReason, F.mobile] },
    ],
  },
  transport_puc: {
    kind: "download",
    portal: "PUCC (Parivahan)",
    department: DEPT.transport,
    timeline: T.instant,
    fee: "Free",
    documents: [],
    steps: [
      { title: S.lookup, fields: [F.vehicleNo, F.chassisLast5, ro(RO.pucValid, "03 Sep 2026"), ro(RO.recordFound, "PUC UP078-2026-118204")] },
    ],
  },
  transport_hsrp: {
    kind: "pay",
    portal: "HSRP booking (SIAM)",
    department: DEPT.transport,
    timeline: T.d7,
    amount: "₹590",
    documents: [],
    steps: [
      { title: S.vehicle, fields: [F.vehicleNo, ro(RO.rcVehicle, "Maruti Suzuki Swift · Petrol · 2019")] },
      { title: S.plate, fields: [F.fitment, F.apptDate] },
    ],
  },

  /* --------------------------------------------------- exam tasks ------ */
  exam_nta: {
    kind: "apply",
    portal: "NTA exam portal",
    department: DEPT.nta,
    timeline: T.schedule,
    fee: "₹1,000",
    documents: [D.photo, D.signature, D.classX, D.casteProof, D.pwdCert],
    steps: [
      { title: S.exam, fields: [F.examName, F.examCity1, F.examCity2] },
      { title: S.personal, fields: [F.fullName, F.dob, F.category, F.aadhaar] },
      { title: S.education2, fields: [F.qualifying, F.board, F.rollNo, F.subjects] },
    ],
  },
  exam_board: {
    kind: "apply",
    portal: "State Board portal",
    department: DEPT.board,
    timeline: T.schedule,
    fee: "₹600",
    documents: [D.marksheet, D.photo, D.signature, D.aadhaar],
    steps: [
      { title: S.exam, fields: [F.boardExam, F.subjects, F.examCity1] },
      { title: S.personal, fields: [F.fullName, F.fatherName, F.dob, F.address], voice: PERSONAL_VOICE },
    ],
  },
  exam_recruit: {
    kind: "apply",
    portal: "SSC portal",
    department: DEPT.ssc,
    timeline: T.schedule,
    fee: "₹100",
    documents: [D.photo, D.signature, D.marksheet, D.casteProof],
    steps: [
      { title: S.exam, fields: [F.sscExam, F.examCity1, F.examCity2] },
      { title: S.personal, fields: [F.fullName, F.dob, F.gender, F.category] },
      { title: S.education2, fields: [F.education, F.board, F.examYear] },
    ],
  },
  exam_admit: {
    kind: "download",
    portal: "NTA exam portal",
    department: DEPT.nta,
    timeline: T.instant,
    fee: "Free",
    documents: [],
    steps: [
      { title: S.lookup, fields: [F.applicationNo, F.dob, ro(RO.examCentre, "iON Digital Zone, Kanpur"), ro(RO.examDate, "12 Jan 2027 · Shift 1")] },
    ],
  },
  exam_result: {
    kind: "download",
    portal: "DigiLocker",
    department: DEPT.board,
    timeline: T.instant,
    fee: "Free",
    documents: [],
    steps: [
      { title: S.certificate, fields: [F.board, F.rollNo, F.examYear, ro(RO.recordFound, "Class XII · 2026 · 86.4%")] },
    ],
  },
  exam_reval: {
    kind: "pay",
    portal: "State Board portal",
    department: DEPT.board,
    timeline: T.d30,
    amount: "₹500",
    documents: [],
    steps: [
      { title: S.paper, fields: [F.rollNo, F.revalSubject, ro(RO.marks, "58 / 100")] },
    ],
  },

  /* ---------------------------------------------- employment tasks ----- */
  emp_jobcard: {
    kind: "apply",
    portal: "MGNREGA (NREGASoft)",
    department: DEPT.rural,
    timeline: T.d15,
    fee: "Free",
    documents: [D.aadhaar, D.photo, D.bankPassbook],
    steps: [
      { title: { en: "Household head", hi: "परिवार का मुखिया", bn: "পরিবারের প্রধান", ta: "குடும்பத் தலைவர்" }, fields: [F.fullName, F.aadhaar, F.gender, F.dob] },
      { title: S.family, fields: [F.familyCount] },
      { title: S.addr, fields: [F.state, F.district, F.panchayat, F.village] },
    ],
  },
  emp_skill: {
    kind: "register",
    portal: "Skill India (PMKVY)",
    department: DEPT.labour,
    timeline: T.d7,
    fee: "Free",
    documents: [D.aadhaar, D.educationProof],
    steps: [
      { title: S.applicant, fields: [F.fullName, F.aadhaar, F.dob, F.education] },
      { title: { en: "Course", hi: "पाठ्यक्रम", bn: "কোর্স", ta: "பாடநெறி" }, fields: [F.sector, F.course] },
    ],
  },
  emp_work: {
    kind: "register",
    portal: "National Career Service",
    department: DEPT.labour,
    timeline: T.instant,
    fee: "Free",
    documents: [],
    steps: [
      { title: S.jobseeker, fields: [F.fullName, F.mobile, F.email, F.education] },
      { title: { en: "Preferences", hi: "वरीयताएँ", bn: "পছন্দসমূহ", ta: "விருப்பங்கள்" }, fields: [F.sector, F.jobRole, F.experience] },
    ],
  },

  /* --------------------------------------------------- taxes tasks ----- */
  taxes_property: {
    kind: "pay",
    portal: "ULB / Nagar Nigam",
    department: DEPT.municipal,
    timeline: T.instant,
    amount: "₹2,450",
    documents: [],
    steps: [
      { title: S.property, fields: [F.propertyId, ro(RO.ownerName, "Rakesh Verma"), ro(RO.assessedValue, "₹24.6 L"), ro(RO.duesAmount, "₹2,450")] },
    ],
  },
  taxes_income: {
    kind: "apply",
    portal: "Income Tax e-Filing",
    department: DEPT.incomeTax,
    timeline: T.instant,
    fee: "Free",
    documents: [D.form16, D.bankPassbook],
    steps: [
      { title: { en: "Assessee", hi: "करदाता", bn: "করদাতা", ta: "வரி செலுத்துவோர்" }, fields: [F.pan, F.assessYear, F.itrForm] },
      { title: S.return, fields: [F.grossIncome, F.deductions, ro(RO.taxPayable, "₹0 — refund ₹4,200")] },
      { title: S.verify, fields: [F.aadhaar, F.otp] },
    ],
  },
  taxes_bill: {
    kind: "pay",
    portal: "Bharat BillPay (BBPS)",
    department: DEPT.power,
    timeline: T.instant,
    amount: "₹1,180",
    documents: [],
    steps: [
      { title: { en: "Choose biller", hi: "बिलर चुनें", bn: "বিলার নির্বাচন", ta: "பில்லரைத் தேர்வு" }, fields: [F.billerCategory, F.biller] },
      { title: S.account, fields: [F.consumerNo, ro(RO.holderName, "Rakesh Verma"), ro(RO.billAmount, "₹1,180"), ro(RO.dueDate, "28 May 2026")] },
    ],
  },

  /* ---------------------------------------------- grievance tasks ----- */
  griev_file: {
    kind: "grievance",
    portal: "CPGRAMS",
    department: DEPT.admin,
    timeline: T.d30,
    fee: "Free",
    documents: [],
    steps: [
      { title: { en: "Your details", hi: "आपका विवरण", bn: "আপনার বিবরণ", ta: "உங்கள் விவரம்" }, fields: [F.fullName, F.mobile, F.email], voice: PERSONAL_VOICE },
      { title: S.complaint, fields: [F.ministry, F.subject, F.description] },
    ],
  },
  griev_track: {
    kind: "download",
    portal: "CPGRAMS",
    department: DEPT.admin,
    timeline: T.instant,
    fee: "Free",
    documents: [],
    steps: [
      { title: S.lookup, fields: [F.regNo, F.mobile, ro(RO.status, "Under review — Forwarded to dept (12 May)")] },
    ],
  },
  griev_feedback: {
    kind: "grievance",
    portal: "MyGov",
    department: DEPT.admin,
    timeline: T.instant,
    fee: "Free",
    documents: [],
    steps: [
      { title: S.feedback, fields: [F.subject, F.rating, F.description] },
      { title: { en: "Contact (optional)", hi: "संपर्क (वैकल्पिक)", bn: "যোগাযোগ (ঐচ্ছিক)", ta: "தொடர்பு (விருப்பம்)" }, fields: [F.fullName, F.mobile] },
    ],
  },
};

/* ===================================================== assembly === */

const FALLBACK_NAME: L = { en: "Application", hi: "आवेदन", bn: "আবেদন", ta: "விண்ணப்பம்" };

/** Every flow the apply engine can run — the birth certificate plus each blueprint. */
export const APPLY_FLOW_IDS: string[] = ["cert_birth", ...Object.keys(BLUEPRINTS)];

export function getApplyFlow(id: string | null): ApplyFlow {
  if (!id || id === "cert_birth" || id === "birthCertificate") {
    return BIRTH_CERTIFICATE;
  }

  const bp = BLUEPRINTS[id];
  if (!bp) return BIRTH_CERTIFICATE;

  const scheme = getScheme(id);
  const task = getTask(id);
  const service = scheme?.name ?? task?.name ?? FALLBACK_NAME;
  const department = bp.department ?? scheme?.department ?? DEPT.admin;
  const intro = bp.introOverride ?? scheme?.desc ?? KIND_INTRO[bp.kind];

  return {
    id,
    kind: bp.kind,
    service,
    portal: bp.portal,
    department,
    intro,
    timeline: bp.timeline,
    fee: bp.fee,
    amount: bp.amount,
    documents: bp.documents,
    steps: bp.steps,
  };
}
