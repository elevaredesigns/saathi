"use client";

import { Camera, CaretDown, CheckCircle, Gavel, IdentificationCard, MagnifyingGlass, SealCheck, ShieldCheck, Car, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { Button } from "@/components/prototype/ui/Button";
import { SegmentedControl } from "@/components/prototype/ui/SegmentedControl";
import { Sheet } from "@/components/prototype/ui/Sheet";
import { Skeleton } from "@/components/prototype/ui/Skeleton";
import { getApplyFlow } from "@/lib/applyFlows";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { CHALLAN_PAYEE, CHALLANS, CITIZEN_VEHICLE, CONTEST_REASONS, challanBillId, formatFine, type Challan } from "@/lib/data/challans";
import { ease } from "@/lib/design/motion";
import { loc } from "@/lib/mockData";
import { PROTOTYPE_TODAY } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { useAppRouter } from "@/lib/navigation/useAppRouter";
import { ChallanEvidence } from "./ChallanEvidence";
import { Receipt } from "./Receipt";
import { UpiSheet } from "./UpiSheet";

type Phase = "lookup" | "searching" | "list" | "receipt";

const stamp = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())} IST`;
};

/**
 * e-Challan: find challans on your vehicle (auto-filled from the RC in
 * DigiLocker), see the camera evidence for each, pay any combination by UPI,
 * or contest one in the Virtual Court. Paid and contested challans persist.
 */
export function ChallanFlow() {
  const router = useAppRouter();
  const t = useTranslations("challan");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const { paidBills, submitted, markBillPaid, addApplication } = usePrototype();

  const [phase, setPhase] = useState<Phase>("lookup");
  const [by, setBy] = useState<"vehicle" | "licence">("vehicle");
  const [query, setQuery] = useState(CITIZEN_VEHICLE.number);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [contestFor, setContestFor] = useState<Challan | null>(null);
  const [reason, setReason] = useState(CONTEST_REASONS[0].id);
  const [contestDone, setContestDone] = useState(false);
  const [receipt, setReceipt] = useState<{ ref: string; amount: string } | null>(null);
  const completed = useRef(false);

  const contested = useMemo(() => new Set(submitted.map((a) => a.meta?.challan).filter(Boolean) as string[]), [submitted]);
  const isPaid = (c: Challan) => c.paid || paidBills.includes(challanBillId(c.no));
  const pending = CHALLANS.filter((c) => !isPaid(c) && !contested.has(c.no));
  const total = CHALLANS.filter((c) => selected.includes(c.no)).reduce((s, c) => s + c.fine, 0);

  const dateTime = (iso: string) =>
    new Intl.DateTimeFormat(locale === "en" ? "en-IN" : `${locale}-IN`, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", numberingSystem: "latn" }).format(new Date(iso));

  const search = () => {
    setPhase("searching");
    window.setTimeout(() => {
      setSelected(CHALLANS.filter((c) => !c.paid && !paidBills.includes(challanBillId(c.no)) && !contested.has(c.no)).map((c) => c.no));
      setPhase("list");
    }, reduce ? 200 : 1100);
  };

  const toggle = (no: string) => setSelected((s) => (s.includes(no) ? s.filter((x) => x !== no) : [...s, no]));

  const onPaid = () => {
    if (completed.current) return;
    completed.current = true;
    const ref = `TXN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const amount = formatFine(total);
    selected.forEach((no) => markBillPaid(challanBillId(no)));
    addApplication({
      id: `sub_${Date.now()}`,
      service: { en: `Traffic challans paid (${selected.length})`, hi: `ट्रैफ़िक चालान भुगतान (${selected.length})`, bn: `ট্রাফিক চালান পরিশোধ (${selected.length})`, ta: `போக்குவரத்து அபராதம் செலுத்தப்பட்டது (${selected.length})` },
      ref,
      date: PROTOTYPE_TODAY.toISOString(),
      status: "ready",
      flowId: "transport_challan",
      meta: { challans: selected.join(",") },
    });
    setPaying(false);
    setReceipt({ ref, amount });
    setSelected([]);
    setPhase("receipt");
  };

  const submitContest = () => {
    if (!contestFor) return;
    addApplication({
      id: `sub_${Date.now()}`,
      service: { en: "Challan contest · Virtual Court", hi: "चालान पर आपत्ति · वर्चुअल कोर्ट", bn: "চালানে আপত্তি · ভার্চুয়াল কোর্ট", ta: "அபராத மறுப்பு · மெய்நிகர் நீதிமன்றம்" },
      ref: `VC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      date: PROTOTYPE_TODAY.toISOString(),
      status: "submitted",
      flowId: "transport_challan_contest",
      meta: { challan: contestFor.no, reason },
    });
    setSelected((s) => s.filter((x) => x !== contestFor.no));
    setContestDone(true);
  };

  const baseFlow = getApplyFlow("transport_challan");

  if (phase === "receipt" && receipt) {
    return (
      <div className="min-h-[774px] pt-2">
        <Receipt flow={{ ...baseFlow, amount: receipt.amount }} refNumber={receipt.ref} onTrack={() => router.push("/prototype/track/")} onHome={() => router.push("/prototype/home/")} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[774px] flex-col">
      {/* Nav */}
      <div className="sticky -top-[var(--proto-top)] z-20 -mt-[var(--proto-top)] bg-white/85 pt-[var(--proto-top)] backdrop-blur-xl">
        <div className="flex h-[50px] items-center gap-3 px-3">
          <button type="button" onClick={() => (phase === "list" ? setPhase("lookup") : router.back())} aria-label={t("back")} className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 active:scale-90">
            <X size={20} weight="bold" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-[14px] font-semibold text-ink">{t("title")}</p>
            <p className="truncate text-[11px] text-ink-3">eChallan · Parivahan</p>
          </div>
          <span className="w-9" />
        </div>
      </div>

      <div className="flex-1 px-5 pb-4 pt-3">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "lookup" || phase === "searching" ? (
            <motion.div key="lookup" initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }}>
              <h1 className="text-[26px] font-semibold leading-tight tracking-[var(--track-tight)] text-ink">{t("heading")}</h1>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{t("intro")}</p>

              <SegmentedControl
                className="mt-5"
                value={by}
                onChange={(v) => {
                  setBy(v as "vehicle" | "licence");
                  setQuery(v === "vehicle" ? CITIZEN_VEHICLE.number : CITIZEN_VEHICLE.licence);
                }}
                options={[
                  { value: "vehicle", label: t("byVehicle") },
                  { value: "licence", label: t("byLicence") },
                ]}
              />

              <label className="mt-4 block">
                <span className="text-[13px] font-medium text-ink-2">{by === "vehicle" ? t("vehicleLabel") : t("licenceLabel")}</span>
                <div className="mt-1.5 flex items-center gap-3 rounded-[16px] bg-white px-4 ring-1 ring-inset ring-line-strong focus-within:ring-2 focus-within:ring-navy-600">
                  {by === "vehicle" ? <Car size={20} className="text-ink-3" /> : <IdentificationCard size={20} className="text-ink-3" />}
                  <input value={query} onChange={(e) => setQuery(e.target.value.toUpperCase())} className="h-[54px] min-w-0 flex-1 bg-transparent font-mono text-[18px] tracking-[0.08em] text-ink outline-none" />
                </div>
              </label>
              <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-green-800">
                <SealCheck size={14} weight="fill" className="text-green-600" />
                {t("fromRc", { model: CITIZEN_VEHICLE.model })}
              </p>

              {phase === "lookup" && (
                <ul className="mt-7 space-y-3">
                  {([
                    [Camera, "howEvidence"],
                    [CheckCircle, "howPay"],
                    [Gavel, "howContest"],
                  ] as const).map(([Glyph, key], i) => (
                    <motion.li key={key} initial={reduce ? false : { opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 0.35, ease: ease.out, delay: 0.1 + i * 0.07 }} className="flex items-start gap-3 rounded-[18px] bg-surface p-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-white text-navy-600 ring-1 ring-line">
                        <Glyph size={18} weight="duotone" />
                      </span>
                      <span className="text-[13.5px] leading-snug text-ink-2">{t(key)}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {phase === "searching" && (
                <div className="mt-6 space-y-3" aria-live="polite" aria-label={t("searching")}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3 rounded-[20px] p-3 ring-1 ring-line">
                      <Skeleton className="h-16 w-20 rounded-[12px]" />
                      <div className="flex-1 space-y-2 pt-1">
                        <Skeleton className="h-3.5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="list" initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: ease.out }}>
              {/* summary */}
              <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-navy-900 to-navy-700 p-4 text-white">
                <p className="font-mono text-[15px] tracking-[0.1em]">{CITIZEN_VEHICLE.number}</p>
                <p className="text-[12px] text-white/70">{CITIZEN_VEHICLE.model}</p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[12px] text-white/70">{pending.length ? t("pendingCount", { count: pending.length }) : t("allClear")}</p>
                    <p className="text-[30px] font-semibold leading-none tabular-nums">{formatFine(pending.reduce((s, c) => s + c.fine, 0))}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[11.5px] font-semibold ring-1 ring-inset ring-white/20">
                    <ShieldCheck size={13} weight="fill" />
                    {t("official")}
                  </span>
                </div>
              </div>

              <ul className="mt-4 space-y-3">
                {CHALLANS.map((c, i) => {
                  const paid = isPaid(c);
                  const inCourt = contested.has(c.no);
                  const actionable = !paid && !inCourt;
                  const checked = selected.includes(c.no);
                  const expanded = open === c.no;
                  return (
                    <motion.li
                      key={c.no}
                      initial={reduce ? false : { opacity: 0, transform: "translateY(12px)" }}
                      animate={{ opacity: 1, transform: "translateY(0px)" }}
                      transition={{ duration: 0.35, ease: ease.out, delay: i * 0.06 }}
                      className={cn("overflow-hidden rounded-[22px] bg-white ring-1 transition-shadow", checked ? "ring-2 ring-navy-600" : "ring-line", !actionable && "opacity-80")}
                    >
                      <div className="flex gap-3 p-3">
                        <button type="button" onClick={() => setOpen(expanded ? null : c.no)} aria-expanded={expanded} aria-label={t("evidence")} className="relative h-[68px] w-[92px] shrink-0 overflow-hidden rounded-[12px] ring-1 ring-black/10">
                          <ChallanEvidence kind={c.evidence} plate={c.vehicle} stamp={stamp(c.when)} className="h-full w-full" />
                          <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white">
                            <Camera size={11} weight="fill" />
                          </span>
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[14.5px] font-semibold leading-snug text-ink">{loc(c.violation, locale)}</p>
                            <p className="shrink-0 text-[15px] font-semibold tabular-nums text-ink">{formatFine(c.fine)}</p>
                          </div>
                          <p className="mt-0.5 truncate text-[12px] text-ink-3">
                            {dateTime(c.when)} · {loc(c.place, locale)}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <span className="font-mono text-[11px] text-ink-3">{c.section}</span>
                            {paid ? (
                              <span className="flex items-center gap-1 text-[12px] font-semibold text-green-800">
                                <CheckCircle size={14} weight="fill" className="text-green-600" />
                                {t("paid")}
                              </span>
                            ) : inCourt ? (
                              <span className="flex items-center gap-1 text-[12px] font-semibold text-violet-600">
                                <Gavel size={14} weight="fill" />
                                {t("inCourt")}
                              </span>
                            ) : (
                              <label className="flex cursor-pointer items-center gap-1.5 text-[12.5px] font-semibold text-navy-700">
                                <input type="checkbox" checked={checked} onChange={() => toggle(c.no)} className="h-[18px] w-[18px] accent-navy-600" />
                                {t("select")}
                              </label>
                            )}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: ease.out }} className="overflow-hidden">
                            <div className="px-3 pb-3">
                              <div className="overflow-hidden rounded-[14px] ring-1 ring-black/10">
                                <ChallanEvidence kind={c.evidence} plate={c.vehicle} stamp={stamp(c.when)} reading={c.reading} className="block w-full" />
                              </div>
                              <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
                                <dt className="text-ink-3">{t("challanNo")}</dt>
                                <dd className="text-right font-mono text-ink">{c.no}</dd>
                                <dt className="text-ink-3">{t("recordedBy")}</dt>
                                <dd className="text-right text-ink">{loc(c.source, locale)}</dd>
                              </dl>
                              {actionable && (
                                <button type="button" onClick={() => { setContestDone(false); setReason(CONTEST_REASONS[0].id); setContestFor(c); }} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[12px] py-2.5 text-[13.5px] font-semibold text-violet-600 ring-1 ring-inset ring-violet-100 active:bg-violet-50">
                                  <Gavel size={16} weight="bold" />
                                  {t("contest")}
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!expanded && (
                        <button type="button" onClick={() => setOpen(c.no)} className="flex w-full items-center justify-center gap-1 border-t border-line py-2 text-[12px] font-semibold text-ink-3 active:bg-surface">
                          {t("viewEvidence")}
                          <CaretDown size={12} weight="bold" />
                        </button>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
              <p className="mt-4 text-center text-[12px] leading-relaxed text-ink-3">{t("note")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sticky bottom-0 z-20 bg-gradient-to-t from-white via-white to-white/0 px-5 pb-3 pt-6">
        {phase === "list" ? (
          <Button fullWidth variant="saffron" disabled={total === 0} onClick={() => { completed.current = false; setPaying(true); }}>
            {total ? t("payAmount", { amount: formatFine(total), count: selected.length }) : t("selectToPay")}
          </Button>
        ) : (
          <Button fullWidth loading={phase === "searching"} disabled={query.trim().length < 6} onClick={search} iconLeft={<MagnifyingGlass size={18} weight="bold" />}>
            {t("find")}
          </Button>
        )}
      </div>

      <UpiSheet open={paying} amount={formatFine(total)} payee={CHALLAN_PAYEE} onClose={() => setPaying(false)} onPaid={onPaid} />

      <Sheet open={!!contestFor} onClose={() => setContestFor(null)} title={t("contestTitle")}>
        {contestFor &&
          (contestDone ? (
            <div className="pb-2 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                <Gavel size={28} weight="fill" />
              </span>
              <p className="mt-3 text-[17px] font-semibold text-ink">{t("contestDone")}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{t("contestDoneBody")}</p>
              <Button fullWidth className="mt-5" onClick={() => setContestFor(null)}>
                {t("done")}
              </Button>
            </div>
          ) : (
            <>
              <p className="-mt-1 text-[13.5px] leading-relaxed text-ink-2">{t("contestBody", { no: contestFor.no })}</p>
              <fieldset className="mt-4 space-y-2">
                <legend className="sr-only">{t("contestTitle")}</legend>
                {CONTEST_REASONS.map((r) => (
                  <label key={r.id} className={cn("flex cursor-pointer items-center gap-3 rounded-[14px] px-3.5 py-3 ring-1 ring-inset transition-colors", reason === r.id ? "bg-navy-50 ring-navy-200" : "ring-line")}>
                    <input type="radio" name="reason" checked={reason === r.id} onChange={() => setReason(r.id)} className="h-[18px] w-[18px] accent-navy-600" />
                    <span className="text-[14px] text-ink">{loc(r.label, locale)}</span>
                  </label>
                ))}
              </fieldset>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-3">{t("contestNote")}</p>
              <Button fullWidth className="mt-4" onClick={submitContest} iconLeft={<Gavel size={18} weight="bold" />}>
                {t("sendToCourt")}
              </Button>
            </>
          ))}
      </Sheet>
    </div>
  );
}
