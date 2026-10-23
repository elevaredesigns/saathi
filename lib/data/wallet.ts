/**
 * Document wallet — DigiLocker-backed documents shown as tinted cards.
 * All numbers are samples; nothing here is a real identity.
 */
import { DOCUMENTS, type Document, type L } from "@/lib/mockData";

export type WalletTint = "aadhaar" | "pan" | "dl" | "voter";

export interface WalletDoc extends Document {
  tint: WalletTint;
  issuer: L;
  validity: L;
  fields: { label: L; value: string }[];
}

const lbl = {
  name: { en: "Name", hi: "नाम", bn: "নাম", ta: "பெயர்" },
  dob: { en: "Date of birth", hi: "जन्म तिथि", bn: "জন্ম তারিখ", ta: "பிறந்த தேதி" },
  address: { en: "Address", hi: "पता", bn: "ঠিকানা", ta: "முகவரி" },
  class: { en: "Vehicle class", hi: "वाहन श्रेणी", bn: "যানবাহন শ্রেণি", ta: "வாகன வகை" },
  constituency: { en: "Constituency", hi: "निर्वाचन क्षेत्र", bn: "নির্বাচনী এলাকা", ta: "தொகுதி" },
  father: { en: "Father's name", hi: "पिता का नाम", bn: "পিতার নাম", ta: "தந்தை பெயர்" },
} satisfies Record<string, L>;

const EXTRA: Record<string, Omit<WalletDoc, keyof Document>> = {
  aadhaar: {
    tint: "aadhaar",
    issuer: { en: "UIDAI · via DigiLocker", hi: "UIDAI · डिजीलॉकर से", bn: "UIDAI · ডিজিলকার থেকে", ta: "UIDAI · டிஜிலாக்கர் வழி" },
    validity: { en: "Valid for life", hi: "आजीवन मान्य", bn: "আজীবন বৈধ", ta: "வாழ்நாள் செல்லுபடி" },
    fields: [
      { label: lbl.name, value: "Rakesh Verma" },
      { label: lbl.dob, value: "14/08/1991" },
      { label: lbl.address, value: "14 Civil Lines, Kanpur 208001" },
    ],
  },
  pan: {
    tint: "pan",
    issuer: { en: "Income Tax Department", hi: "आयकर विभाग", bn: "আয়কর দপ্তর", ta: "வருமான வரித் துறை" },
    validity: { en: "Valid for life", hi: "आजीवन मान्य", bn: "আজীবন বৈধ", ta: "வாழ்நாள் செல்லுபடி" },
    fields: [
      { label: lbl.name, value: "RAKESH VERMA" },
      { label: lbl.father, value: "RAMESH VERMA" },
      { label: lbl.dob, value: "14/08/1991" },
    ],
  },
  dl: {
    tint: "dl",
    issuer: { en: "Transport Dept. · Sarathi", hi: "परिवहन विभाग · सारथी", bn: "পরিবহণ দপ্তর · সারথি", ta: "போக்குவரத்துத் துறை · சாரதி" },
    validity: { en: "Valid till 22 Jul 2039", hi: "22 जुलाई 2039 तक मान्य", bn: "22 জুলাই 2039 পর্যন্ত বৈধ", ta: "22 ஜூலை 2039 வரை செல்லுபடி" },
    fields: [
      { label: lbl.name, value: "Rakesh Verma" },
      { label: lbl.class, value: "LMV · MCWG" },
      { label: lbl.dob, value: "14/08/1991" },
    ],
  },
  voter: {
    tint: "voter",
    issuer: { en: "Election Commission of India", hi: "भारत निर्वाचन आयोग", bn: "ভারতের নির্বাচন কমিশন", ta: "இந்தியத் தேர்தல் ஆணையம்" },
    validity: { en: "Verification pending", hi: "सत्यापन लंबित", bn: "যাচাই বাকি", ta: "சரிபார்ப்பு நிலுவையில்" },
    fields: [
      { label: lbl.name, value: "Rakesh Verma" },
      { label: lbl.constituency, value: "Kanpur Cantt." },
    ],
  },
};

export const WALLET: WalletDoc[] = DOCUMENTS.map((d) => ({ ...d, ...EXTRA[d.id] }));

export const getWalletDoc = (id: string | null) => WALLET.find((d) => d.id === id);
