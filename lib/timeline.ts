import { Locale } from "@/lib/i18n/config";
import { AppStatus, L, loc } from "@/lib/mockData";
import { formatDate } from "@/lib/utils/dateUtils";
import { STATUS_STAGE } from "@/lib/progress";

export type StepState = "done" | "current" | "upcoming";

export interface TimelineStep {
  id: string;
  name: string;
  sub?: string;
  officer?: string;
  role?: string;
  dateLabel?: string;
  state: StepState;
}

interface Stage {
  id: string;
  name: L;
  officer?: string;
  role?: L;
  offset: number; // days from submission
  sla?: L;
}

const STAGES: Stage[] = [
  {
    id: "submitted",
    name: { en: "Application submitted", hi: "आवेदन जमा हुआ", bn: "আবেদন জমা হয়েছে", ta: "விண்ணப்பம் சமர்ப்பிக்கப்பட்டது" },
    offset: 0,
  },
  {
    id: "review",
    name: { en: "Under review", hi: "समीक्षा में", bn: "পর্যালোচনাধীন", ta: "பரிசீலனையில்" },
    officer: "Priya Nair",
    role: { en: "Verifying officer", hi: "सत्यापन अधिकारी", bn: "যাচাই কর্মকর্তা", ta: "சரிபார்ப்பு அதிகாரி" },
    offset: 1,
    sla: { en: "Expected within 3 days", hi: "3 दिनों में अपेक्षित", bn: "3 দিনে প্রত্যাশিত", ta: "3 நாட்களில் எதிர்பார்க்கப்படுகிறது" },
  },
  {
    id: "verification",
    name: { en: "Document verification", hi: "दस्तावेज़ सत्यापन", bn: "নথি যাচাই", ta: "ஆவண சரிபார்ப்பு" },
    officer: "Anil Kumar",
    role: { en: "Field officer", hi: "क्षेत्र अधिकारी", bn: "ফিল্ড অফিসার", ta: "கள அதிகாரி" },
    offset: 4,
    sla: { en: "Expected within 5 days", hi: "5 दिनों में अपेक्षित", bn: "5 দিনে প্রত্যাশিত", ta: "5 நாட்களில் எதிர்பார்க்கப்படுகிறது" },
  },
  {
    id: "approved",
    name: { en: "Approved", hi: "स्वीकृत", bn: "অনুমোদিত", ta: "அங்கீகரிக்கப்பட்டது" },
    officer: "S. Reddy",
    role: { en: "Approving officer", hi: "अनुमोदन अधिकारी", bn: "অনুমোদন কর্মকর্তা", ta: "அங்கீகார அதிகாரி" },
    offset: 7,
    sla: { en: "Expected within 2 days", hi: "2 दिनों में अपेक्षित", bn: "2 দিনে প্রত্যাশিত", ta: "2 நாட்களில் எதிர்பார்க்கப்படுகிறது" },
  },
  {
    id: "ready",
    name: { en: "Ready to collect", hi: "प्राप्त करने को तैयार", bn: "সংগ্রহের জন্য প্রস্তুত", ta: "பெற தயார்" },
    offset: 9,
  },
];


export function buildTimeline(
  app: { date: string; status: AppStatus },
  locale: Locale,
): TimelineStep[] {
  const current = STATUS_STAGE[app.status];
  const base = new Date(app.date);

  return STAGES.map((st, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + st.offset);
    const state: StepState =
      i < current ? "done" : i === current ? "current" : "upcoming";

    const sub = st.officer && st.role ? `${loc(st.role, locale)} · ${st.officer}` : undefined;

    let dateLabel: string | undefined;
    if (state === "done") dateLabel = formatDate(d, locale);
    else if (state === "current") dateLabel = st.sla ? loc(st.sla, locale) : undefined;

    return {
      id: st.id,
      name: loc(st.name, locale),
      sub,
      officer: st.officer,
      role: st.role ? loc(st.role, locale) : undefined,
      dateLabel,
      state,
    };
  });
}
