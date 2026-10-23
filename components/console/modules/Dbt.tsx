"use client";

import { Bank, CheckCircle, HandCoins, Signature, WarningCircle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { dbtBatches, type DbtBatch } from "@/lib/console/operations";
import { useConsole } from "@/lib/console/store";
import { loc } from "@/lib/mockData";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { Btn, Card, compactInr, Dialog, Empty, Meter, Pill, useToast } from "../ui";

/** Direct Benefit Transfer: approve payment batches that go to beneficiaries' Aadhaar-seeded accounts. */
export function DbtModule({ dept }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const toast = useToast();
  const { dbt, patch } = useConsole();
  const [approving, setApproving] = useState<DbtBatch | null>(null);
  const [signing, setSigning] = useState(false);
  const batches = dbtBatches(dept.id);

  useEffect(() => {
    if (!signing || !approving) return;
    const id = window.setTimeout(() => {
      setSigning(false);
      patch((s) => ({ dbt: { ...s.dbt, [approving.id]: "sent" } }), { deptId: dept.id, kind: "dbtApproved", subject: `${approving.scheme.en} · ${approving.instalment.en}`, officer: dept.officer.name, note: compactInr(approving.amount) });
      toast(t("dbt.sentToast", { amount: compactInr(approving.amount), count: (approving.beneficiaries - approving.failed).toLocaleString("en-IN") }));
      setSigning(false);
      setApproving(null);
    }, 1400);
    return () => window.clearTimeout(id);
  }, [signing, approving, patch, dept, toast, t]);

  return (
    <>
      <ModuleHeader title={t("modules.dbt")} subtitle={t("dbt.subtitle")} />
      {batches.length === 0 ? (
        <Card>
          <Empty icon={HandCoins} title={t("dbt.empty")} />
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {batches.map((b) => {
            const status = (dbt[b.id] as "sent" | undefined) ?? b.initial;
            const ok = b.beneficiaries - b.failed;
            return (
              <Card key={b.id} padded={false}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">{loc(b.scheme, locale)}</p>
                      <h3 className="mt-1 text-[17px] font-semibold text-ink">{loc(b.instalment, locale)}</h3>
                    </div>
                    <Pill tone={status === "credited" ? "green" : status === "sent" ? "navy" : "saffron"}>{t(`dbt.status.${status}`)}</Pill>
                  </div>
                  <p className="mt-4 text-[30px] font-semibold tabular-nums tracking-[-0.02em] text-ink">{compactInr(b.amount)}</p>
                  <p className="text-[13px] text-ink-2">{t("dbt.beneficiaries", { count: b.beneficiaries.toLocaleString("en-IN") })}</p>
                  <Meter className="mt-4" value={ok / b.beneficiaries} tone="green" />
                  <div className="mt-2 flex justify-between text-[12.5px]">
                    <span className="flex items-center gap-1 text-green-800">
                      <CheckCircle size={14} weight="fill" className="text-green-600" />
                      {t("dbt.ready", { count: ok.toLocaleString("en-IN") })}
                    </span>
                    <span className="flex items-center gap-1 text-saffron-700">
                      <WarningCircle size={14} weight="fill" />
                      {t("dbt.failed", { count: b.failed.toLocaleString("en-IN") })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-line bg-surface/50 px-5 py-3">
                  {status === "awaiting" ? (
                    <Btn size="sm" variant="primary" icon={Signature} onClick={() => setApproving(b)}>
                      {t("dbt.approve")}
                    </Btn>
                  ) : (
                    <p className="flex items-center gap-1.5 text-[12.5px] text-ink-2">
                      <Bank size={15} className="text-navy-600" />
                      {t(status === "credited" ? "dbt.creditedNote" : "dbt.sentNote")}
                    </p>
                  )}
                  <span className="ml-auto text-[12px] text-ink-3">{t("dbt.failedHint")}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={!!approving}
        onClose={() => !signing && setApproving(null)}
        title={t("dbt.approveTitle")}
        description={approving ? t("dbt.approveBody", { amount: compactInr(approving.amount), count: (approving.beneficiaries - approving.failed).toLocaleString("en-IN"), failed: approving.failed.toLocaleString("en-IN") }) : ""}
        footer={
          <>
            <Btn variant="ghost" disabled={signing} onClick={() => setApproving(null)}>
              {t("cancel")}
            </Btn>
            <Btn variant="primary" icon={Signature} loading={signing} onClick={() => setSigning(true)}>
              {signing ? t("case.signing") : t("dbt.signSend")}
            </Btn>
          </>
        }
      />
    </>
  );
}
