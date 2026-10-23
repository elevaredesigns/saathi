"use client";

import { ArrowRight, CheckCircle, Clock, Lightning, Tray, WarningCircle, type Icon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { CountUp } from "@/components/system/motion/CountUp";
import { isOpen, slaLeft, type CaseStage } from "@/lib/console/cases";
import { dbtBatches, EXAM_CYCLES, intakeSeries, jurisdictionChallans } from "@/lib/console/operations";
import { useConsole } from "@/lib/console/store";
import { ease } from "@/lib/design/motion";
import { loc } from "@/lib/mockData";
import { PROTOTYPE_TODAY } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { MODULE_ICON } from "../icons";
import { BarChart, Btn, Card, Initials, Meter, Pill, SlaPill, STAGE_STYLE } from "../ui";

const PIPELINE: CaseStage[] = ["new", "docCheck", "verification", "decision", "infoRequested", "approved", "issued", "rejected"];

function Kpi({ icon: Glyph, label, value, hint, tone, delay }: { icon: Icon; label: string; value: number; hint: string; tone: "navy" | "red" | "green" | "saffron"; delay: number }) {
  const reduce = useReducedMotion();
  const tint = { navy: "bg-navy-50 text-navy-600", red: "bg-red-50 text-red-600", green: "bg-green-50 text-green-600", saffron: "bg-saffron-50 text-saffron-700" }[tone];
  return (
    <motion.div initial={reduce ? false : { opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} transition={{ duration: 0.45, ease: ease.out, delay }} className="rounded-[16px] border border-line bg-white p-4 shadow-[0_1px_2px_rgba(11,13,20,0.04)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-ink-2">{label}</p>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-[10px]", tint)}>
          <Glyph size={17} weight="duotone" />
        </span>
      </div>
      <p className="mt-3 text-[32px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-ink">
        <CountUp value={value} duration={1.1} />
      </p>
      <p className="mt-2 text-[12.5px] text-ink-3">{hint}</p>
    </motion.div>
  );
}

export function OverviewModule({ dept, cases, go }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const { audit, court, dbt } = useConsole();

  const stats = useMemo(() => {
    const open = cases.filter((c) => isOpen(c.stage));
    const urgent = open.filter((c) => slaLeft(c) <= 2);
    const overdue = open.filter((c) => slaLeft(c) < 0);
    const decided = cases.filter((c) => ["approved", "issued", "rejected"].includes(c.stage));
    const byStage = PIPELINE.map((s) => [s, cases.filter((c) => c.stage === s).length] as const);
    const queue = [...open].sort((a, b) => slaLeft(a) - slaLeft(b)).slice(0, 6);
    return { open, urgent, overdue, decided, byStage, queue };
  }, [cases]);

  const series = intakeSeries(dept.id);
  const labels = series.map((_, i) => {
    const d = new Date(PROTOTYPE_TODAY);
    d.setDate(d.getDate() - (series.length - 1 - i));
    return String(d.getDate());
  });
  const total = cases.length || 1;
  const recent = audit.filter((a) => a.deptId === dept.id).slice(0, 6);
  const hour = PROTOTYPE_TODAY.getHours();

  const extras: { module: "challans" | "exams" | "dbt"; value: string }[] = [];
  if (dept.modules.includes("challans")) extras.push({ module: "challans", value: t("overview.challansPending", { count: jurisdictionChallans().filter((c) => c.initial === "court" && !court[c.no]).length }) });
  if (dept.modules.includes("exams")) extras.push({ module: "exams", value: t("overview.examsLive", { count: EXAM_CYCLES.length }) });
  if (dept.modules.includes("dbt")) extras.push({ module: "dbt", value: t("overview.dbtAwaiting", { count: dbtBatches(dept.id).filter((b) => b.initial === "awaiting" && !dbt[b.id]).length }) });

  return (
    <>
      <ModuleHeader
        title={t(hour < 12 ? "overview.morning" : "overview.afternoon", { name: dept.officer.name.replace(/^Dr\. /, "Dr. ").split(" ").slice(0, 2).join(" ") })}
        subtitle={t("overview.subtitle", { office: loc(dept.office, locale), open: stats.open.length })}
        actions={
          dept.modules.includes("applications") && (
            <Btn variant="primary" icon={Lightning} onClick={() => go({ m: "applications", c: stats.queue[0]?.id ?? null })}>
              {t("overview.startQueue")}
            </Btn>
          )
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Tray} tone="navy" label={t("overview.kpiOpen")} value={stats.open.length} hint={t("overview.kpiOpenHint")} delay={0} />
        <Kpi icon={Clock} tone="saffron" label={t("overview.kpiDue")} value={stats.urgent.length} hint={t("overview.kpiDueHint")} delay={0.05} />
        <Kpi icon={WarningCircle} tone="red" label={t("overview.kpiOverdue")} value={stats.overdue.length} hint={t("overview.kpiOverdueHint")} delay={0.1} />
        <Kpi icon={CheckCircle} tone="green" label={t("overview.kpiDecided")} value={stats.decided.length} hint={t("overview.kpiDecidedHint")} delay={0.15} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card title={t("overview.intake")} action={<span className="text-[12.5px] text-ink-3">{t("overview.intakeHint", { total: series.reduce((a, b) => a + b, 0) })}</span>}>
          <BarChart data={series} labels={labels} />
        </Card>
        <Card title={t("overview.pipeline")}>
          <ul className="space-y-2.5">
            {stats.byStage.map(([stage, n]) => (
              <li key={stage} className="grid grid-cols-[120px_1fr_32px] items-center gap-3">
                <span className="truncate text-[12.5px] text-ink-2">{t(`stage.${stage}`)}</span>
                <Meter value={n / total} tone={STAGE_STYLE[stage].tone === "red" ? "red" : STAGE_STYLE[stage].tone === "green" ? "green" : STAGE_STYLE[stage].tone === "saffron" ? "saffron" : "navy"} />
                <span className="text-right text-[12.5px] font-semibold tabular-nums text-ink">{n}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card title={t("overview.needsDecision")} padded={false} action={dept.modules.includes("applications") && <Btn size="sm" variant="ghost" onClick={() => go({ m: "applications", c: null })}>{t("overview.viewAll")}</Btn>}>
          {stats.queue.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13.5px] text-ink-3">{t("overview.queueEmpty")}</p>
          ) : (
            <ul className="divide-y divide-line">
              {stats.queue.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => go({ m: "applications", c: c.id })} className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-surface/70">
                    <Initials name={c.applicant.name} size={34} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[13.5px] font-semibold text-ink">{c.applicant.name}</span>
                        {c.live && <Pill tone="green">{t("liveBadge")}</Pill>}
                      </span>
                      <span className="block truncate text-[12.5px] text-ink-3">
                        {loc(c.service, locale)} · <span className="font-mono">{c.ref}</span>
                      </span>
                    </span>
                    <SlaPill days={slaLeft(c)} open />
                    <ArrowRight size={15} className="text-ink-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-4">
          {extras.length > 0 && (
            <Card title={t("overview.alsoToday")} padded={false}>
              <ul className="divide-y divide-line">
                {extras.map((x) => {
                  const Glyph = MODULE_ICON[x.module];
                  return (
                    <li key={x.module}>
                      <button type="button" onClick={() => go({ m: x.module, c: null })} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-surface/70">
                        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-surface text-ink-2">
                          <Glyph size={16} weight="duotone" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13.5px] font-semibold text-ink">{t(`modules.${x.module}`)}</span>
                          <span className="block text-[12.5px] text-ink-3">{x.value}</span>
                        </span>
                        <ArrowRight size={15} className="text-ink-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
          <Card title={t("overview.activity")} padded={false}>
            {recent.length === 0 ? (
              <p className="px-5 py-6 text-[13px] leading-relaxed text-ink-3">{t("overview.activityEmpty")}</p>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((a) => (
                  <li key={a.id} className="px-5 py-2.5">
                    <p className="text-[13px] text-ink">{t(`audit.kind.${a.kind}`)} · <span className="font-mono text-[12px]">{a.subject}</span></p>
                    <p className="text-[12px] text-ink-3">{new Date(a.at).toLocaleTimeString(locale === "en" ? "en-IN" : `${locale}-IN`, { hour: "numeric", minute: "2-digit", numberingSystem: "latn" })}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
