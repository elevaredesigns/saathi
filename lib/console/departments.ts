/**
 * Saathi for Departments — the offices on the other side of every citizen
 * service. Each department console manages exactly the services it owns
 * (see console.test.ts: every task and scheme belongs to one department).
 * Offices, officers and jurisdictions are samples.
 */
import type { L } from "@/lib/mockData";

export type DeptId =
  | "municipal"
  | "revenue"
  | "uidai"
  | "transport"
  | "health"
  | "education"
  | "exams"
  | "agriculture"
  | "rural"
  | "labour"
  | "women"
  | "social"
  | "finance"
  | "incomeTax"
  | "grievance";

export type ModuleId = "overview" | "applications" | "kyc" | "records" | "payments" | "challans" | "exams" | "dbt" | "grievances" | "audit";

export type DeptTone = "navy" | "saffron" | "green" | "violet" | "teal" | "neutral";

export interface Department {
  id: DeptId;
  name: L;
  office: L;
  code: string;
  tone: DeptTone;
  officer: { name: string; role: L };
  services: string[];
  modules: ModuleId[];
  /** What this office issues, in the plural ("Certificates"). */
  records: L;
}

const CORE: ModuleId[] = ["overview", "applications", "kyc", "records"];
const TAIL: ModuleId[] = ["grievances", "audit"];

const role = {
  registrar: { en: "Registrar (Births & Deaths)", hi: "रजिस्ट्रार (जन्म एवं मृत्यु)", bn: "রেজিস্ট্রার (জন্ম ও মৃত্যু)", ta: "பதிவாளர் (பிறப்பு & இறப்பு)" },
  tehsildar: { en: "Tehsildar", hi: "तहसीलदार", bn: "তহশিলদার", ta: "வட்டாட்சியர்" },
  regional: { en: "Deputy Director", hi: "उप निदेशक", bn: "উপ-পরিচালক", ta: "துணை இயக்குநர்" },
  rto: { en: "Regional Transport Officer", hi: "क्षेत्रीय परिवहन अधिकारी", bn: "আঞ্চলিক পরিবহন আধিকারিক", ta: "வட்டாரப் போக்குவரத்து அலுவலர்" },
  cmo: { en: "District Programme Manager", hi: "ज़िला कार्यक्रम प्रबंधक", bn: "জেলা কর্মসূচি ব্যবস্থাপক", ta: "மாவட்டத் திட்ட மேலாளர்" },
  deo: { en: "District Education Officer", hi: "ज़िला शिक्षा अधिकारी", bn: "জেলা শিক্ষা আধিকারিক", ta: "மாவட்டக் கல்வி அலுவலர்" },
  controller: { en: "Controller of Examinations", hi: "परीक्षा नियंत्रक", bn: "পরীক্ষা নিয়ামক", ta: "தேர்வுக் கட்டுப்பாட்டு அலுவலர்" },
  dao: { en: "District Agriculture Officer", hi: "ज़िला कृषि अधिकारी", bn: "জেলা কৃষি আধিকারিক", ta: "மாவட்ட வேளாண் அலுவலர்" },
  bdo: { en: "Block Development Officer", hi: "खंड विकास अधिकारी", bn: "ব্লক উন্নয়ন আধিকারিক", ta: "வட்டார வளர்ச்சி அலுவலர்" },
  labour: { en: "Assistant Labour Commissioner", hi: "सहायक श्रम आयुक्त", bn: "সহকারী শ্রম কমিশনার", ta: "உதவித் தொழிலாளர் ஆணையர்" },
  dpo: { en: "District Programme Officer", hi: "ज़िला कार्यक्रम अधिकारी", bn: "জেলা কর্মসূচি আধিকারিক", ta: "மாவட்டத் திட்ட அலுவலர்" },
  dswo: { en: "District Social Welfare Officer", hi: "ज़िला समाज कल्याण अधिकारी", bn: "জেলা সমাজকল্যাণ আধিকারিক", ta: "மாவட்டச் சமூக நல அலுவலர்" },
  ldm: { en: "Lead District Manager", hi: "अग्रणी ज़िला प्रबंधक", bn: "লিড ডিস্ট্রিক্ট ম্যানেজার", ta: "முன்னோடி மாவட்ட மேலாளர்" },
  ito: { en: "Income Tax Officer", hi: "आयकर अधिकारी", bn: "আয়কর আধিকারিক", ta: "வருமான வரி அலுவலர்" },
  nodal: { en: "Public Grievance Nodal Officer", hi: "लोक शिकायत नोडल अधिकारी", bn: "জন অভিযোগ নোডাল আধিকারিক", ta: "பொதுக் குறைதீர் முதன்மை அலுவலர்" },
} satisfies Record<string, L>;

export const DEPARTMENTS: Department[] = [
  {
    id: "municipal",
    name: { en: "Municipal Corporation", hi: "नगर निगम", bn: "পৌর নিগম", ta: "மாநகராட்சி" },
    office: { en: "Nagar Nigam, Kanpur", hi: "नगर निगम, कानपुर", bn: "নগর নিগম, কানপুর", ta: "நகர நிகம், கான்பூர்" },
    code: "KNN",
    tone: "navy",
    officer: { name: "Priya Nair", role: role.registrar },
    services: ["cert_birth", "taxes_property", "land_tax", "taxes_bill"],
    modules: [...CORE, "payments", ...TAIL],
    records: { en: "Certificates & receipts", hi: "प्रमाणपत्र व रसीदें", bn: "সনদ ও রসিদ", ta: "சான்றிதழ்கள் & ரசீதுகள்" },
  },
  {
    id: "revenue",
    name: { en: "Revenue Department", hi: "राजस्व विभाग", bn: "রাজস্ব দপ্তর", ta: "வருவாய்த் துறை" },
    office: { en: "Tehsil Sadar, Kanpur Nagar", hi: "तहसील सदर, कानपुर नगर", bn: "তহশিল সদর, কানপুর নগর", ta: "சதர் வட்டம், கான்பூர் நகர்" },
    code: "REV",
    tone: "saffron",
    officer: { name: "S. Reddy", role: role.tehsildar },
    services: ["cert_income", "cert_caste", "land_record", "land_mutation"],
    modules: [...CORE, ...TAIL],
    records: { en: "Certificates & land records", hi: "प्रमाणपत्र व भूमि अभिलेख", bn: "সনদ ও জমির রেকর্ড", ta: "சான்றிதழ்கள் & நிலப் பதிவுகள்" },
  },
  {
    id: "uidai",
    name: { en: "Aadhaar Regional Office", hi: "आधार क्षेत्रीय कार्यालय", bn: "আধার আঞ্চলিক কার্যালয়", ta: "ஆதார் வட்டார அலுவலகம்" },
    office: { en: "Regional Office, Lucknow", hi: "क्षेत्रीय कार्यालय, लखनऊ", bn: "আঞ্চলিক কার্যালয়, লখনউ", ta: "வட்டார அலுவலகம், லக்னோ" },
    code: "UID",
    tone: "navy",
    officer: { name: "Meera Iyer", role: role.regional },
    services: ["identity_addr", "identity_mobile", "identity_eaadhaar"],
    modules: [...CORE, ...TAIL],
    records: { en: "Aadhaar updates", hi: "आधार अपडेट", bn: "আধার আপডেট", ta: "ஆதார் புதுப்பிப்புகள்" },
  },
  {
    id: "transport",
    name: { en: "Transport Department", hi: "परिवहन विभाग", bn: "পরিবহন দপ্তর", ta: "போக்குவரத்துத் துறை" },
    office: { en: "RTO Kanpur Nagar · UP-78", hi: "आरटीओ कानपुर नगर · UP-78", bn: "আরটিও কানপুর নগর · UP-78", ta: "RTO கான்பூர் நகர் · UP-78" },
    code: "RTO",
    tone: "teal",
    officer: { name: "Arjun Singh", role: role.rto },
    services: ["transport_dl", "transport_ll", "transport_vehicle", "transport_rc_transfer", "transport_rc_duplicate", "transport_puc", "transport_hsrp", "transport_challan"],
    modules: [...CORE, "challans", "payments", ...TAIL],
    records: { en: "Licences & registrations", hi: "लाइसेंस व पंजीकरण", bn: "লাইসেন্স ও নিবন্ধন", ta: "உரிமங்கள் & பதிவுகள்" },
  },
  {
    id: "health",
    name: { en: "Health Department", hi: "स्वास्थ्य विभाग", bn: "স্বাস্থ্য দপ্তর", ta: "சுகாதாரத் துறை" },
    office: { en: "District Health Society, Kanpur", hi: "ज़िला स्वास्थ्य समिति, कानपुर", bn: "জেলা স্বাস্থ্য সমিতি, কানপুর", ta: "மாவட்டச் சுகாதாரக் குழு, கான்பூர்" },
    code: "DHS",
    tone: "green",
    officer: { name: "Dr. Kavita Rao", role: role.cmo },
    services: ["health_ayushman", "health_hospital", "health_checkup", "pmjay", "jsy"],
    modules: [...CORE, "dbt", ...TAIL],
    records: { en: "Health cards", hi: "स्वास्थ्य कार्ड", bn: "স্বাস্থ্য কার্ড", ta: "சுகாதார அட்டைகள்" },
  },
  {
    id: "education",
    name: { en: "Education Department", hi: "शिक्षा विभाग", bn: "শিক্ষা দপ্তর", ta: "கல்வித் துறை" },
    office: { en: "District Education Office, Kanpur", hi: "ज़िला शिक्षा कार्यालय, कानपुर", bn: "জেলা শিক্ষা কার্যালয়, কানপুর", ta: "மாவட்டக் கல்வி அலுவலகம், கான்பூர்" },
    code: "DEO",
    tone: "violet",
    officer: { name: "Rajesh Tiwari", role: role.deo },
    services: ["edu_scholarship", "edu_admission", "edu_verify", "nsp"],
    modules: [...CORE, "dbt", ...TAIL],
    records: { en: "Admissions & verifications", hi: "प्रवेश व सत्यापन", bn: "ভর্তি ও যাচাই", ta: "சேர்க்கைகள் & சரிபார்ப்புகள்" },
  },
  {
    id: "exams",
    name: { en: "Examinations", hi: "परीक्षाएँ", bn: "পরীক্ষা", ta: "தேர்வுகள்" },
    office: { en: "Examination Cell · NTA, Board & SSC", hi: "परीक्षा प्रकोष्ठ · एनटीए, बोर्ड व एसएससी", bn: "পরীক্ষা সেল · এনটিএ, বোর্ড ও এসএসসি", ta: "தேர்வுப் பிரிவு · NTA, வாரியம் & SSC" },
    code: "EXM",
    tone: "violet",
    officer: { name: "Dr. Anjali Mehta", role: role.controller },
    services: ["exam_nta", "exam_board", "exam_recruit", "exam_admit", "exam_result", "exam_reval"],
    modules: [...CORE, "exams", "payments", ...TAIL],
    records: { en: "Admit cards & marksheets", hi: "प्रवेश पत्र व अंकपत्र", bn: "অ্যাডমিট কার্ড ও মার্কশিট", ta: "அனுமதிச் சீட்டுகள் & மதிப்பெண் சான்றிதழ்கள்" },
  },
  {
    id: "agriculture",
    name: { en: "Agriculture Department", hi: "कृषि विभाग", bn: "কৃষি দপ্তর", ta: "வேளாண் துறை" },
    office: { en: "District Agriculture Office, Kanpur", hi: "ज़िला कृषि कार्यालय, कानपुर", bn: "জেলা কৃষি কার্যালয়, কানপুর", ta: "மாவட்ட வேளாண் அலுவலகம், கான்பூர்" },
    code: "AGR",
    tone: "green",
    officer: { name: "Mahesh Yadav", role: role.dao },
    services: ["pmkisan"],
    modules: [...CORE, "dbt", ...TAIL],
    records: { en: "Farmer registrations", hi: "किसान पंजीकरण", bn: "কৃষক নিবন্ধন", ta: "விவசாயிப் பதிவுகள்" },
  },
  {
    id: "rural",
    name: { en: "Rural Development", hi: "ग्रामीण विकास", bn: "গ্রামীণ উন্নয়ন", ta: "ஊரக வளர்ச்சி" },
    office: { en: "Block Office, Kalyanpur", hi: "खंड कार्यालय, कल्याणपुर", bn: "ব্লক অফিস, কল্যাণপুর", ta: "வட்டார அலுவலகம், கல்யாண்பூர்" },
    code: "BDO",
    tone: "saffron",
    officer: { name: "Sunil Verma", role: role.bdo },
    services: ["emp_jobcard", "emp_work", "pmay"],
    modules: [...CORE, "dbt", ...TAIL],
    records: { en: "Job cards & sanctions", hi: "जॉब कार्ड व स्वीकृतियाँ", bn: "জব কার্ড ও অনুমোদন", ta: "வேலை அட்டைகள் & ஒப்புதல்கள்" },
  },
  {
    id: "labour",
    name: { en: "Labour & Skills", hi: "श्रम व कौशल", bn: "শ্রম ও দক্ষতা", ta: "தொழிலாளர் & திறன்" },
    office: { en: "Labour Office, Kanpur", hi: "श्रम कार्यालय, कानपुर", bn: "শ্রম কার্যালয়, কানপুর", ta: "தொழிலாளர் அலுவலகம், கான்பூர்" },
    code: "LAB",
    tone: "saffron",
    officer: { name: "Farah Khan", role: role.labour },
    services: ["emp_skill", "vishwakarma"],
    modules: [...CORE, "dbt", ...TAIL],
    records: { en: "Registrations & certificates", hi: "पंजीकरण व प्रमाणपत्र", bn: "নিবন্ধন ও সনদ", ta: "பதிவுகள் & சான்றிதழ்கள்" },
  },
  {
    id: "women",
    name: { en: "Women & Child Development", hi: "महिला एवं बाल विकास", bn: "নারী ও শিশু উন্নয়ন", ta: "மகளிர் & குழந்தை மேம்பாடு" },
    office: { en: "District Programme Office, Kanpur", hi: "ज़िला कार्यक्रम कार्यालय, कानपुर", bn: "জেলা কর্মসূচি কার্যালয়, কানপুর", ta: "மாவட்டத் திட்ட அலுவலகம், கான்பூர்" },
    code: "WCD",
    tone: "violet",
    officer: { name: "Lakshmi Pillai", role: role.dpo },
    services: ["pmmvy", "sukanya"],
    modules: [...CORE, "dbt", ...TAIL],
    records: { en: "Benefit sanctions", hi: "लाभ स्वीकृतियाँ", bn: "সুবিধা অনুমোদন", ta: "பலன் ஒப்புதல்கள்" },
  },
  {
    id: "social",
    name: { en: "Social Welfare", hi: "समाज कल्याण", bn: "সমাজকল্যাণ", ta: "சமூக நலம்" },
    office: { en: "District Social Welfare Office, Kanpur", hi: "ज़िला समाज कल्याण कार्यालय, कानपुर", bn: "জেলা সমাজকল্যাণ কার্যালয়, কানপুর", ta: "மாவட்டச் சமூக நல அலுவலகம், கான்பூர்" },
    code: "SWD",
    tone: "teal",
    officer: { name: "Imran Siddiqui", role: role.dswo },
    services: ["money_oldage", "ignoaps"],
    modules: [...CORE, "dbt", ...TAIL],
    records: { en: "Pension orders", hi: "पेंशन आदेश", bn: "পেনশন আদেশ", ta: "ஓய்வூதிய ஆணைகள்" },
  },
  {
    id: "finance",
    name: { en: "Banking & Financial Inclusion", hi: "बैंकिंग व वित्तीय समावेशन", bn: "ব্যাংকিং ও আর্থিক অন্তর্ভুক্তি", ta: "வங்கி & நிதி உள்ளடக்கம்" },
    office: { en: "Lead District Office, Kanpur", hi: "अग्रणी ज़िला कार्यालय, कानपुर", bn: "লিড ডিস্ট্রিক্ট অফিস, কানপুর", ta: "முன்னோடி மாவட்ட அலுவலகம், கான்பூர்" },
    code: "LDM",
    tone: "navy",
    officer: { name: "Vikram Joshi", role: role.ldm },
    services: ["money_pension", "money_bank", "apy", "pmsby", "mudra"],
    modules: [...CORE, "payments", ...TAIL],
    records: { en: "Accounts & sanctions", hi: "खाते व स्वीकृतियाँ", bn: "অ্যাকাউন্ট ও অনুমোদন", ta: "கணக்குகள் & ஒப்புதல்கள்" },
  },
  {
    id: "incomeTax",
    name: { en: "Income Tax Department", hi: "आयकर विभाग", bn: "আয়কর দপ্তর", ta: "வருமான வரித் துறை" },
    office: { en: "Ward 2(1), Kanpur", hi: "वार्ड 2(1), कानपुर", bn: "ওয়ার্ড ২(১), কানপুর", ta: "வார்டு 2(1), கான்பூர்" },
    code: "ITD",
    tone: "neutral",
    officer: { name: "Nitin Agarwal", role: role.ito },
    services: ["taxes_income"],
    modules: [...CORE, "payments", ...TAIL],
    records: { en: "Processed returns", hi: "संसाधित रिटर्न", bn: "প্রক্রিয়াকৃত রিটার্ন", ta: "செயலாக்கப்பட்ட கணக்குகள்" },
  },
  {
    id: "grievance",
    name: { en: "Public Grievances", hi: "लोक शिकायत", bn: "জন অভিযোগ", ta: "பொதுக் குறைதீர்ப்பு" },
    office: { en: "District Grievance Cell, Kanpur", hi: "ज़िला शिकायत प्रकोष्ठ, कानपुर", bn: "জেলা অভিযোগ সেল, কানপুর", ta: "மாவட்டக் குறைதீர் பிரிவு, கான்பூர்" },
    code: "PGC",
    tone: "neutral",
    officer: { name: "Anita Desai", role: role.nodal },
    services: ["griev_file", "griev_track", "griev_feedback"],
    modules: ["overview", "grievances", "records", "audit"],
    records: { en: "Closed grievances", hi: "निस्तारित शिकायतें", bn: "নিষ্পত্তি অভিযোগ", ta: "தீர்க்கப்பட்ட குறைகள்" },
  },
];

export const getDepartment = (id: string | null | undefined) => DEPARTMENTS.find((d) => d.id === id);

/** Which department owns a task / scheme id (e.g. "cert_birth" → municipal). */
export function departmentFor(serviceId: string | undefined): Department | undefined {
  if (!serviceId) return undefined;
  const base = serviceId.replace(/_contest$/, "");
  return DEPARTMENTS.find((d) => d.services.includes(base));
}
