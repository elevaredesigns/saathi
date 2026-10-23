"use client";

import { ArrowRight, Fingerprint, ShieldCheck } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { isOpen } from "@/lib/console/cases";
import { FLAGS } from "@/lib/console/reasons";
import { useConsole } from "@/lib/console/store";
import { loc } from "@/lib/mockData";
import { CaseDrawer } from "../CaseDrawer";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { Card, Empty, Initials, Pill } from "../ui";

/** e-KYC exceptions: cases where the form and the Aadhaar record disagree. */
export function KycModule({ dept, cases, route, go }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const { kycResolved, audit } = useConsole();

  const exceptions = cases.filter((c) => c.flags.some((f) => FLAGS[f].kyc) && isOpen(c.stage));
  const pending = exceptions.filter((c) => !kycResolved[c.id]);
  const done = exceptions.filter((c) => kycResolved[c.id]);
  const views = audit.filter((a) => a.deptId === dept.id && a.kind === "viewedKyc");
  const selected = cases.find((c) => c.id === route.c) ?? null;

  const Row = ({ c }: { c: (typeof exceptions)[number] }) => (
    <li>
      <button type="button" onClick={() => go({ c: c.id })} className="flex w-full flex-wrap items-center gap-3 px-5 py-3 text-left hover:bg-surface/70">
        <Initials name={c.applicant.name} size={34} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-semibold text-ink">{c.applicant.name}</span>
          <span className="block truncate text-[12.5px] text-ink-3">
            {loc(c.service, locale)} · <span className="font-mono">{c.ref}</span>
          </span>
        </span>
        <span className="flex flex-wrap gap-1.5">
          {c.flags
            .filter((f) => FLAGS[f].kyc)
            .map((f) => (
              <Pill key={f} tone="saffron">
                {loc(FLAGS[f].label, locale)}
              </Pill>
            ))}
          {kycResolved[c.id] && <Pill tone="green">{t(kycResolved[c.id] === "accepted" ? "kyc.resolvedShort" : "kyc.askedShort")}</Pill>}
        </span>
        <ArrowRight size={15} className="text-ink-4" />
      </button>
    </li>
  );

  return (
    <>
      <ModuleHeader title={t("modules.kyc")} subtitle={t("kyc.subtitle")} />
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Card title={t("kyc.pending", { count: pending.length })} padded={false}>
            {pending.length === 0 ? <Empty icon={ShieldCheck} title={t("kyc.emptyTitle")} body={t("kyc.emptyBody")} /> : <ul className="divide-y divide-line">{pending.map((c) => <Row key={c.id} c={c} />)}</ul>}
          </Card>
          {done.length > 0 && (
            <Card title={t("kyc.done", { count: done.length })} padded={false}>
              <ul className="divide-y divide-line">{done.map((c) => <Row key={c.id} c={c} />)}</ul>
            </Card>
          )}
        </div>
        <div className="space-y-4">
          <Card title={t("kyc.principlesTitle")}>
            <ul className="space-y-3 text-[13px] leading-relaxed text-ink-2">
              {(["p1", "p2", "p3"] as const).map((k) => (
                <li key={k} className="flex gap-2.5">
                  <Fingerprint size={16} className="mt-0.5 shrink-0 text-navy-600" />
                  {t(`kyc.${k}`)}
                </li>
              ))}
            </ul>
          </Card>
          <Card title={t("kyc.accessLog")} padded={false}>
            {views.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-ink-3">{t("kyc.accessEmpty")}</p>
            ) : (
              <ul className="divide-y divide-line">
                {views.slice(0, 8).map((v) => (
                  <li key={v.id} className="px-5 py-2.5 text-[12.5px]">
                    <p className="font-mono text-ink">{v.subject}</p>
                    <p className="text-ink-3">{v.purpose ? loc(v.purpose, locale) : ""}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
      <CaseDrawer dept={dept} kase={selected} onClose={() => go({ c: null })} />
    </>
  );
}
