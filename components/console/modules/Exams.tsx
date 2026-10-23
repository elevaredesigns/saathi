"use client";

import { CalendarBlank, CheckCircle, Exam, Megaphone, Timer, UserFocus } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { EXAM_CYCLES, PHOTO_CHECKS, type ExamCycle } from "@/lib/console/operations";
import { useConsole } from "@/lib/console/store";
import { loc } from "@/lib/mockData";
import { formatDate } from "@/lib/utils/dateUtils";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { Btn, Card, Dialog, Initials, Meter, Pill, useToast } from "../ui";

type Action = "admit" | "results" | "deadline";

export function ExamsModule({ dept }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const toast = useToast();
  const { exams, photoChecks, patch } = useConsole();
  const [confirm, setConfirm] = useState<{ cycle: ExamCycle; action: Action } | null>(null);

  const run = () => {
    if (!confirm) return;
    const { cycle, action } = confirm;
    const key = action === "admit" ? "admitReleased" : action === "results" ? "resultsPublished" : "deadlineExtended";
    patch((s) => ({ exams: { ...s.exams, [cycle.id]: { ...s.exams[cycle.id], [key]: true } } }), { deptId: dept.id, kind: action === "admit" ? "admitReleased" : action === "results" ? "resultsPublished" : "deadlineExtended", subject: cycle.name, officer: dept.officer.name });
    toast(t(`exams.toast.${action}`, { exam: cycle.name, count: cycle.forms.toLocaleString("en-IN") }));
    setConfirm(null);
  };

  return (
    <>
      <ModuleHeader title={t("modules.exams")} subtitle={t("exams.subtitle")} />

      <div className="grid gap-4 lg:grid-cols-2">
        {EXAM_CYCLES.map((c) => {
          const st = exams[c.id] ?? {};
          const stage = st.resultsPublished ? "published" : st.admitReleased ? "admitCards" : c.stage;
          return (
            <Card key={c.id} padded={false}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">{loc(c.body, locale)}</p>
                    <h3 className="mt-1 text-[17px] font-semibold text-ink">{c.name}</h3>
                  </div>
                  <Pill tone={stage === "published" || stage === "results" ? "green" : stage === "admitCards" ? "navy" : "saffron"}>{t(`exams.stage.${stage}`)}</Pill>
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <dt className="text-[12px] text-ink-3">{t("exams.forms")}</dt>
                    <dd className="text-[20px] font-semibold tabular-nums text-ink">{c.forms.toLocaleString("en-IN")}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-ink-3">{t("exams.feePaid")}</dt>
                    <dd className="text-[20px] font-semibold tabular-nums text-ink">{Math.round((c.feePaid / c.forms) * 100)}%</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-ink-3">{t("exams.photoIssues")}</dt>
                    <dd className="text-[20px] font-semibold tabular-nums text-ink">{c.photoIssues.toLocaleString("en-IN")}</dd>
                  </div>
                </dl>
                <Meter className="mt-3" value={c.feePaid / c.forms} tone="green" />
                <p className="mt-3 flex items-center gap-1.5 text-[12.5px] text-ink-3">
                  <CalendarBlank size={14} />
                  {t("exams.examOn", { date: formatDate(c.examDate, locale) })}
                  {st.deadlineExtended && <Pill tone="violet" className="ml-1">{t("exams.extended")}</Pill>}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line bg-surface/50 px-5 py-3">
                {(c.stage === "formsOpen" || c.stage === "correction") && !st.admitReleased && (
                  <>
                    <Btn size="sm" icon={Timer} disabled={st.deadlineExtended} onClick={() => setConfirm({ cycle: c, action: "deadline" })}>
                      {t("exams.extend")}
                    </Btn>
                    <Btn size="sm" variant="primary" icon={Exam} onClick={() => setConfirm({ cycle: c, action: "admit" })}>
                      {t("exams.releaseAdmit")}
                    </Btn>
                  </>
                )}
                {(c.stage === "admitCards" || st.admitReleased) && !st.resultsPublished && c.stage !== "results" && (
                  <Btn size="sm" variant="primary" icon={Megaphone} onClick={() => setConfirm({ cycle: c, action: "results" })}>
                    {t("exams.publishResults")}
                  </Btn>
                )}
                {(c.stage === "results" || st.resultsPublished) && (
                  <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-green-800">
                    <CheckCircle size={15} weight="fill" className="text-green-600" />
                    {t("exams.inLocker")}
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4" padded={false} title={t("exams.photoQueue", { count: PHOTO_CHECKS.filter((p) => !photoChecks[p.id]).length })}>
        <ul className="divide-y divide-line">
          {PHOTO_CHECKS.map((p) => {
            const done = photoChecks[p.id];
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <span className="flex h-12 w-10 items-end justify-center overflow-hidden rounded-[6px] bg-gradient-to-b from-surface to-surface2 ring-1 ring-line">
                  <UserFocus size={22} className="mb-2 text-ink-4" />
                </span>
                <Initials name={p.candidate} size={0} className="hidden" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-ink">{p.candidate}</p>
                  <p className="text-[12.5px] text-ink-3">
                    {p.exam} · <span className="font-mono">{p.appNo}</span>
                  </p>
                </div>
                <Pill tone="saffron">{loc(p.issue, locale)}</Pill>
                {done ? (
                  <Pill tone={done === "accepted" ? "green" : "navy"}>{t(done === "accepted" ? "exams.accepted" : "exams.reuploadSent")}</Pill>
                ) : (
                  <span className="flex gap-1.5">
                    <Btn size="sm" variant="success" onClick={() => patch((s) => ({ photoChecks: { ...s.photoChecks, [p.id]: "accepted" } }), { deptId: dept.id, kind: "photoAccepted", subject: p.appNo, officer: dept.officer.name })}>
                      {t("exams.accept")}
                    </Btn>
                    <Btn
                      size="sm"
                      onClick={() => {
                        patch((s) => ({ photoChecks: { ...s.photoChecks, [p.id]: "reupload" } }), { deptId: dept.id, kind: "photoReupload", subject: p.appNo, officer: dept.officer.name });
                        toast(t("exams.reuploadToast", { name: p.candidate }), "navy");
                      }}
                    >
                      {t("exams.askReupload")}
                    </Btn>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <Dialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm ? t(`exams.confirm.${confirm.action}.title`) : ""}
        description={confirm ? t(`exams.confirm.${confirm.action}.body`, { exam: confirm.cycle.name, count: confirm.cycle.forms.toLocaleString("en-IN") }) : ""}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setConfirm(null)}>
              {t("cancel")}
            </Btn>
            <Btn variant="primary" onClick={run}>
              {confirm ? t(`exams.confirm.${confirm.action}.cta`) : ""}
            </Btn>
          </>
        }
      />
    </>
  );
}
