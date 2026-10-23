"use client";

import {
  ArrowBendUpRight,
  Broadcast,
  CheckCircle,
  CloudCheck,
  CopySimple,
  Eye,
  Fingerprint,
  Flag,
  LockKey,
  PaperPlaneTilt,
  SealCheck,
  Signature,
  Stamp,
  UploadSimple,
  WarningCircle,
  X,
  XCircle,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { isOpen, slaLeft, type CaseStage, type ConsoleCase } from "@/lib/console/cases";
import type { Department } from "@/lib/console/departments";
import { ACCESS_PURPOSES, FLAGS, INFO_REASONS, REJECT_REASONS } from "@/lib/console/reasons";
import { useConsole } from "@/lib/console/store";
import { ease } from "@/lib/design/motion";
import { loc } from "@/lib/mockData";
import { formatDate, prototypeNow } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { RecordPreview } from "./RecordPreview";
import { Btn, Dialog, Initials, Pill, SlaPill, StagePill, Tabs, useToast } from "./ui";
import { useCaseActions } from "./useCases";

type Tab = "overview" | "documents" | "kyc" | "timeline";
type DialogKind = null | "approve" | "info" | "reject" | "forward" | "issue";

const RECORD_KINDS = new Set(["apply", "renew", "register"]);

export function CaseDrawer({ dept, kase, onClose }: { dept: Department; kase: ConsoleCase | null; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!kase) return;
    // Esc closes the drawer only when no confirmation dialog is open on top of it.
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && document.querySelectorAll("[role=dialog][aria-modal=true]").length <= 1 && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [kase, onClose]);
  if (!mounted) return null;
  return createPortal(<AnimatePresence>{kase && <DrawerBody key={kase.id} dept={dept} kase={kase} onClose={onClose} />}</AnimatePresence>, document.body);
}

function DrawerBody({ dept, kase, onClose }: { dept: Department; kase: ConsoleCase; onClose: () => void }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const toast = useToast();
  const { docChecks, kycOpen, kycResolved, audit, patch } = useConsole();
  const { officerEvents } = usePrototype();
  const { setStage, recordAccess } = useCaseActions(dept);

  const [tab, setTab] = useState<Tab>("overview");
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [copied, setCopied] = useState(false);

  const open = isOpen(kase.stage);
  const kycFlags = kase.flags.filter((f) => FLAGS[f].kyc);
  const uploads = kase.documents.map((d, i) => ({ ...d, i })).filter((d) => d.source === "upload");
  const pendingDocs = uploads.filter((d) => docChecks[`${kase.id}:${d.i}`] !== true);
  const kycBlocked = kycFlags.length > 0 && !kycResolved[kase.id];
  const blockers = [pendingDocs.length ? t("case.blockDocs", { count: pendingDocs.length }) : null, kycBlocked ? t("case.blockKyc") : null].filter(Boolean) as string[];

  const copy = () => {
    navigator.clipboard?.writeText(kase.ref).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const decide = (stage: CaseStage, msg: string, extra?: Parameters<typeof setStage>[2]) => {
    setStage(kase, stage, extra);
    setDialog(null);
    toast(kase.live ? `${msg} · ${t("case.citizenNotified")}` : msg, stage === "rejected" ? "red" : "green");
  };

  return (
    <div className="fixed inset-0 z-[100]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose} className="absolute inset-0 bg-[#0B0D14]/30" />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`${kase.applicant.name} · ${kase.ref}`}
        initial={reduce ? { opacity: 0 } : { transform: "translateX(100%)" }}
        animate={reduce ? { opacity: 1 } : { transform: "translateX(0%)" }}
        exit={reduce ? { opacity: 0 } : { transform: "translateX(100%)" }}
        transition={{ duration: 0.38, ease: ease.drawer }}
        className="absolute inset-y-0 right-0 flex w-full max-w-[640px] flex-col bg-white shadow-[-30px_0_80px_-40px_rgba(11,13,20,0.5)]"
      >
        {/* header */}
        <header className="border-b border-line px-5 pb-0 pt-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-[8px] bg-surface px-2 py-1 font-mono text-[12px] text-ink-2 ring-1 ring-inset ring-line hover:bg-surface2">
                  {kase.ref}
                  {copied ? <CheckCircle size={13} weight="fill" className="text-green-600" /> : <CopySimple size={13} />}
                </button>
                {kase.live && (
                  <Pill tone="green" icon={Broadcast}>
                    {t("case.liveLong")}
                  </Pill>
                )}
                <StagePill stage={kase.stage} />
                <SlaPill days={slaLeft(kase)} open={open} />
              </div>
              <h2 className="mt-2 truncate text-[20px] font-semibold tracking-[-0.015em] text-ink">{loc(kase.service, locale)}</h2>
            </div>
            <button type="button" onClick={onClose} aria-label={t("close")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-surface hover:text-ink">
              <X size={18} weight="bold" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-[14px] bg-surface/70 p-3">
            <Initials name={kase.applicant.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14.5px] font-semibold text-ink">{kase.applicant.name}</p>
              <p className="truncate text-[12.5px] text-ink-3">
                {t(`case.gender${kase.applicant.gender}`)} · {t("case.age", { age: kase.applicant.age })} · {kase.applicant.locality}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[12.5px] text-ink-2">XXXX XXXX {kase.applicant.aadhaarLast4}</p>
              <p className="text-[11.5px] text-ink-3">{t(`channel.${kase.channel}`)}</p>
            </div>
          </div>

          <Tabs
            className="mt-2 border-b-0"
            value={tab}
            onChange={setTab}
            items={[
              { value: "overview", label: t("case.tabOverview") },
              { value: "documents", label: t("case.tabDocuments"), count: kase.documents.length },
              { value: "kyc", label: t("case.tabKyc") },
              { value: "timeline", label: t("case.tabTimeline") },
            ]}
          />
        </header>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, transform: "translateY(6px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: ease.out }}>
              {tab === "overview" && <OverviewTab kase={kase} onGo={setTab} />}
              {tab === "documents" && <DocumentsTab dept={dept} kase={kase} />}
              {tab === "kyc" && <KycTab dept={dept} kase={kase} unlockedPurpose={kycOpen[kase.id]} onUnlock={(purposeId) => {
                const purpose = ACCESS_PURPOSES.find((p) => p.id === purposeId)!;
                patch((s) => ({ kycOpen: { ...s.kycOpen, [kase.id]: purposeId } }));
                recordAccess(kase, "viewedKyc", purpose.label);
                toast(kase.live ? t("kyc.loggedLive") : t("kyc.logged"), "navy");
              }} onResolve={(res) => {
                patch((s) => ({ kycResolved: { ...s.kycResolved, [kase.id]: res } }), { deptId: dept.id, kind: "kycResolved", subject: kase.ref, officer: dept.officer.name, note: res });
                toast(t(res === "accepted" ? "kyc.acceptedToast" : "kyc.askToast"));
              }} />}
              {tab === "timeline" && <TimelineTab kase={kase} audit={audit.filter((a) => a.subject === kase.ref)} events={kase.live ? officerEvents.filter((e) => e.appId === kase.live!.appId) : []} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* actions */}
        <footer className="border-t border-line bg-white px-5 py-3.5">
          {open ? (
            <>
              {blockers.length > 0 && (
                <p className="mb-2.5 flex items-center gap-1.5 text-[12.5px] text-saffron-700">
                  <WarningCircle size={14} weight="fill" />
                  {blockers.join(" · ")}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Btn variant="success" icon={Signature} disabled={blockers.length > 0} onClick={() => setDialog("approve")}>
                  {t("case.approve")}
                </Btn>
                <Btn icon={PaperPlaneTilt} onClick={() => setDialog("info")}>
                  {t("case.requestInfo")}
                </Btn>
                <Btn icon={ArrowBendUpRight} variant="ghost" onClick={() => setDialog("forward")}>
                  {t("case.forward")}
                </Btn>
                <Btn icon={XCircle} variant="danger" className="ml-auto" onClick={() => setDialog("reject")}>
                  {t("case.reject")}
                </Btn>
              </div>
            </>
          ) : kase.stage === "approved" && RECORD_KINDS.has(kase.kind) ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] text-ink-2">{t("case.readyToIssue")}</p>
              <Btn variant="primary" icon={Stamp} onClick={() => setDialog("issue")}>
                {t("case.issue", { record: loc(dept.records, locale) })}
              </Btn>
            </div>
          ) : kase.stage === "infoRequested" ? (
            <p className="flex items-center gap-2 text-[13px] text-ink-2">
              <PaperPlaneTilt size={16} className="text-saffron-700" />
              {t("case.waitingCitizen")}
            </p>
          ) : (
            <p className="flex items-center gap-2 text-[13px] text-ink-2">
              {kase.stage === "rejected" ? <XCircle size={16} weight="fill" className="text-red-600" /> : <SealCheck size={16} weight="fill" className="text-green-600" />}
              {t(kase.stage === "rejected" ? "case.closedRejected" : "case.closedIssued")}
            </p>
          )}
        </footer>
      </motion.aside>

      <ApproveDialog open={dialog === "approve"} kase={kase} dept={dept} onClose={() => setDialog(null)} onDone={() => decide("approved", t("case.approvedToast"))} />
      <InfoDialog open={dialog === "info"} kase={kase} onClose={() => setDialog(null)} onSend={(reason, note) => decide("infoRequested", t("case.infoToast"), { reason, note })} />
      <RejectDialog open={dialog === "reject"} onClose={() => setDialog(null)} onSend={(reason, note) => decide("rejected", t("case.rejectedToast"), { reason, note })} />
      <Dialog open={dialog === "forward"} onClose={() => setDialog(null)} title={t("case.forwardTitle")} description={t("case.forwardBody")}>
        <div className="grid gap-2">
          {(["verification", "decision"] as const).map((s) => (
            <button key={s} type="button" onClick={() => decide(s, t("case.forwardedToast"))} className="flex items-center gap-3 rounded-[14px] p-3.5 text-left ring-1 ring-inset ring-line hover:bg-surface">
              <ArrowBendUpRight size={18} className="text-navy-600" />
              <span>
                <span className="block text-[14px] font-semibold text-ink">{t(`case.forwardTo.${s}`)}</span>
                <span className="block text-[12.5px] text-ink-3">{t(`case.forwardHint.${s}`)}</span>
              </span>
            </button>
          ))}
        </div>
      </Dialog>
      <IssueDialog open={dialog === "issue"} kase={kase} dept={dept} onClose={() => setDialog(null)} onDone={() => decide("issued", t("case.issuedToast"))} />
    </div>
  );
}

/* ------------------------------------------------------------------ tabs --- */

function OverviewTab({ kase, onGo }: { kase: ConsoleCase; onGo: (t: Tab) => void }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  return (
    <div className="space-y-5">
      {kase.flags.length > 0 ? (
        <section>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">{t("case.checks")}</h3>
          <ul className="mt-2 space-y-2">
            {kase.flags.map((f) => (
              <li key={f} className="flex items-start gap-2.5 rounded-[12px] bg-saffron-50/70 p-3 ring-1 ring-inset ring-saffron-100">
                <Flag size={15} weight="fill" className="mt-0.5 shrink-0 text-saffron-700" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-ink">{loc(FLAGS[f].label, locale)}</p>
                  <p className="text-[12.5px] leading-snug text-ink-2">{loc(FLAGS[f].detail, locale)}</p>
                </div>
                <button type="button" onClick={() => onGo(FLAGS[f].kyc ? "kyc" : "documents")} className="shrink-0 text-[12.5px] font-semibold text-navy-600 hover:underline">
                  {t("case.check")}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="flex items-center gap-2 rounded-[12px] bg-green-50/70 p-3 text-[13.5px] text-green-800 ring-1 ring-inset ring-green-100">
          <CheckCircle size={16} weight="fill" className="text-green-600" />
          {t("case.allChecksPassed")}
        </p>
      )}

      <section>
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">{t("case.form")}</h3>
        <dl className="mt-2 divide-y divide-line rounded-[14px] ring-1 ring-line">
          {kase.fields.map((f, i) => (
            <div key={i} className="grid grid-cols-[40%_1fr] gap-3 px-3.5 py-2.5 text-[13px]">
              <dt className="text-ink-3">{loc(f.label, locale)}</dt>
              <dd className="font-medium text-ink">{f.value}</dd>
            </div>
          ))}
          <div className="grid grid-cols-[40%_1fr] gap-3 px-3.5 py-2.5 text-[13px]">
            <dt className="text-ink-3">{t("case.received")}</dt>
            <dd className="font-medium text-ink">{formatDate(kase.submittedAt, locale)}</dd>
          </div>
          {kase.fee && (
            <div className="grid grid-cols-[40%_1fr] gap-3 px-3.5 py-2.5 text-[13px]">
              <dt className="text-ink-3">{t("case.fee")}</dt>
              <dd className="flex items-center gap-1.5 font-medium text-ink">
                {kase.fee}
                <Pill tone="green">{t("case.feePaid")}</Pill>
              </dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}

function DocumentsTab({ dept, kase }: { dept: Department; kase: ConsoleCase }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const { docChecks, patch } = useConsole();
  const { recordAccess } = useCaseActions(dept);
  const [viewing, setViewing] = useState<number | null>(null);

  const mark = (i: number, ok: boolean) =>
    patch((s) => ({ docChecks: { ...s.docChecks, [`${kase.id}:${i}`]: ok } }), { deptId: dept.id, kind: ok ? "docVerified" : "docRejected", subject: kase.ref, officer: dept.officer.name, note: kase.documents[i].name.en });

  if (kase.documents.length === 0) return <p className="text-[13.5px] text-ink-3">{t("case.noDocuments")}</p>;

  return (
    <>
      <ul className="space-y-2">
        {kase.documents.map((d, i) => {
          const check = docChecks[`${kase.id}:${i}`];
          const fromLocker = d.source === "digilocker";
          return (
            <li key={i} className="flex flex-wrap items-center gap-3 rounded-[14px] p-3 ring-1 ring-inset ring-line">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-[10px]", fromLocker ? "bg-green-50 text-green-600" : "bg-saffron-50 text-saffron-700")}>
                {fromLocker ? <CloudCheck size={18} weight="duotone" /> : <UploadSimple size={18} weight="duotone" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-ink">{loc(d.name, locale)}</p>
                <p className="text-[12px] text-ink-3">{fromLocker ? t("case.fromLocker") : t("case.uploaded")}</p>
              </div>
              <Btn
                size="sm"
                variant="ghost"
                icon={Eye}
                onClick={() => {
                  setViewing(i);
                  recordAccess(kase, "viewedDocument", ACCESS_PURPOSES[0].label);
                }}
              >
                {t("case.view")}
              </Btn>
              {fromLocker ? (
                <Pill tone="green" icon={SealCheck}>
                  {t("case.issuerVerified")}
                </Pill>
              ) : check === true ? (
                <Pill tone="green" icon={CheckCircle}>
                  {t("case.verifiedByYou")}
                </Pill>
              ) : check === false ? (
                <Pill tone="red" icon={XCircle}>
                  {t("case.docRejected")}
                </Pill>
              ) : (
                <span className="flex gap-1.5">
                  <Btn size="sm" variant="success" onClick={() => mark(i, true)}>
                    {t("case.verify")}
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => mark(i, false)}>
                    {t("case.rejectDoc")}
                  </Btn>
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[12px] leading-relaxed text-ink-3">{t("case.docNote")}</p>

      <Dialog open={viewing !== null} onClose={() => setViewing(null)} title={viewing !== null ? loc(kase.documents[viewing].name, locale) : ""} description={t("case.viewLogged")} wide>
        {viewing !== null && <RecordPreview dept={dept} service={kase.documents[viewing].name} holder={kase.applicant.name} refNo={`DOC-${kase.ref.slice(-5)}-${viewing + 1}`} issuedAt={kase.submittedAt} signed={kase.documents[viewing].source === "digilocker"} />}
      </Dialog>
    </>
  );
}

function KycTab({ dept, kase, unlockedPurpose, onUnlock, onResolve }: { dept: Department; kase: ConsoleCase; unlockedPurpose?: string; onUnlock: (purposeId: string) => void; onResolve: (res: "accepted" | "askUpdate") => void }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const { kycResolved } = useConsole();
  const [purpose, setPurpose] = useState(ACCESS_PURPOSES[0].id);
  const kycFlags = kase.flags.filter((f) => FLAGS[f].kyc);
  const a = kase.applicant;
  const formName = kycFlags.includes("nameMismatch") ? a.name.replace(/(\w+) (\w+)/, "$1 K. $2") : a.name;

  const matches = useMemo(
    () => [
      { label: t("kyc.name"), aadhaar: a.name, form: formName, score: kycFlags.includes("nameMismatch") ? 84 : 100 },
      { label: t("kyc.dob"), aadhaar: `14/08/${2026 - a.age}`, form: kycFlags.includes("dobMismatch") ? `14/08/${2025 - a.age}` : `14/08/${2026 - a.age}`, score: kycFlags.includes("dobMismatch") ? 0 : 100 },
      { label: t("kyc.address"), aadhaar: `${a.locality}, Kanpur 2080${String(a.age % 90).padStart(2, "0")}`, form: `${a.locality}, Kanpur`, score: kycFlags.includes("addressChanged") ? 72 : 96 },
      { label: t("kyc.face"), aadhaar: "—", form: "—", score: kycFlags.includes("photoQuality") ? 61 : 98 },
    ],
    [a, formName, kycFlags, t],
  );

  if (!unlockedPurpose) {
    return (
      <div className="rounded-[16px] bg-surface/70 p-5 ring-1 ring-inset ring-line">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy-600 ring-1 ring-line">
          <LockKey size={20} weight="duotone" />
        </span>
        <h3 className="mt-3 text-[16px] font-semibold text-ink">{t("kyc.lockedTitle")}</h3>
        <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{kase.live ? t("kyc.lockedBodyLive") : t("kyc.lockedBody")}</p>
        <fieldset className="mt-4 space-y-2">
          <legend className="mb-1 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">{t("kyc.purpose")}</legend>
          {ACCESS_PURPOSES.map((p) => (
            <label key={p.id} className={cn("flex cursor-pointer items-center gap-2.5 rounded-[12px] bg-white px-3 py-2.5 text-[13.5px] ring-1 ring-inset", purpose === p.id ? "ring-navy-600" : "ring-line")}>
              <input type="radio" name="purpose" checked={purpose === p.id} onChange={() => setPurpose(p.id)} className="accent-navy-600" />
              {loc(p.label, locale)}
            </label>
          ))}
        </fieldset>
        <Btn variant="primary" icon={Fingerprint} className="mt-4" onClick={() => onUnlock(purpose)}>
          {t("kyc.unlock")}
        </Btn>
      </div>
    );
  }

  const resolved = kycResolved[kase.id];
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-[16px] p-4 ring-1 ring-inset ring-line">
        <div className="relative flex h-[108px] w-[86px] shrink-0 items-end justify-center overflow-hidden rounded-[10px] bg-gradient-to-b from-navy-50 to-navy-100 ring-1 ring-navy-100">
          <svg viewBox="0 0 86 108" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="43" cy="42" r="19" fill="#B9C8F0" />
            <path d="M10 108 Q14 72 43 70 Q72 72 76 108 Z" fill="#B9C8F0" />
          </svg>
          <span className="relative mb-1.5 rounded-full bg-white/85 px-1.5 text-[9.5px] font-semibold text-navy-700">{t("kyc.photoSample")}</span>
        </div>
        <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
          <div className="col-span-2">
            <dt className="text-ink-3">{t("kyc.name")}</dt>
            <dd className="font-semibold text-ink">{a.name}</dd>
          </div>
          <div>
            <dt className="text-ink-3">{t("kyc.dob")}</dt>
            <dd className="font-semibold text-ink">14/08/{2026 - a.age}</dd>
          </div>
          <div>
            <dt className="text-ink-3">{t("kyc.gender")}</dt>
            <dd className="font-semibold text-ink">{t(`case.gender${a.gender}`)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-ink-3">{t("kyc.aadhaar")}</dt>
            <dd className="font-mono font-semibold text-ink">XXXX XXXX {a.aadhaarLast4}</dd>
          </div>
        </dl>
      </div>
      <p className="flex items-center gap-1.5 text-[12.5px] text-ink-3">
        <Fingerprint size={14} className="text-navy-600" />
        {t("kyc.meta", { purpose: loc(ACCESS_PURPOSES.find((p) => p.id === unlockedPurpose)!.label, locale) })}
      </p>

      <section>
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">{t("kyc.matchTitle")}</h3>
        <ul className="mt-2 divide-y divide-line rounded-[14px] ring-1 ring-line">
          {matches.map((m) => (
            <li key={m.label} className="grid grid-cols-[1fr_auto] items-center gap-3 px-3.5 py-2.5">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-ink">{m.label}</p>
                {m.form !== "—" && m.form !== m.aadhaar && (
                  <p className="truncate text-[12px] text-ink-3">
                    {t("kyc.aadhaarSays")} <span className="font-medium text-ink-2">{m.aadhaar}</span> · {t("kyc.formSays")} <span className="font-medium text-ink-2">{m.form}</span>
                  </p>
                )}
              </div>
              <Pill tone={m.score >= 90 ? "green" : m.score >= 70 ? "saffron" : "red"} icon={m.score >= 90 ? CheckCircle : WarningCircle}>
                {m.score}%
              </Pill>
            </li>
          ))}
        </ul>
      </section>

      {kycFlags.length > 0 &&
        (resolved ? (
          <p className="flex items-center gap-2 rounded-[12px] bg-green-50/70 p-3 text-[13px] text-green-800 ring-1 ring-inset ring-green-100">
            <CheckCircle size={16} weight="fill" className="text-green-600" />
            {t(resolved === "accepted" ? "kyc.resolvedAccepted" : "kyc.resolvedAsk")}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Btn variant="success" icon={CheckCircle} onClick={() => onResolve("accepted")}>
              {t("kyc.accept")}
            </Btn>
            <Btn icon={PaperPlaneTilt} onClick={() => onResolve("askUpdate")}>
              {t("kyc.askUpdate")}
            </Btn>
          </div>
        ))}
      <p className="text-[12px] leading-relaxed text-ink-3">{t("kyc.footnote", { office: loc(dept.office, locale) })}</p>
    </div>
  );
}

function TimelineTab({ kase, audit, events }: { kase: ConsoleCase; audit: { id: string; kind: string; at: string; officer: string; note?: string }[]; events: { id: string; action: string; at: string; officer: string; note?: string }[] }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const fmt = (iso: string) => new Intl.DateTimeFormat(locale === "en" ? "en-IN" : `${locale}-IN`, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", numberingSystem: "latn" }).format(new Date(iso));
  const received = new Date(kase.submittedAt);
  const checked = new Date(received.getTime() + 4 * 60_000);
  const items = [
    { id: "r", title: t("timeline.received", { channel: t(`channel.${kase.channel}`) }), at: received.toISOString(), who: kase.applicant.name },
    { id: "c", title: t("timeline.autoChecks"), at: checked.toISOString(), who: t("timeline.system") },
    ...events.filter((e) => e.action === "citizenResponded").map((e) => ({ id: e.id, title: t("timeline.citizenResponded"), at: e.at, who: kase.applicant.name, note: e.note })),
    ...audit.map((a) => ({ id: a.id, title: t(`audit.kind.${a.kind}`), at: a.at, who: a.officer, note: a.note })),
  ].sort((x, y) => new Date(x.at).getTime() - new Date(y.at).getTime());

  return (
    <ol className="relative space-y-4 pl-6">
      <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
      {items.map((it, i) => (
        <li key={it.id} className="relative">
          <span aria-hidden className={cn("absolute -left-6 top-1 h-[15px] w-[15px] rounded-full ring-4 ring-white", i === items.length - 1 ? "bg-navy-600" : "bg-surface2")} />
          <p className="text-[13.5px] font-semibold text-ink">{it.title}</p>
          <p className="text-[12px] text-ink-3">
            {fmt(it.at)} · {it.who}
          </p>
          {"note" in it && it.note && <p className="mt-1 rounded-[10px] bg-surface px-3 py-2 text-[12.5px] text-ink-2">{it.note}</p>}
        </li>
      ))}
    </ol>
  );
}

/* --------------------------------------------------------------- dialogs --- */

function ApproveDialog({ open, kase, dept, onClose, onDone }: { open: boolean; kase: ConsoleCase; dept: Department; onClose: () => void; onDone: () => void }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const [phase, setPhase] = useState<"confirm" | "signing">("confirm");
  // onDone is a fresh closure every render; keep the latest in a ref so the
  // signing timer runs once per click and never re-arms after the dialog closes.
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (open) setPhase("confirm");
  }, [open]);
  useEffect(() => {
    if (!open || phase !== "signing") return;
    const id = window.setTimeout(() => {
      setPhase("confirm");
      done.current();
    }, 1300);
    return () => window.clearTimeout(id);
  }, [phase, open]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t("case.approveTitle")}
      description={t("case.approveBody", { service: loc(kase.service, locale), name: kase.applicant.name })}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Btn>
          <Btn variant="success" icon={Signature} loading={phase === "signing"} onClick={() => setPhase("signing")}>
            {phase === "signing" ? t("case.signing") : t("case.signApprove")}
          </Btn>
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-[14px] bg-surface p-3.5">
        <Signature size={22} className="text-navy-600" />
        <div className="text-[13px]">
          <p className="font-semibold text-ink">{dept.officer.name}</p>
          <p className="text-ink-3">{t("case.esignNote")}</p>
        </div>
      </div>
    </Dialog>
  );
}

function InfoDialog({ open, kase, onClose, onSend }: { open: boolean; kase: ConsoleCase; onClose: () => void; onSend: (reason: (typeof INFO_REASONS)[number]["label"], note: string) => void }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const [reason, setReason] = useState(INFO_REASONS[0].id);
  const [note, setNote] = useState(loc(INFO_REASONS[0].template, locale));
  useEffect(() => {
    if (!open) return;
    const pre = kase.flags.includes("nameMismatch") ? "mismatch" : INFO_REASONS[0].id;
    setReason(pre);
    setNote(loc(INFO_REASONS.find((r) => r.id === pre)!.template, locale));
  }, [open, kase, locale]);
  const r = INFO_REASONS.find((x) => x.id === reason)!;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t("case.infoTitle")}
      description={kase.live ? t("case.infoBodyLive") : t("case.infoBody")}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Btn>
          <Btn variant="primary" icon={PaperPlaneTilt} disabled={!note.trim()} onClick={() => onSend(r.label, note.trim())}>
            {t("case.send")}
          </Btn>
        </>
      }
    >
      <label className="block text-[12.5px] font-semibold text-ink-2">
        {t("case.reason")}
        <select
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setNote(loc(INFO_REASONS.find((x) => x.id === e.target.value)!.template, locale));
          }}
          className="mt-1.5 h-10 w-full rounded-[10px] bg-white px-3 text-[13.5px] font-normal text-ink ring-1 ring-inset ring-line-strong outline-none focus:ring-2 focus:ring-navy-600"
        >
          {INFO_REASONS.map((x) => (
            <option key={x.id} value={x.id}>
              {loc(x.label, locale)}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block text-[12.5px] font-semibold text-ink-2">
        {t("case.message")}
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mt-1.5 w-full resize-none rounded-[10px] bg-white p-3 text-[13.5px] font-normal leading-relaxed text-ink ring-1 ring-inset ring-line-strong outline-none focus:ring-2 focus:ring-navy-600" />
      </label>
      <p className="mt-2 text-[12px] text-ink-3">{t("case.plainLanguage")}</p>
    </Dialog>
  );
}

function RejectDialog({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (reason: (typeof REJECT_REASONS)[number]["label"], note: string) => void }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const [reason, setReason] = useState(REJECT_REASONS[0].id);
  const [note, setNote] = useState("");
  useEffect(() => {
    if (open) {
      setReason(REJECT_REASONS[0].id);
      setNote("");
    }
  }, [open]);
  const r = REJECT_REASONS.find((x) => x.id === reason)!;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t("case.rejectTitle")}
      description={t("case.rejectBody")}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Btn>
          <Btn variant="danger" icon={XCircle} disabled={note.trim().length < 10} onClick={() => onSend(r.label, `${r.rule} · ${note.trim()}`)}>
            {t("case.confirmReject")}
          </Btn>
        </>
      }
    >
      <fieldset className="space-y-2">
        {REJECT_REASONS.map((x) => (
          <label key={x.id} className={cn("flex cursor-pointer items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[13.5px] ring-1 ring-inset", reason === x.id ? "bg-red-50/60 ring-red-600/40" : "ring-line")}>
            <input type="radio" name="reject" checked={reason === x.id} onChange={() => setReason(x.id)} className="accent-red-600" />
            <span className="flex-1">{loc(x.label, locale)}</span>
            <span className="font-mono text-[11.5px] text-ink-3">{x.rule}</span>
          </label>
        ))}
      </fieldset>
      <label className="mt-3 block text-[12.5px] font-semibold text-ink-2">
        {t("case.explain")}
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder={t("case.explainPlaceholder")} className="mt-1.5 w-full resize-none rounded-[10px] bg-white p-3 text-[13.5px] font-normal leading-relaxed text-ink ring-1 ring-inset ring-line-strong outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-navy-600" />
      </label>
      <p className="mt-2 text-[12px] text-ink-3">{t("case.appealNote")}</p>
    </Dialog>
  );
}

function IssueDialog({ open, kase, dept, onClose, onDone }: { open: boolean; kase: ConsoleCase; dept: Department; onClose: () => void; onDone: () => void }) {
  const t = useTranslations("console");
  const [phase, setPhase] = useState<"preview" | "signing">("preview");
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (open) setPhase("preview");
  }, [open]);
  useEffect(() => {
    if (!open || phase !== "signing") return;
    const id = window.setTimeout(() => {
      setPhase("preview");
      done.current();
    }, 1400);
    return () => window.clearTimeout(id);
  }, [phase, open]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      wide
      title={t("case.issueTitle")}
      description={kase.live ? t("case.issueBodyLive") : t("case.issueBody")}
      footer={
        <>
          <Btn variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Btn>
          <Btn variant="primary" icon={Stamp} loading={phase === "signing"} onClick={() => setPhase("signing")}>
            {phase === "signing" ? t("case.issuing") : t("case.signIssue")}
          </Btn>
        </>
      }
    >
      <RecordPreview dept={dept} service={kase.service} holder={kase.applicant.name} refNo={kase.ref} issuedAt={prototypeNow().toISOString()} signed={phase === "signing"} />
    </Dialog>
  );
}
