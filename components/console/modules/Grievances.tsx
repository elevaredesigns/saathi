"use client";

import { ArrowUpRight, ChatCircleText, CheckCircle, Megaphone } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { grievances, type Grievance } from "@/lib/console/operations";
import { useConsole } from "@/lib/console/store";
import { loc } from "@/lib/mockData";
import { PROTOTYPE_TODAY } from "@/lib/utils/dateUtils";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { Btn, Card, Dialog, Empty, Pill, useToast } from "../ui";

const LIMIT = 30;

export function GrievancesModule({ dept }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const toast = useToast();
  const { grievances: state, patch } = useConsole();
  const list = useMemo(() => grievances(dept.id), [dept.id]);
  const [replyTo, setReplyTo] = useState<Grievance | null>(null);
  const [reply, setReply] = useState("");

  const age = (g: Grievance) => Math.floor((PROTOTYPE_TODAY.getTime() - new Date(g.openedAt).getTime()) / 86_400_000);
  const open = list.filter((g) => !state[g.id]);

  const close = (g: Grievance, outcome: "resolved" | "escalated", note?: string) => {
    patch((s) => ({ grievances: { ...s.grievances, [g.id]: outcome } }), { deptId: dept.id, kind: outcome === "resolved" ? "grievanceResolved" : "grievanceEscalated", subject: g.id, officer: dept.officer.name, note });
    toast(t(outcome === "resolved" ? "griev.resolvedToast" : "griev.escalatedToast", { id: g.id }), outcome === "resolved" ? "green" : "navy");
  };

  return (
    <>
      <ModuleHeader title={t("modules.grievances")} subtitle={t("griev.subtitle", { days: LIMIT })} />
      <Card padded={false} title={t("griev.open", { count: open.length })}>
        {list.length === 0 ? (
          <Empty icon={Megaphone} title={t("griev.empty")} />
        ) : (
          <ul className="divide-y divide-line">
            {list.map((g) => {
              const days = age(g);
              const outcome = state[g.id];
              return (
                <li key={g.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-ink">{loc(g.subject, locale)}</p>
                    <p className="text-[12.5px] text-ink-3">
                      {g.citizen} · <span className="font-mono">{g.id}</span> · {g.channel}
                    </p>
                  </div>
                  {outcome ? (
                    <Pill tone={outcome === "resolved" ? "green" : "violet"} icon={outcome === "resolved" ? CheckCircle : ArrowUpRight}>
                      {t(`griev.${outcome}`)}
                    </Pill>
                  ) : (
                    <>
                      <Pill tone={days > LIMIT ? "red" : days > LIMIT - 7 ? "saffron" : "neutral"}>{days > LIMIT ? t("sla.overdue", { days: days - LIMIT }) : t("sla.left", { days: LIMIT - days })}</Pill>
                      <Btn size="sm" icon={ChatCircleText} variant="primary" onClick={() => { setReplyTo(g); setReply(t("griev.template", { name: g.citizen.split(" ")[0] })); }}>
                        {t("griev.reply")}
                      </Btn>
                      <Btn size="sm" variant="ghost" icon={ArrowUpRight} onClick={() => close(g, "escalated")}>
                        {t("griev.escalate")}
                      </Btn>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Dialog
        open={!!replyTo}
        onClose={() => setReplyTo(null)}
        title={t("griev.replyTitle")}
        description={replyTo ? loc(replyTo.subject, locale) : ""}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setReplyTo(null)}>
              {t("cancel")}
            </Btn>
            <Btn
              variant="success"
              icon={CheckCircle}
              disabled={reply.trim().length < 20}
              onClick={() => {
                if (replyTo) close(replyTo, "resolved", reply.trim());
                setReplyTo(null);
              }}
            >
              {t("griev.sendResolve")}
            </Btn>
          </>
        }
      >
        <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={6} className="w-full resize-none rounded-[12px] p-3 text-[13.5px] leading-relaxed text-ink ring-1 ring-inset ring-line-strong outline-none focus:ring-2 focus:ring-navy-600" />
        <p className="mt-2 text-[12px] text-ink-3">{t("griev.replyNote")}</p>
      </Dialog>
    </>
  );
}
