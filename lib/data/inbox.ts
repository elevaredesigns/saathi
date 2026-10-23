/**
 * The citizen's inbox and access log, merged with what officers did in the
 * department consoles: decisions become notifications, looks at personal data
 * become access-log entries. Built-in samples come after the live events.
 */
import type { OfficerEvent } from "@/lib/context/PrototypeContext";
import type { L } from "@/lib/mockData";
import type { Locale } from "@/lib/i18n/config";
import { ACCESS_LOG, type AccessEvent } from "./privacy";
import { NOTIFICATIONS, type AppNotification, type NotificationIcon } from "./notifications";

const fill = (template: L, service: L): L =>
  Object.fromEntries(Object.entries(template).map(([k, v]) => [k, v.replace("{service}", service[k as Locale] ?? service.en)])) as L;

const TITLES: Partial<Record<OfficerEvent["action"], { icon: NotificationIcon; title: L }>> = {
  approved: { icon: "check", title: { en: "{service} approved", hi: "{service} स्वीकृत", bn: "{service} অনুমোদিত", ta: "{service} அங்கீகரிக்கப்பட்டது" } },
  issued: { icon: "check", title: { en: "{service} is ready", hi: "{service} तैयार है", bn: "{service} তৈরি", ta: "{service} தயார்" } },
  infoRequested: { icon: "alert", title: { en: "Action needed: {service}", hi: "कार्रवाई ज़रूरी: {service}", bn: "পদক্ষেপ দরকার: {service}", ta: "நடவடிக்கை தேவை: {service}" } },
  rejected: { icon: "x", title: { en: "{service} not approved", hi: "{service} स्वीकृत नहीं", bn: "{service} অনুমোদিত হয়নি", ta: "{service} அங்கீகரிக்கப்படவில்லை" } },
  forwarded: { icon: "clock", title: { en: "{service} moved to the next desk", hi: "{service} अगली डेस्क पर पहुँचा", bn: "{service} পরের টেবিলে গেছে", ta: "{service} அடுத்த மேசைக்குச் சென்றது" } },
};

export function buildInbox(events: OfficerEvent[]): AppNotification[] {
  const live: AppNotification[] = events.flatMap((e) => {
    const meta = TITLES[e.action];
    if (!meta) return [];
    const body: L = Object.fromEntries(
      Object.keys(e.office).map((k) => {
        const l = k as Locale;
        const reason = e.reason ? ` — ${e.reason[l] ?? e.reason.en}` : "";
        return [l, `${e.officer} · ${e.office[l] ?? e.office.en}${reason}`];
      }),
    ) as L;
    return [{ id: `ev_${e.id}`, icon: meta.icon, title: fill(meta.title, e.service), body, when: e.at, href: `/prototype/status/?id=${e.appId}` }];
  });
  return [...live, ...NOTIFICATIONS];
}

const VIEWED: Record<"viewedKyc" | "viewedDocument", L> = {
  viewedKyc: { en: "Viewed your e-KYC record", hi: "आपका ई-केवाईसी रिकॉर्ड देखा", bn: "আপনার ই-কেওয়াইসি রেকর্ড দেখেছেন", ta: "உங்கள் மின்-கேஒய்சி பதிவைப் பார்த்தார்" },
  viewedDocument: { en: "Opened a document you shared", hi: "आपका साझा किया दस्तावेज़ खोला", bn: "আপনার শেয়ার করা নথি খুলেছেন", ta: "நீங்கள் பகிர்ந்த ஆவணத்தைத் திறந்தார்" },
};

export function buildAccessLog(events: OfficerEvent[]): AccessEvent[] {
  const live: AccessEvent[] = events
    .filter((e): e is OfficerEvent & { action: "viewedKyc" | "viewedDocument" } => e.action === "viewedKyc" || e.action === "viewedDocument")
    .map((e) => ({
      id: `ac_${e.id}`,
      who: Object.fromEntries(Object.keys(e.office).map((k) => [k, `${e.officer} · ${e.office[k as Locale] ?? e.office.en}`])) as L,
      what: VIEWED[e.action],
      purpose: e.purpose ?? e.service,
      when: e.at,
    }));
  return [...live, ...ACCESS_LOG];
}
