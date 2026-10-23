"use client";

import { Broadcast, Gavel, Plus, Siren } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { ChallanEvidence } from "@/components/prototype/apply/ChallanEvidence";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { challanBillId, CHALLANS, formatFine, type EvidenceKind } from "@/lib/data/challans";
import { jurisdictionChallans, type JurisdictionChallan } from "@/lib/console/operations";
import { VIOLATIONS } from "@/lib/console/reasons";
import { useConsole } from "@/lib/console/store";
import { loc, type L } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { prototypeNow } from "@/lib/utils/dateUtils";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { Btn, Card, Dialog, Pill, Tabs, useToast } from "../ui";

type Status = "pending" | "court" | "paid" | "withdrawn";
const EVIDENCE: Record<string, EvidenceKind> = { speed: "speed", redLight: "redLight", parking: "parking", seatbelt: "seatbelt", helmet: "speed", insurance: "parking" };

const WITHDRAWN: L = { en: "Challan withdrawn by the Virtual Court", hi: "वर्चुअल कोर्ट ने चालान वापस लिया", bn: "ভার্চুয়াল কোর্ট চালান প্রত্যাহার করেছে", ta: "மெய்நிகர் நீதிமன்றம் அபராதத்தைத் திரும்பப் பெற்றது" };
const UPHELD: L = { en: "Challan upheld — please pay within 60 days", hi: "चालान बरक़रार — कृपया 60 दिनों में भुगतान करें", bn: "চালান বহাল — ৬০ দিনের মধ্যে পরিশোধ করুন", ta: "அபராதம் உறுதி — 60 நாட்களுக்குள் செலுத்தவும்" };

export function ChallansModule({ dept }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const toast = useToast();
  const { paidBills, submitted, recordOfficerEvent } = usePrototype();
  const { court, challansIssued, patch } = useConsole();
  const [tab, setTab] = useState<Status | "all">("pending");
  const [open, setOpen] = useState<JurisdictionChallan | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [form, setForm] = useState({ vehicle: "", violation: VIOLATIONS[0].id, place: "" });

  const rows = useMemo(() => {
    const issued: JurisdictionChallan[] = challansIssued.map((c) => {
      const v = VIOLATIONS.find((x) => x.id === c.violationId) ?? VIOLATIONS[0];
      return { no: c.no, vehicle: c.vehicle, violationId: v.id, violation: v.label, section: v.section, fine: v.fine, at: c.at, place: c.place, initial: "pending" };
    });
    return [...issued, ...jurisdictionChallans()].map((c) => {
      const contest = c.live ? submitted.find((a) => a.meta?.challan === c.no) : undefined;
      let status: Status = c.initial === "paid" ? "paid" : c.initial === "court" ? "court" : "pending";
      if (c.live && paidBills.includes(challanBillId(c.no))) status = "paid";
      if (contest) status = "court";
      if (court[c.no] === "dismissed") status = "withdrawn";
      if (court[c.no] === "upheld" && status === "court") status = "pending";
      return { ...c, status, contest };
    });
  }, [challansIssued, submitted, paidBills, court]);

  const list = rows.filter((r) => tab === "all" || r.status === tab);
  const count = (s: Status) => rows.filter((r) => r.status === s).length;
  const collected = rows.filter((r) => r.status === "paid").reduce((s, r) => s + r.fine, 0);
  const fmt = (iso: string) => new Intl.DateTimeFormat(locale === "en" ? "en-IN" : `${locale}-IN`, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", numberingSystem: "latn" }).format(new Date(iso));

  const decide = (row: (typeof rows)[number], decision: "upheld" | "dismissed") => {
    patch((s) => ({ court: { ...s.court, [row.no]: decision } }), { deptId: dept.id, kind: "courtDecision", subject: row.no, officer: dept.officer.name, note: decision });
    if (row.contest) {
      recordOfficerEvent(
        { id: `court-${row.no}-${Date.now()}`, appId: row.contest.id, ref: row.contest.ref, service: row.contest.service, action: decision === "dismissed" ? "approved" : "rejected", officer: "Virtual Court (Traffic)", office: dept.office, reason: decision === "dismissed" ? WITHDRAWN : UPHELD, at: prototypeNow().toISOString() },
        decision === "dismissed" ? "approved" : "rejected",
      );
    }
    toast(t(decision === "dismissed" ? "challans.dismissedToast" : "challans.upheldToast", { no: row.no }), decision === "dismissed" ? "green" : "navy");
    setOpen(null);
  };

  return (
    <>
      <ModuleHeader
        title={t("modules.challans")}
        subtitle={t("challans.subtitle")}
        actions={
          <Btn variant="primary" icon={Plus} onClick={() => setIssuing(true)}>
            {t("challans.issue")}
          </Btn>
        }
      />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: t("challans.pending"), value: String(count("pending")) },
          { label: t("challans.inCourt"), value: String(count("court")) },
          { label: t("challans.collected"), value: formatFine(collected) },
        ].map((k) => (
          <div key={k.label} className="rounded-[16px] border border-line bg-white p-4">
            <p className="text-[13px] text-ink-2">{k.label}</p>
            <p className="mt-2 text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-ink">{k.value}</p>
          </div>
        ))}
      </div>

      <Card className="mt-4" padded={false}>
        <div className="px-4 pt-1">
          <Tabs
            className="border-b-0"
            value={tab}
            onChange={setTab}
            items={[
              { value: "pending", label: t("challans.tabPending"), count: count("pending") },
              { value: "court", label: t("challans.tabCourt"), count: count("court") },
              { value: "paid", label: t("challans.tabPaid"), count: count("paid") },
              { value: "all", label: t("apps.filterAll"), count: rows.length },
            ]}
          />
        </div>
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full min-w-[860px] text-left text-[13px]">
            <thead>
              <tr className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">
                <th className="px-5 py-2.5">{t("challans.colNo")}</th>
                <th className="px-3 py-2.5">{t("challans.colVehicle")}</th>
                <th className="px-3 py-2.5">{t("challans.colViolation")}</th>
                <th className="px-3 py-2.5">{t("challans.colWhen")}</th>
                <th className="px-3 py-2.5 text-right">{t("challans.colFine")}</th>
                <th className="px-5 py-2.5">{t("apps.colStage")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((r) => (
                <tr key={r.no} onClick={() => setOpen(r)} className={cn("cursor-pointer hover:bg-surface/60", r.live && "bg-green-50/40")}>
                  <td className="px-5 py-2.5">
                    <p className="flex items-center gap-1.5 font-mono text-[12px] text-ink">
                      {r.no}
                      {r.live && <Broadcast size={13} className="text-green-600" aria-label={t("liveBadge")} />}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[12px] text-ink-2">{r.vehicle}</td>
                  <td className="px-3 py-2.5">
                    <p className="text-ink">{loc(r.violation, locale)}</p>
                    <p className="font-mono text-[11px] text-ink-3">MV Act {r.section}</p>
                  </td>
                  <td className="px-3 py-2.5 text-ink-2">
                    <p>{fmt(r.at)}</p>
                    <p className="text-[11.5px] text-ink-3">{typeof r.place === "string" ? r.place : loc(r.place, locale)}</p>
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-ink">{formatFine(r.fine)}</td>
                  <td className="px-5 py-2.5">
                    <Pill tone={r.status === "paid" ? "green" : r.status === "court" ? "violet" : r.status === "withdrawn" ? "neutral" : "saffron"} icon={r.status === "court" ? Gavel : undefined}>
                      {t(`challans.status.${r.status}`)}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!open} onClose={() => setOpen(null)} wide title={open ? `${loc(open.violation, locale)} · ${open.vehicle}` : ""} description={open ? `${open.no} · MV Act ${open.section}` : ""}>
        {open && (
          <>
            <div className="overflow-hidden rounded-[14px] ring-1 ring-black/10">
              <ChallanEvidence kind={EVIDENCE[open.violationId] ?? "speed"} plate={open.vehicle} stamp={new Date(open.at).toISOString().slice(0, 16).replace("T", " ")} reading={CHALLANS.find((c) => c.no === open.no)?.reading} className="block w-full" />
            </div>
            {(() => {
              const row = rows.find((r) => r.no === open.no)!;
              return row.status === "court" ? (
                <div className="mt-4 rounded-[14px] bg-violet-50/60 p-4 ring-1 ring-inset ring-violet-100">
                  <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                    <Gavel size={18} className="text-violet-600" />
                    {t("challans.courtTitle")}
                  </p>
                  <p className="mt-1 text-[13px] text-ink-2">{row.contest ? t("challans.courtBodyLive") : t("challans.courtBody")}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Btn variant="success" onClick={() => decide(row, "dismissed")}>
                      {t("challans.dismiss")}
                    </Btn>
                    <Btn onClick={() => decide(row, "upheld")}>{t("challans.uphold")}</Btn>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-[13px] text-ink-3">{t(`challans.statusNote.${row.status}`)}</p>
              );
            })()}
          </>
        )}
      </Dialog>

      <Dialog
        open={issuing}
        onClose={() => setIssuing(false)}
        title={t("challans.issueTitle")}
        description={t("challans.issueBody")}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setIssuing(false)}>
              {t("cancel")}
            </Btn>
            <Btn
              variant="primary"
              icon={Siren}
              disabled={form.vehicle.trim().length < 6 || !form.place.trim()}
              onClick={() => {
                const no = `UP7826${String(Date.now()).slice(-8)}`;
                patch((s) => ({ challansIssued: [{ no, vehicle: form.vehicle.toUpperCase(), violationId: form.violation, place: form.place, at: prototypeNow().toISOString() }, ...s.challansIssued] }), { deptId: dept.id, kind: "challanIssued", subject: no, officer: dept.officer.name });
                toast(t("challans.issuedToast", { vehicle: form.vehicle.toUpperCase() }));
                setIssuing(false);
                setForm({ vehicle: "", violation: VIOLATIONS[0].id, place: "" });
                setTab("pending");
              }}
            >
              {t("challans.issueConfirm")}
            </Btn>
          </>
        }
      >
        <div className="grid gap-3">
          <label className="text-[12.5px] font-semibold text-ink-2">
            {t("challans.colVehicle")}
            <input value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} placeholder="UP78 AB 1234" className="mt-1.5 h-10 w-full rounded-[10px] px-3 font-mono text-[14px] font-normal uppercase text-ink ring-1 ring-inset ring-line-strong outline-none focus:ring-2 focus:ring-navy-600" />
          </label>
          <label className="text-[12.5px] font-semibold text-ink-2">
            {t("challans.colViolation")}
            <select value={form.violation} onChange={(e) => setForm({ ...form, violation: e.target.value })} className="mt-1.5 h-10 w-full rounded-[10px] bg-white px-3 text-[13.5px] font-normal text-ink ring-1 ring-inset ring-line-strong outline-none focus:ring-2 focus:ring-navy-600">
              {VIOLATIONS.map((v) => (
                <option key={v.id} value={v.id}>
                  {loc(v.label, locale)} · MV Act {v.section} · {formatFine(v.fine)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[12.5px] font-semibold text-ink-2">
            {t("challans.place")}
            <input value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="Mall Road" className="mt-1.5 h-10 w-full rounded-[10px] px-3 text-[13.5px] font-normal text-ink ring-1 ring-inset ring-line-strong outline-none focus:ring-2 focus:ring-navy-600" />
          </label>
        </div>
      </Dialog>
    </>
  );
}
