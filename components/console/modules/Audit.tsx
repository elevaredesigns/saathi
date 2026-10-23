"use client";

import { ClipboardText, DownloadSimple, Eye, ShieldCheck } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { useConsole } from "@/lib/console/store";
import { loc } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { Btn, Card, Empty, Pill, useToast } from "../ui";

/** Tamper-evident trail of every action and every look at personal data. */
export function AuditModule({ dept }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const toast = useToast();
  const { audit } = useConsole();
  const rows = audit.filter((a) => a.deptId === dept.id);
  const fmt = (iso: string) => new Intl.DateTimeFormat(locale === "en" ? "en-IN" : `${locale}-IN`, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", second: "2-digit", numberingSystem: "latn" }).format(new Date(iso));

  return (
    <>
      <ModuleHeader
        title={t("modules.audit")}
        subtitle={t("audit.subtitle")}
        actions={
          <Btn icon={DownloadSimple} disabled={!rows.length} onClick={() => toast(t("audit.exported", { count: rows.length }), "navy")}>
            {t("audit.export")}
          </Btn>
        }
      />
      <div className="mb-4 flex items-start gap-3 rounded-[16px] bg-navy-50/60 p-4 ring-1 ring-inset ring-navy-100">
        <ShieldCheck size={20} weight="duotone" className="mt-0.5 shrink-0 text-navy-600" />
        <p className="text-[13.5px] leading-relaxed text-ink-2">{t("audit.principle")}</p>
      </div>
      <Card padded={false}>
        {rows.length === 0 ? (
          <Empty icon={ClipboardText} title={t("audit.emptyTitle")} body={t("audit.emptyBody")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead>
                <tr className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">
                  <th className="px-5 py-2.5">{t("audit.colWhen")}</th>
                  <th className="px-3 py-2.5">{t("audit.colAction")}</th>
                  <th className="px-3 py-2.5">{t("audit.colSubject")}</th>
                  <th className="px-3 py-2.5">{t("audit.colOfficer")}</th>
                  <th className="px-5 py-2.5">{t("audit.colPurpose")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((a) => {
                  const access = a.kind === "viewedKyc" || a.kind === "viewedDocument";
                  return (
                    <tr key={a.id} className={cn(access && "bg-navy-50/30")}>
                      <td className="whitespace-nowrap px-5 py-2.5 font-mono text-[12px] text-ink-2">{fmt(a.at)}</td>
                      <td className="px-3 py-2.5">
                        <span className="flex items-center gap-1.5 text-ink">
                          {access && <Eye size={14} className="text-navy-600" />}
                          {t(`audit.kind.${a.kind}`)}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px] text-ink-2">{a.subject}</td>
                      <td className="px-3 py-2.5 text-ink-2">{a.officer}</td>
                      <td className="px-5 py-2.5 text-ink-2">{a.purpose ? <Pill tone="navy">{loc(a.purpose, locale)}</Pill> : a.note ? <span className="text-ink-3">{a.note}</span> : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
