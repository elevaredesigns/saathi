"use client";

import { ArrowRight, ArrowSquareOut, ArrowCounterClockwise, CaretUpDown, Check, List, MagnifyingGlass, ShieldCheck, Translate, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { IconTile } from "@/components/system/ui/IconTile";
import { isOpen, liveCases, sampleCases } from "@/lib/console/cases";
import { grievances as grievanceList } from "@/lib/console/operations";
import { DEPARTMENTS, getDepartment, type Department, type DeptId, type ModuleId } from "@/lib/console/departments";
import { FLAGS } from "@/lib/console/reasons";
import { useConsole } from "@/lib/console/store";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { ease } from "@/lib/design/motion";
import { availableLocales, localeMeta, orderedLocales, soonLocales, type Locale } from "@/lib/i18n/config";
import { loc } from "@/lib/mockData";
import { formatLongDay, PROTOTYPE_TODAY } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { DEPT_ICON, MODULE_ICON } from "./icons";
import { ApplicationsModule } from "./modules/Applications";
import { AuditModule } from "./modules/Audit";
import { ChallansModule } from "./modules/Challans";
import { DbtModule } from "./modules/Dbt";
import { ExamsModule } from "./modules/Exams";
import { GrievancesModule } from "./modules/Grievances";
import { KycModule } from "./modules/Kyc";
import { OverviewModule } from "./modules/Overview";
import { PaymentsModule } from "./modules/Payments";
import { RecordsModule } from "./modules/Records";
import { ToastProvider, useToast } from "./ui";
import { useDeptCases } from "./useCases";

export interface Route {
  d: DeptId | null;
  m: ModuleId;
  q: string;
  c: string | null;
}

function readRoute(): Route {
  const p = new URLSearchParams(window.location.search);
  const d = getDepartment(p.get("d"))?.id ?? null;
  const m = (p.get("m") as ModuleId) || "overview";
  return { d, m, q: p.get("q") ?? "", c: p.get("case") };
}

function writeRoute(r: Route, push = true) {
  const p = new URLSearchParams();
  if (r.d) p.set("d", r.d);
  if (r.d && r.m !== "overview") p.set("m", r.m);
  if (r.q) p.set("q", r.q);
  if (r.c) p.set("case", r.c);
  const url = `${window.location.pathname}${p.toString() ? `?${p}` : ""}`;
  if (push) window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

export function ConsoleApp() {
  const [route, setRoute] = useState<Route | null>(null);

  useEffect(() => {
    // Embedded on the website: hide the page scrollbar inside the frame.
    if (new URLSearchParams(window.location.search).get("embed") === "1") document.documentElement.classList.add("no-scrollbar");
    setRoute(readRoute());
    const onPop = () => setRoute(readRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = useCallback((next: Partial<Route>, push = true) => {
    setRoute((prev) => {
      const r = { ...(prev ?? { d: null, m: "overview" as ModuleId, q: "", c: null }), ...next };
      writeRoute(r, push);
      return r;
    });
  }, []);

  if (!route) return <div className="min-h-screen bg-page" />;

  return (
    <ToastProvider>
      {route.d ? <Shell dept={getDepartment(route.d)!} route={route} go={go} /> : <DepartmentPicker onPick={(d) => go({ d, m: "overview", c: null, q: "" })} />}
    </ToastProvider>
  );
}

/* ---------------------------------------------------------------- picker --- */

function useOpenCount() {
  const { applications, user } = usePrototype();
  const { stages, grievances: grievanceState } = useConsole();
  return useCallback(
    (id: DeptId) =>
      id === "grievance"
        ? grievanceList(id).filter((g) => !grievanceState[g.id]).length
        : liveCases(id, applications, user).filter((c) => isOpen(c.stage)).length + sampleCases(id).filter((c) => isOpen(stages[c.id]?.stage ?? c.stage)).length,
    [applications, user, stages, grievanceState],
  );
}

function DepartmentPicker({ onPick }: { onPick: (d: DeptId) => void }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const openCount = useOpenCount();
  const [query, setQuery] = useState("");
  const list = DEPARTMENTS.filter((d) => `${loc(d.name, locale)} ${d.name.en} ${loc(d.office, locale)}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-page">
      <TopStrip />
      <main id="main" className="mx-auto max-w-[1180px] px-5 pb-20 pt-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1 text-[12.5px] font-semibold text-navy-700 ring-1 ring-inset ring-navy-100">
              <ShieldCheck size={14} weight="fill" />
              {t("picker.badge")}
            </span>
            <h1 className="mt-5 text-[clamp(32px,4vw,52px)] font-semibold leading-[1.08] tracking-[var(--track-tight)] text-ink">{t("picker.title")}</h1>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{t("picker.intro")}</p>
          </div>
          <LanguageSelect />
        </div>

        <label className="mt-10 flex h-12 max-w-md items-center gap-2.5 rounded-[14px] bg-white px-4 ring-1 ring-inset ring-line-strong focus-within:ring-2 focus-within:ring-navy-600">
          <MagnifyingGlass size={18} className="text-ink-3" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("picker.search")} aria-label={t("picker.search")} className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-3" />
        </label>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d, i) => {
            const Glyph = DEPT_ICON[d.id];
            const open = openCount(d.id);
            return (
              <motion.li key={d.id} initial={reduce ? false : { opacity: 0, transform: "translateY(12px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 0.4, ease: ease.out, delay: Math.min(i * 0.03, 0.3) }}>
                <button type="button" onClick={() => onPick(d.id)} className="group flex h-full w-full items-start gap-4 rounded-[18px] border border-line bg-white p-4 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-[0_18px_40px_-24px_rgba(31,67,184,0.45)] active:scale-[0.99]">
                  <IconTile icon={Glyph} tone={d.tone} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15.5px] font-semibold text-ink">{loc(d.name, locale)}</span>
                    <span className="mt-0.5 block truncate text-[13px] text-ink-3">{loc(d.office, locale)}</span>
                    <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-ink-2">
                      <span className="tabular-nums">{t("picker.services", { count: d.services.length })}</span>
                      <span aria-hidden className="h-1 w-1 rounded-full bg-ink-4" />
                      <span className={cn("tabular-nums", open > 0 && "font-semibold text-navy-700")}>{t("picker.open", { count: open })}</span>
                    </span>
                  </span>
                  <ArrowRight size={16} className="mt-1 text-ink-4 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-navy-600" />
                </button>
              </motion.li>
            );
          })}
        </ul>
        <p className="mt-10 max-w-3xl text-[13px] leading-relaxed text-ink-3">{t("picker.note")}</p>
      </main>
    </div>
  );
}

function TopStrip() {
  const t = useTranslations("console");
  return (
    <div className="border-b border-line bg-surface/70">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between gap-4 px-5 text-[12.5px] text-ink-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-medium text-ink-2 hover:text-ink">
          <SaathiMark size={18} />
          <span className="font-wordmark text-[17px] leading-none text-ink">साथी</span>
          <span className="hidden sm:inline">· {t("brand")}</span>
        </Link>
        <span className="truncate">{t("disclaimer")}</span>
      </div>
    </div>
  );
}

export function LanguageSelect({ compact }: { compact?: boolean }) {
  const t = useTranslations("console");
  const tSoon = useTranslations("languageSoon");
  const { locale, setLocale } = useLocaleSwitch();
  return (
    <label className={cn("flex items-center gap-2 rounded-[10px] bg-white ring-1 ring-inset ring-line-strong", compact ? "h-8 px-2" : "h-10 px-3")}>
      <Translate size={compact ? 14 : 16} className="text-ink-3" />
      <span className="sr-only">{t("language")}</span>
      <select value={locale} onChange={(e) => setLocale(e.target.value as Locale)} className={cn("min-w-0 flex-1 cursor-pointer bg-transparent font-medium text-ink outline-none", compact ? "text-[12.5px]" : "text-[14px]")}>
        {orderedLocales.filter((l) => availableLocales.includes(l)).map((l) => (
          <option key={l} value={l}>
            {localeMeta[l].native} · {localeMeta[l].label}
          </option>
        ))}
        <optgroup label={tSoon("label")}>
          {soonLocales.map((l) => (
            <option key={l} value={l} disabled>
              {localeMeta[l].native} · {localeMeta[l].label}
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}

/* ----------------------------------------------------------------- shell --- */

function Shell({ dept, route, go }: { dept: Department; route: Route; go: (r: Partial<Route>, push?: boolean) => void }) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const cases = useDeptCases(dept);
  const { kycResolved, grievances, reset } = useConsole();
  const toast = useToast();
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState(route.q);
  const searchRef = useRef<HTMLInputElement>(null);
  const moduleId: ModuleId = dept.modules.includes(route.m) ? route.m : "overview";

  useEffect(() => setSearch(route.q), [route.q]);

  // ⌘K / Ctrl+K focuses search; "/" too.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT";
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo<Partial<Record<ModuleId, number>>>(
    () => ({
      applications: cases.filter((c) => isOpen(c.stage)).length,
      kyc: cases.filter((c) => c.flags.some((f) => FLAGS[f].kyc) && !kycResolved[c.id] && isOpen(c.stage)).length,
      grievances: grievanceList(dept.id).filter((g) => !grievances[g.id]).length,
    }),
    [cases, kycResolved, grievances, dept.id],
  );

  const Glyph = DEPT_ICON[dept.id];

  const nav = (
    <nav aria-label={t("nav")} className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 px-4">
        <SaathiMark size={22} />
        <span className="font-wordmark text-[19px] leading-none text-ink">साथी</span>
        <span className="rounded-full bg-surface2 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-2">{t("brandShort")}</span>
        <button type="button" onClick={() => setNavOpen(false)} aria-label={t("close")} className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-ink-3 hover:bg-surface lg:hidden">
          <X size={16} weight="bold" />
        </button>
      </div>

      <div className="px-3">
        <button type="button" onClick={() => go({ d: null, c: null, q: "" })} className="flex w-full items-center gap-3 rounded-[14px] border border-line bg-white p-2.5 text-left transition-colors hover:border-navy-200">
          <IconTile icon={Glyph} tone={dept.tone} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-semibold text-ink">{loc(dept.name, locale)}</span>
            <span className="block truncate text-[11.5px] text-ink-3">{loc(dept.office, locale)}</span>
          </span>
          <CaretUpDown size={15} className="text-ink-3" />
        </button>
      </div>

      <ul className="mt-4 space-y-0.5 px-3">
        {dept.modules.map((m) => {
          const MIcon = MODULE_ICON[m];
          const active = m === moduleId;
          const count = counts[m];
          return (
            <li key={m}>
              <button
                type="button"
                onClick={() => {
                  go({ m, c: null, q: "" });
                  setNavOpen(false);
                }}
                aria-current={active ? "page" : undefined}
                className={cn("relative flex h-9 w-full items-center gap-2.5 rounded-[10px] px-2.5 text-[13.5px] font-medium transition-colors", active ? "text-navy-700" : "text-ink-2 hover:bg-surface hover:text-ink")}
              >
                {/* Plain highlight, no layoutId: this nav also lives in the mobile drawer, and a shared-layout
                    element inside an exiting drawer can keep its full-screen backdrop mounted. */}
                {active && <span className="absolute inset-0 rounded-[10px] bg-navy-50" />}
                <MIcon size={17} weight={active ? "fill" : "regular"} className="relative" />
                <span className="relative flex-1 text-left">{t(`modules.${m}`)}</span>
                {!!count && <span className={cn("relative rounded-full px-1.5 text-[11px] font-semibold tabular-nums", active ? "bg-navy-600 text-white" : "bg-surface2 text-ink-2")}>{count}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto space-y-3 p-3">
        <div className="rounded-[14px] bg-surface p-3">
          <p className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
            </span>
            {t("live.title")}
          </p>
          <p className="mt-1 text-[12px] leading-snug text-ink-3">{t("live.body")}</p>
          <a href="/prototype/track/" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-navy-600 hover:underline">
            {t("live.open")} <ArrowSquareOut size={13} weight="bold" />
          </a>
        </div>
        <div className="flex items-center gap-2.5 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[12px] font-semibold text-white">{dept.officer.name.split(" ").map((p) => p[0]).slice(-2).join("")}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-ink">{dept.officer.name}</span>
            <span className="block truncate text-[11.5px] text-ink-3">{loc(dept.officer.role, locale)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelect compact />
          <button
            type="button"
            onClick={() => {
              reset();
              toast(t("resetDone"), "navy");
            }}
            title={t("reset")}
            aria-label={t("reset")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-ink-3 ring-1 ring-inset ring-line-strong hover:bg-surface hover:text-ink"
          >
            <ArrowCounterClockwise size={15} weight="bold" />
          </button>
        </div>
      </div>
    </nav>
  );

  const moduleProps = { dept, cases, route, go };

  return (
    <div className="min-h-screen bg-[#FBFBFC]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-line bg-white lg:block">{nav}</aside>
      <AnimatePresence>
        {navOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-ink/30 lg:hidden" onClick={() => setNavOpen(false)} />
            <motion.aside initial={{ transform: "translateX(-100%)" }} animate={{ transform: "translateX(0%)" }} exit={{ transform: "translateX(-100%)" }} transition={{ duration: 0.3, ease: ease.drawer }} className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-xl lg:hidden">
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button type="button" onClick={() => setNavOpen(true)} aria-label={t("menu")} className="flex h-9 w-9 items-center justify-center rounded-[10px] text-ink-2 ring-1 ring-inset ring-line-strong lg:hidden">
              <List size={18} />
            </button>
            <p className="hidden min-w-0 items-center gap-1.5 text-[13.5px] md:flex">
              <span className="truncate text-ink-3">{loc(dept.name, locale)}</span>
              <span className="text-ink-4">/</span>
              <span className="truncate font-semibold text-ink">{t(`modules.${moduleId}`)}</span>
            </p>
            <form
              className="ml-auto flex h-9 w-full max-w-[340px] items-center gap-2 rounded-[10px] bg-surface px-3 ring-1 ring-inset ring-transparent focus-within:bg-white focus-within:ring-navy-600"
              onSubmit={(e) => {
                e.preventDefault();
                go({ m: "applications", q: search.trim(), c: null });
              }}
            >
              <MagnifyingGlass size={15} className="text-ink-3" />
              <input ref={searchRef} value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} aria-label={t("search")} className="h-full min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-3" />
              <kbd className="hidden rounded-[6px] bg-white px-1.5 text-[11px] font-medium text-ink-3 ring-1 ring-line sm:inline">⌘K</kbd>
            </form>
            <span className="hidden text-[12.5px] text-ink-3 xl:inline">{formatLongDay(PROTOTYPE_TODAY, locale)}</span>
            <span className="hidden items-center gap-1 rounded-full bg-saffron-50 px-2.5 py-1 text-[11.5px] font-semibold text-saffron-700 ring-1 ring-inset ring-saffron-100 sm:inline-flex">
              <Check size={12} weight="bold" />
              {t("sample")}
            </span>
          </div>
        </header>

        <main id="main" className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={`${dept.id}-${moduleId}`} initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: ease.out }}>
              {moduleId === "overview" && <OverviewModule {...moduleProps} />}
              {moduleId === "applications" && <ApplicationsModule {...moduleProps} />}
              {moduleId === "kyc" && <KycModule {...moduleProps} />}
              {moduleId === "records" && <RecordsModule {...moduleProps} />}
              {moduleId === "payments" && <PaymentsModule {...moduleProps} />}
              {moduleId === "challans" && <ChallansModule {...moduleProps} />}
              {moduleId === "exams" && <ExamsModule {...moduleProps} />}
              {moduleId === "dbt" && <DbtModule {...moduleProps} />}
              {moduleId === "grievances" && <GrievancesModule {...moduleProps} />}
              {moduleId === "audit" && <AuditModule {...moduleProps} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export interface ModuleProps {
  dept: Department;
  cases: ReturnType<typeof useDeptCases>;
  route: Route;
  go: (r: Partial<Route>, push?: boolean) => void;
}

export function ModuleHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-ink">{title}</h1>
        {subtitle && <p className="mt-1 max-w-3xl text-[14px] leading-relaxed text-ink-2">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
