"use client";

import { ArrowRight, Bell, Broadcast, CheckCircle, ClockCounterClockwise, Compass, Eye, Fingerprint, House, ListChecks, LockKey, LockKeyOpen, SealCheck, Stamp, UserCircle, Wallet, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { serviceName } from "@/lib/console/cases";
import { DEPARTMENTS } from "@/lib/console/departments";
import { ACCESS_PURPOSES } from "@/lib/console/reasons";
import { ease } from "@/lib/design/motion";
import { displayName } from "@/lib/i18n/names";
import { loc } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const ICONS: Icon[] = [Fingerprint, Broadcast, Stamp, Eye];
/** How long each chapter of the story holds before the next one plays. */
const STEP_MS = 5600;
/** Within a chapter: the officer acts, then the citizen's phone hears about it. */
const ACT_MS = 1300;
const ARRIVE_MS = 2100;

const DEPT = DEPARTMENTS.find((d) => d.id === "municipal")!;
const CITIZEN = "Rakesh Verma";
const REF = "KNN-2026-10307";
const RECORD_NO = "BC-2026-UP-07734";
const TIMES = ["10:42", "10:44", "10:46"];

/**
 * Both sides of the counter, played as one story: an officer in the
 * department console acts, and the same moment lands on the citizen's phone.
 * Four chapters — purpose-first e-KYC, a live decision, a signed record, the
 * audit trail — advance on their own while the stage is on screen and can be
 * picked directly. Every label is the console's and the app's own copy.
 */
export function Departments() {
  const t = useTranslations("site.departments");
  const reduce = useReducedMotion();
  const points = t.raw("points") as { title: string; body: string }[];
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.35 });
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState(0);
  const [hold, setHold] = useState(false);

  // Play the chapter: officer acts, then the phone updates.
  useEffect(() => {
    if (reduce) {
      setPhase(2);
      return;
    }
    if (!inView) return;
    setPhase(0);
    const a = window.setTimeout(() => setPhase(1), ACT_MS);
    const b = window.setTimeout(() => setPhase(2), ARRIVE_MS);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [step, inView, reduce]);

  // Move on to the next chapter while the stage is visible and not held.
  const running = inView && !hold && !reduce;
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % points.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [step, running, points.length]);

  return (
    <section id="departments" className="scroll-mt-20 overflow-hidden px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-page">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-navy-600">{t("eyebrow")}</p>
            <TextReveal as="h2" text={t("title")} className="mt-4 text-h1 text-ink" />
          </div>
          <Reveal>
            <p className="text-[18px] leading-relaxed text-ink-2">{t("intro")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/console/" className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]">
                {t("cta")}
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link href="/console/?d=transport&m=challans" className="inline-flex h-12 items-center rounded-full bg-white px-5 text-[15px] font-semibold text-ink ring-1 ring-line-strong transition-transform duration-150 active:scale-[0.97]">
                {t("ctaSecondary")}
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <div
            ref={stageRef}
            onPointerEnter={() => setHold(true)}
            onPointerLeave={() => setHold(false)}
            onFocus={() => setHold(true)}
            onBlur={() => setHold(false)}
            className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-4 sm:p-6 lg:p-10"
          >
            <Guilloche tone="white" opacity={0.08} className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px]" />
            <Guilloche variant="band" tone="white" opacity={0.07} className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full" />

            <div className="relative grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_88px_276px] lg:items-stretch lg:gap-0">
              <ConsoleWindow step={step} phase={phase} />
              <Relay step={step} phase={phase} />
              <Phone step={step} phase={phase} />
            </div>

            <div role="tablist" aria-label={t("eyebrow")} className="relative mt-6 grid grid-cols-2 gap-2 lg:mt-10 lg:grid-cols-4 lg:gap-3">
              {points.map((p, i) => {
                const Glyph = ICONS[i];
                const active = i === step;
                return (
                  <button
                    key={p.title}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setStep(i)}
                    className={cn(
                      "group relative overflow-hidden rounded-[18px] p-4 text-left transition-colors duration-300 lg:p-5",
                      active ? "bg-white/[0.12]" : "hover:bg-white/[0.06]",
                    )}
                  >
                    <span aria-hidden className="absolute inset-x-4 top-0 h-[2px] overflow-hidden rounded-full bg-white/10 lg:inset-x-5">
                      {active && (
                        <motion.span
                          key={`${step}-${running}`}
                          className="block h-full origin-left bg-white"
                          initial={{ transform: running ? "scaleX(0)" : "scaleX(1)" }}
                          animate={{ transform: "scaleX(1)" }}
                          transition={{ duration: running ? STEP_MS / 1000 : 0, ease: "linear" }}
                        />
                      )}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <Glyph size={20} weight={active ? "fill" : "duotone"} className={cn("shrink-0 transition-colors", active ? "text-white" : "text-white/55")} />
                      <span className={cn("text-[15px] font-semibold leading-snug transition-colors lg:text-[16px]", active ? "text-white" : "text-white/70 group-hover:text-white/90")}>{p.title}</span>
                    </span>
                    <span className={cn("mt-2 hidden text-[14px] leading-relaxed transition-colors lg:block", active ? "text-white/80" : "text-white/45")}>{p.body}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ console --- */

const MODULE_BY_STEP = ["kyc", "applications", "records", "audit"] as const;

function ConsoleWindow({ step, phase }: { step: number; phase: number }) {
  const tc = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const modules = ["overview", "applications", "kyc", "records", "audit"] as const;

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)] lg:self-center lg:h-[580px]">
      <div className="flex h-11 items-center gap-3 border-b border-line bg-surface px-4">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </span>
        <span className="flex min-w-0 items-center gap-1.5 text-[12.5px] font-semibold text-ink">
          <SaathiMark size={14} />
          <span className="truncate">{tc("brand")}</span>
          <span className="hidden truncate font-normal text-ink-3 sm:inline">· {loc(DEPT.office, locale)}</span>
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-saffron-50 px-2 py-0.5 text-[11px] font-semibold text-saffron-700">{tc("sample")}</span>
      </div>

      <div className="flex h-[440px] lg:h-auto lg:min-h-0 lg:flex-1">
        <nav aria-hidden className="hidden w-[190px] shrink-0 flex-col gap-0.5 border-r border-line bg-[#FBFBFC] p-3 md:flex">
          {modules.map((m) => {
            const on = m === MODULE_BY_STEP[step];
            return (
              <span key={m} className={cn("relative rounded-[10px] px-3 py-2 text-[13px] font-medium transition-colors duration-300", on ? "text-navy-700" : "text-ink-3")}>
                {on && <motion.span layoutId="dept-module" transition={{ type: "spring", duration: 0.45, bounce: 0.12 }} className="absolute inset-0 rounded-[10px] bg-navy-50" />}
                <span className="relative">{tc(`modules.${m}`)}</span>
              </span>
            );
          })}
          <div className="mt-auto flex items-center gap-2 border-t border-line px-1 pt-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-600 text-[10.5px] font-semibold text-white">PN</span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-semibold text-ink">{DEPT.officer.name}</span>
              <span className="block truncate text-[11px] text-ink-3">{loc(DEPT.officer.role, locale)}</span>
            </span>
          </div>
        </nav>

        <div className="relative min-w-0 flex-1 p-4 pb-12 sm:p-6 sm:pb-12">
          {step < 3 && <CasePipeline step={step} phase={phase} />}
          <p className="absolute inset-x-4 bottom-3 truncate text-[11px] text-ink-3 sm:inset-x-6">{tc("disclaimer")}</p>
          {step < 3 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface2 text-[12px] font-semibold text-ink-2">RV</span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-semibold text-ink">{displayName(CITIZEN, locale)}</span>
                <span className="block truncate text-[12.5px] text-ink-3">
                  {loc(serviceName("cert_birth"), locale)} · <span className="font-mono">{REF}</span>
                </span>
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11.5px] font-semibold text-green-800">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                {tc("case.liveLong")}
              </span>
            </div>
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, transform: "translateY(10px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-6px)" }}
              transition={{ duration: 0.35, ease: ease.out }}
            >
              {step === 0 && <KycScene phase={phase} />}
              {step === 1 && <DecisionScene phase={phase} />}
              {step === 2 && <RecordScene phase={phase} />}
              {step === 3 && <AuditScene phase={phase} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const PIPELINE = ["new", "docCheck", "decision", "approved", "issued"] as const;

/** Where the case stands — it moves forward as the officer acts in each chapter. */
function CasePipeline({ step, phase }: { step: number; phase: number }) {
  const tc = useTranslations("console");
  const acted = phase >= 1;
  const reached = step === 0 ? 1 : step === 1 ? (acted ? 3 : 2) : acted ? 4 : 3;
  return (
    <ol aria-hidden className="absolute inset-x-6 bottom-12 hidden grid-cols-5 border-t border-line pt-4 lg:grid">
      {PIPELINE.map((stage, i) => {
        const done = i < reached;
        const current = i === reached;
        return (
          <li key={stage} className="relative flex flex-col items-start gap-2 pr-2">
            {i < PIPELINE.length - 1 && (
              <span className="absolute left-3 right-0 top-[5px] h-0.5 overflow-hidden rounded-full bg-surface2">
                <motion.span className="block h-full bg-navy-600" initial={false} animate={{ width: done ? "100%" : "0%" }} transition={{ duration: 0.5, ease: ease.out }} />
              </span>
            )}
            <span className={cn("relative h-3 w-3 rounded-full ring-2 transition-colors duration-300", done ? "bg-navy-600 ring-navy-600" : current ? "bg-white ring-navy-600" : "bg-white ring-line-strong")}>
              {current && <span className="absolute inset-0 animate-ping rounded-full bg-navy-400/40" />}
            </span>
            <span className={cn("truncate text-[11.5px] transition-colors duration-300", current ? "font-semibold text-navy-700" : done ? "text-ink-2" : "text-ink-3")}>{tc(`stage.${stage}`)}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Toast({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          initial={{ opacity: 0, transform: "translateY(8px) scale(0.97)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: ease.out }}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-[13px] font-semibold text-white"
        >
          <CheckCircle size={16} weight="fill" className="text-[#8BE3AE]" />
          {children}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function PressButton({ pressed, children, tone = "primary" }: { pressed: boolean; children: ReactNode; tone?: "primary" | "quiet" }) {
  return (
    <motion.span
      animate={pressed ? { transform: ["scale(1)", "scale(0.94)", "scale(1)"] } : { transform: "scale(1)" }}
      transition={{ duration: 0.35, ease: ease.out }}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-[12px] px-4 text-[13.5px] font-semibold",
        tone === "primary" ? (pressed ? "bg-green-600 text-white" : "bg-navy-600 text-white") : "bg-white text-ink-2 ring-1 ring-inset ring-line-strong",
      )}
    >
      {children}
    </motion.span>
  );
}

function KycScene({ phase }: { phase: number }) {
  const tc = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const open = phase >= 1;
  const rows: [string, string, string][] = [
    [tc("kyc.name"), "•••••• •••••", displayName(CITIZEN, locale)],
    [tc("kyc.dob"), "••/••/••••", "14/08/1991"],
    [tc("kyc.aadhaar"), "XXXX XXXX 6721", "XXXX XXXX 6721"],
  ];
  return (
    <div className="pt-4">
      <p className="flex items-center gap-2 text-[14px] font-semibold text-ink">
        {open ? <LockKeyOpen size={17} weight="bold" className="text-green-600" /> : <LockKey size={17} weight="bold" className="text-navy-600" />}
        {open ? tc("modules.kyc") : tc("kyc.lockedTitle")}
      </p>
      <dl className="mt-3 divide-y divide-line rounded-[14px] ring-1 ring-inset ring-line">
        {rows.map(([label, masked, shown]) => (
          <div key={label} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-[13.5px]">
            <dt className="text-ink-3">{label}</dt>
            <dd className={cn("font-semibold tabular-nums transition-colors duration-500", open ? "text-ink" : "tracking-[0.12em] text-ink-4")}>{open ? shown : masked}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-3">{tc("kyc.purpose")}</p>
      <p className="mt-1.5 flex items-center justify-between gap-3 rounded-[12px] bg-navy-50 px-3.5 py-2.5 text-[13.5px] font-semibold text-navy-800">
        <span className="truncate">{loc(ACCESS_PURPOSES[0].label, locale)}</span>
        <CheckCircle size={16} weight="fill" className="shrink-0 text-navy-600" />
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <PressButton pressed={open}>
          {open && <CheckCircle size={15} weight="fill" />}
          {tc("kyc.unlock")}
        </PressButton>
        <Toast show={open}>{tc("kyc.loggedLive")}</Toast>
      </div>
    </div>
  );
}

function DecisionScene({ phase }: { phase: number }) {
  const tc = useTranslations("console");
  const checks = [tc("case.fromLocker"), tc("case.issuerVerified"), tc("case.feePaid")];
  return (
    <div className="pt-4">
      <p className="text-[14px] font-semibold text-ink">{tc("case.checks")}</p>
      <ul className="mt-3 space-y-2">
        {checks.map((c, i) => (
          <motion.li
            key={c}
            initial={{ opacity: 0, transform: "translateX(-6px)" }}
            animate={{ opacity: 1, transform: "translateX(0px)" }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.12, ease: ease.out }}
            className="flex items-center gap-2.5 text-[13.5px] text-ink-2"
          >
            <CheckCircle size={17} weight="fill" className="text-green-600" />
            {c}
          </motion.li>
        ))}
      </ul>
      <p className="mt-4 rounded-[12px] bg-green-50 px-3.5 py-2.5 text-[13px] font-medium text-green-800">{tc("case.allChecksPassed")}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <PressButton pressed={phase >= 1}>
          {phase >= 1 && <CheckCircle size={15} weight="fill" />}
          {tc("case.approve")}
        </PressButton>
        <PressButton pressed={false} tone="quiet">
          {tc("case.requestInfo")}
        </PressButton>
        <PressButton pressed={false} tone="quiet">
          {tc("case.reject")}
        </PressButton>
      </div>
      <div className="mt-4 min-h-9">
        <Toast show={phase >= 1}>
          {tc("case.approvedToast")} · {tc("case.citizenNotified")}
        </Toast>
      </div>
    </div>
  );
}

function RecordScene({ phase }: { phase: number }) {
  const tc = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const signed = phase >= 1;
  return (
    <div className="pt-4">
      <div className="relative overflow-hidden rounded-[16px] bg-[#FBFBFC] p-4 ring-1 ring-inset ring-line">
        <Guilloche opacity={0.22} className="pointer-events-none absolute -right-12 -top-12 h-36 w-36" />
        <p className="relative text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3">{tc("record.sample")}</p>
        <p className="relative mt-1 text-[18px] font-semibold tracking-[-0.01em] text-ink">{loc(serviceName("cert_birth"), locale)}</p>
        <dl className="relative mt-3 grid grid-cols-2 gap-3 text-[12.5px]">
          <div>
            <dt className="text-ink-3">{tc("record.holder")}</dt>
            <dd className="mt-0.5 font-semibold text-ink">{displayName(CITIZEN, locale)}</dd>
          </div>
          <div>
            <dt className="text-ink-3">{tc("record.number")}</dt>
            <dd className="mt-0.5 font-mono font-semibold text-ink">{RECORD_NO}</dd>
          </div>
        </dl>
        <div className="relative mt-4 flex items-center gap-2 border-t border-dashed border-line pt-3 text-[12.5px]">
          <AnimatePresence mode="wait" initial={false}>
            {signed ? (
              <motion.span key="signed" initial={{ opacity: 0, transform: "scale(0.9)" }} animate={{ opacity: 1, transform: "scale(1)" }} transition={{ type: "spring", duration: 0.45, bounce: 0.3 }} className="flex items-center gap-1.5 font-semibold text-green-800">
                <SealCheck size={17} weight="fill" className="text-green-600" />
                {tc("record.signed", { officer: DEPT.officer.name })}
              </motion.span>
            ) : (
              <motion.span key="unsigned" exit={{ opacity: 0 }} className="text-ink-3">
                {tc("record.unsigned")}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <PressButton pressed={signed}>
          {signed && <SealCheck size={15} weight="fill" />}
          {tc("case.signIssue")}
        </PressButton>
        <Toast show={signed}>{tc("case.issuedToast")}</Toast>
      </div>
    </div>
  );
}

function AuditScene({ phase }: { phase: number }) {
  const tc = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const rows = [
    { kind: tc("audit.kind.viewedKyc"), note: loc(ACCESS_PURPOSES[0].label, locale) },
    { kind: tc("audit.kind.approved"), note: loc(serviceName("cert_birth"), locale) },
    { kind: tc("audit.kind.issued"), note: RECORD_NO },
  ];
  return (
    <div>
      <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
        <ClockCounterClockwise size={18} weight="bold" className="text-navy-600" />
        {tc("modules.audit")}
      </p>
      <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-ink-3">{tc("audit.subtitle")}</p>
      <div className="mt-4 overflow-hidden rounded-[14px] ring-1 ring-inset ring-line">
        <div className="grid grid-cols-[52px_minmax(0,1fr)_minmax(0,1.2fr)] gap-3 bg-surface px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">
          <span>{tc("audit.colWhen")}</span>
          <span>{tc("audit.colAction")}</span>
          <span className="truncate">{tc("audit.colPurpose")}</span>
        </div>
        {rows.map((r, i) => (
          <motion.div
            key={r.kind}
            initial={{ opacity: 0, transform: "translateY(6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.25, ease: ease.out }}
            className="grid grid-cols-[52px_minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-3 border-t border-line px-3.5 py-2.5 text-[12.5px]"
          >
            <span className="font-mono tabular-nums text-ink-3">{TIMES[i]}</span>
            <span className="truncate font-semibold text-ink">{r.kind}</span>
            <span className="truncate text-ink-2">{r.note}</span>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 flex items-start gap-2 rounded-[12px] bg-navy-50 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-navy-800"
      >
        <LockKey size={15} weight="fill" className="mt-0.5 shrink-0" />
        <span className="line-clamp-3">{tc("audit.principle")}</span>
      </motion.p>
    </div>
  );
}

/* -------------------------------------------------------------- relay --- */

/** The line between the desk and the phone — a pulse crosses it the moment the officer acts. */
function Relay({ step, phase }: { step: number; phase: number }) {
  const tc = useTranslations("console");
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative flex h-14 items-center justify-center lg:h-full">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-white/0 via-white/35 to-white/0 lg:left-0 lg:top-1/2 lg:h-px lg:w-full lg:-translate-y-1/2 lg:translate-x-0 lg:bg-gradient-to-r" />
      {!reduce && phase >= 1 && (
        <motion.span
          key={`pulse-${step}`}
          className="absolute left-1/2 top-0 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#8BE3AE] shadow-[0_0_0_4px_rgba(139,227,174,0.25)] lg:left-0 lg:top-1/2 lg:block lg:-translate-y-1/2 lg:translate-x-0"
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: (ARRIVE_MS - ACT_MS) / 1000, ease: "easeInOut" }}
        />
      )}
      <span className={cn("relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-300", phase >= 1 ? "bg-[#8BE3AE] text-navy-900" : "bg-white/10 text-white/70")}>
        <span className={cn("h-1.5 w-1.5 rounded-full", phase >= 1 ? "bg-navy-900" : "bg-white/60")} />
        {tc("liveBadge")}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- phone --- */

function Phone({ step, phase }: { step: number; phase: number }) {
  const tApp = useTranslations();
  const arrived = phase >= 2;
  const screenTitle = step === 0 || step === 3 ? tApp("privacy.title") : tApp("track.heading");

  return (
    <div className="mx-auto w-full max-w-[276px] lg:self-center">
      {/* iPhone proportions: a 393 × 852 screen inside an 8px bezel. */}
      <div className="relative rounded-[48px] bg-[#0B0D14] p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/15">
        <span aria-hidden className="absolute -left-[3px] top-[110px] h-8 w-[3px] rounded-l-full bg-[#1C1F2A]" />
        <span aria-hidden className="absolute -left-[3px] top-[160px] h-14 w-[3px] rounded-l-full bg-[#1C1F2A]" />
        <span aria-hidden className="absolute -right-[3px] top-[140px] h-20 w-[3px] rounded-r-full bg-[#1C1F2A]" />
        <div className="relative aspect-[393/852] overflow-hidden rounded-[40px] bg-page">
          <div className="flex items-center justify-between px-6 pt-3.5 text-[11px] font-semibold text-ink">
            <span className="tabular-nums">9:41</span>
            <span className="absolute left-1/2 top-2.5 h-[24px] w-[80px] -translate-x-1/2 rounded-full bg-[#0B0D14]" />
            <span className="flex gap-1" aria-hidden>
              <span className="h-2 w-3 rounded-[2px] bg-ink" />
              <span className="h-2 w-4 rounded-[2px] border border-ink" />
            </span>
          </div>
          <div className="flex items-center justify-between px-5 pb-2 pt-5">
            <span className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
              <SaathiMark size={18} />
              {tApp("brand.name")}
            </span>
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-line">
              <Bell size={15} weight="bold" className="text-ink-2" />
              <AnimatePresence>
                {arrived && (
                  <motion.span key={`dot-${step}`} initial={{ transform: "scale(0)" }} animate={{ transform: "scale(1)" }} exit={{ transform: "scale(0)" }} transition={{ type: "spring", duration: 0.4, bounce: 0.5 }} className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-saffron-500 ring-2 ring-white" />
                )}
              </AnimatePresence>
            </span>
          </div>
          <p className="px-5 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink">{screenTitle}</p>

          <div className="px-4 pt-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step} initial={{ opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} exit={{ opacity: 0, transform: "translateY(-6px)" }} transition={{ duration: 0.35, ease: ease.out }}>
                {step === 0 && <PhoneAccess arrived={arrived} />}
                {step === 1 && <PhoneDecision arrived={arrived} />}
                {step === 2 && <PhoneRecord arrived={arrived} />}
                {step === 3 && <PhoneLog />}
              </motion.div>
            </AnimatePresence>
          </div>
          <PhoneTabs active={step === 1 || step === 2 ? "track" : "me"} />
          <span aria-hidden className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-ink/80" />
        </div>
      </div>
    </div>
  );
}

const PHONE_TABS: { key: "home" | "explore" | "track" | "me"; icon: Icon }[] = [
  { key: "home", icon: House },
  { key: "explore", icon: Compass },
  { key: "track", icon: ListChecks },
  { key: "me", icon: UserCircle },
];

function PhoneTabs({ active }: { active: "track" | "me" }) {
  const t = useTranslations("tabs");
  const tab = (key: (typeof PHONE_TABS)[number]["key"], Glyph: Icon) => {
    const on = key === active;
    return (
      <span key={key} className="relative flex flex-1 flex-col items-center justify-center gap-[3px]">
        {on && <motion.span layoutId="dept-phone-tab" transition={{ type: "spring", duration: 0.45, bounce: 0.12 }} className="absolute inset-x-0.5 inset-y-1.5 rounded-[14px] bg-navy-50" />}
        <Glyph size={18} weight={on ? "fill" : "regular"} className={cn("relative", on ? "text-navy-600" : "text-ink-3")} />
        <span className={cn("relative max-w-full truncate text-[9px] leading-none", on ? "font-semibold text-navy-700" : "font-medium text-ink-3")}>{t(key)}</span>
      </span>
    );
  };
  return (
    <div aria-hidden className="absolute inset-x-2.5 bottom-6 flex h-[54px] items-stretch rounded-[26px] bg-white/90 px-1 shadow-[0_10px_30px_-12px_rgba(10,28,84,0.3)] ring-1 ring-line backdrop-blur">
      {PHONE_TABS.slice(0, 2).map((x) => tab(x.key, x.icon))}
      <span className="flex w-12 shrink-0 items-center justify-center">
        <SaathiOrb size={38} />
      </span>
      {PHONE_TABS.slice(2).map((x) => tab(x.key, x.icon))}
    </div>
  );
}

function Arrive({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, transform: "translateY(-12px) scale(0.96)" }} animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }} transition={{ type: "spring", duration: 0.5, bounce: 0.22 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhoneAccess({ arrived }: { arrived: boolean }) {
  const tApp = useTranslations();
  const { locale } = useLocaleSwitch();
  return (
    <div>
      <p className="text-[12.5px] font-semibold text-ink">{tApp("privacy.logTitle")}</p>
      <p className="text-[11.5px] text-ink-3">{tApp("privacy.logSub")}</p>
      <div className="mt-3 space-y-2">
        <Arrive show={arrived}>
          <div className="rounded-[18px] bg-white p-3 shadow-[0_8px_24px_-12px_rgba(10,28,84,0.35)] ring-2 ring-navy-600">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-600 text-[10.5px] font-semibold text-white">PN</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-semibold text-ink">{DEPT.officer.name}</span>
                <span className="block truncate text-[11px] text-ink-3">{loc(DEPT.office, locale)}</span>
              </span>
              <span className="font-mono text-[10.5px] tabular-nums text-ink-3">{TIMES[0]}</span>
            </div>
            <p className="mt-2 rounded-[10px] bg-surface px-2.5 py-1.5 text-[11.5px] text-ink-2">
              <span className="font-semibold text-ink">{tApp("privacy.purpose")}:</span> {loc(ACCESS_PURPOSES[0].label, locale)}
            </p>
          </div>
        </Arrive>
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-[18px] bg-white p-3 ring-1 ring-line">
            <span className="h-8 w-8 shrink-0 rounded-full bg-surface2" />
            <span className="flex-1 space-y-1.5">
              <span className="block h-2 w-2/3 rounded-full bg-surface2" />
              <span className="block h-2 w-1/3 rounded-full bg-surface2" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneDecision({ arrived }: { arrived: boolean }) {
  const tApp = useTranslations();
  const { locale } = useLocaleSwitch();
  return (
    <div className="space-y-3">
      <div className={cn("rounded-[20px] bg-white p-4 ring-1 transition-shadow duration-500", arrived ? "shadow-[0_10px_30px_-14px_rgba(18,128,60,0.55)] ring-green-500" : "ring-line")}>
        <div className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-semibold text-ink">{loc(serviceName("cert_birth"), locale)}</span>
            <span className="block truncate font-mono text-[10.5px] text-ink-3">{REF}</span>
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={arrived ? "approved" : "progress"}
              initial={{ opacity: 0, transform: "scale(0.85)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0, transform: "scale(0.85)" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
              className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold", arrived ? "bg-green-50 text-green-800" : "bg-navy-50 text-navy-700")}
            >
              {arrived ? tApp("status.approved") : tApp("status.inProgress")}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="mt-3 flex gap-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface2">
              <motion.span className={cn("block h-full", arrived ? "bg-green-500" : "bg-navy-600")} initial={false} animate={{ width: i < (arrived ? 3 : 2) ? "100%" : "0%" }} transition={{ duration: 0.5, delay: i * 0.08, ease: ease.out }} />
            </span>
          ))}
        </div>
      </div>
      <Arrive show={arrived}>
        <div className="rounded-[20px] bg-green-50 p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-green-800">
            <CheckCircle size={16} weight="fill" className="text-green-600" />
            {tApp("track.officer.title.approved")}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-green-800/90">{tApp("track.officer.body.approved")}</p>
        </div>
      </Arrive>
    </div>
  );
}

function PhoneRecord({ arrived }: { arrived: boolean }) {
  const tApp = useTranslations();
  const { locale } = useLocaleSwitch();
  return (
    <div className="space-y-3">
      <Arrive show={arrived}>
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-navy-800 to-navy-600 p-4 text-white">
          <Guilloche tone="white" opacity={0.16} className="pointer-events-none absolute -right-16 -top-16 h-44 w-44" />
          <p className="relative flex items-center gap-1.5 text-[11.5px] font-semibold text-white/80">
            <Wallet size={14} weight="fill" />
            {tApp("track.officer.title.issued")}
          </p>
          <p className="relative mt-3 text-[17px] font-semibold tracking-[-0.01em]">{loc(serviceName("cert_birth"), locale)}</p>
          <p className="relative font-mono text-[10.5px] text-white/70">{RECORD_NO}</p>
          <p className="relative mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#8BE3AE]">
            <SealCheck size={13} weight="fill" />
            {DEPT.officer.name}
          </p>
        </div>
      </Arrive>
      {!arrived && (
        <div className="rounded-[20px] bg-white p-4 ring-1 ring-line">
          <span className="block text-[14px] font-semibold text-ink">{loc(serviceName("cert_birth"), locale)}</span>
          <span className="mt-1 inline-block rounded-full bg-green-50 px-2 py-0.5 text-[10.5px] font-semibold text-green-800">{tApp("status.approved")}</span>
        </div>
      )}
      <Arrive show={arrived}>
        <p className="text-[12px] leading-relaxed text-ink-2">{tApp("track.officer.body.issued")}</p>
        <span className="mt-3 inline-flex h-9 items-center rounded-full bg-ink px-4 text-[12.5px] font-semibold text-white">{tApp("track.officer.openRecord")}</span>
      </Arrive>
    </div>
  );
}

function PhoneLog() {
  const tApp = useTranslations();
  const tc = useTranslations("console");
  const kinds = [tc("audit.kind.viewedKyc"), tc("audit.kind.approved"), tc("audit.kind.issued")];
  return (
    <div>
      <p className="text-[12.5px] font-semibold text-ink">{tApp("privacy.logTitle")}</p>
      <p className="text-[11.5px] text-ink-3">{tApp("privacy.logSub")}</p>
      <ol className="relative mt-4 space-y-3 pl-5">
        <span aria-hidden className="absolute bottom-2 left-[5px] top-2 w-px bg-line-strong" />
        {kinds.map((k, i) => (
          <motion.li
            key={k}
            initial={{ opacity: 0, transform: "translateX(8px)" }}
            animate={{ opacity: 1, transform: "translateX(0px)" }}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.25, ease: ease.out }}
            className="relative rounded-[16px] bg-white p-3 ring-1 ring-line"
          >
            <span aria-hidden className="absolute -left-[19px] top-4 h-2.5 w-2.5 rounded-full bg-navy-600 ring-2 ring-page" />
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-[12.5px] font-semibold text-ink">{k}</span>
              <span className="font-mono text-[10.5px] tabular-nums text-ink-3">{TIMES[i]}</span>
            </span>
            <span className="block truncate text-[11px] text-ink-3">{DEPT.officer.name}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
