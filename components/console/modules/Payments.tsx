"use client";

import { ArrowCounterClockwise, CurrencyInr } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { payments, type Payment } from "@/lib/console/operations";
import { useConsole } from "@/lib/console/store";
import { loc } from "@/lib/mockData";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { Btn, Card, Dialog, Empty, inr, Pill, useToast } from "../ui";

export function PaymentsModule({ dept }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const toast = useToast();
  const { refunds, patch } = useConsole();
  const [refundFor, setRefundFor] = useState<Payment | null>(null);
  const list = useMemo(() => payments(dept.id), [dept.id]);

  const settled = list.filter((p) => p.status === "settled" && !refunds.includes(p.id));
  const total = settled.reduce((s, p) => s + p.amount, 0);
  const upiShare = settled.filter((p) => p.mode === "UPI").length / (settled.length || 1);
  const fmt = (iso: string) => new Intl.DateTimeFormat(locale === "en" ? "en-IN" : `${locale}-IN`, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", numberingSystem: "latn" }).format(new Date(iso));

  return (
    <>
      <ModuleHeader title={t("modules.payments")} subtitle={t("payments.subtitle")} />
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: t("payments.collected"), value: inr(total) },
          { label: t("payments.transactions"), value: String(list.length) },
          { label: t("payments.upiShare"), value: `${Math.round(upiShare * 100)}%` },
        ].map((k) => (
          <div key={k.label} className="rounded-[16px] border border-line bg-white p-4">
            <p className="text-[13px] text-ink-2">{k.label}</p>
            <p className="mt-2 text-[28px] font-semibold tabular-nums tracking-[-0.02em] text-ink">{k.value}</p>
          </div>
        ))}
      </div>

      <Card className="mt-4" padded={false} title={t("payments.ledger")}>
        {list.length === 0 ? (
          <Empty icon={CurrencyInr} title={t("payments.empty")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13px]">
              <thead>
                <tr className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">
                  <th className="px-5 py-2.5">{t("payments.colTxn")}</th>
                  <th className="px-3 py-2.5">{t("payments.colPayer")}</th>
                  <th className="px-3 py-2.5">{t("payments.colPurpose")}</th>
                  <th className="px-3 py-2.5">{t("payments.colMode")}</th>
                  <th className="px-3 py-2.5 text-right">{t("payments.colAmount")}</th>
                  <th className="px-3 py-2.5">{t("payments.colStatus")}</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((p) => {
                  const refunded = refunds.includes(p.id);
                  return (
                    <tr key={p.id} className="hover:bg-surface/60">
                      <td className="px-5 py-2.5">
                        <p className="font-mono text-[12px] text-ink">{p.id}</p>
                        <p className="text-[11.5px] text-ink-3">{fmt(p.at)}</p>
                      </td>
                      <td className="px-3 py-2.5 text-ink">{p.payer}</td>
                      <td className="max-w-[220px] truncate px-3 py-2.5 text-ink-2">{loc(p.purpose, locale)}</td>
                      <td className="px-3 py-2.5 text-ink-2">{p.mode}</td>
                      <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-ink">{inr(p.amount)}</td>
                      <td className="px-3 py-2.5">
                        {refunded ? <Pill tone="violet">{t("payments.refunded")}</Pill> : <Pill tone={p.status === "settled" ? "green" : p.status === "pending" ? "saffron" : "red"}>{t(`payments.status.${p.status}`)}</Pill>}
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        {p.status === "failed" || refunded ? null : (
                          <Btn size="sm" variant="ghost" icon={ArrowCounterClockwise} onClick={() => setRefundFor(p)}>
                            {t("payments.refund")}
                          </Btn>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Dialog
        open={!!refundFor}
        onClose={() => setRefundFor(null)}
        title={t("payments.refundTitle")}
        description={refundFor ? t("payments.refundBody", { amount: inr(refundFor.amount), payer: refundFor.payer }) : ""}
        footer={
          <>
            <Btn variant="ghost" onClick={() => setRefundFor(null)}>
              {t("cancel")}
            </Btn>
            <Btn
              variant="primary"
              icon={ArrowCounterClockwise}
              onClick={() => {
                if (!refundFor) return;
                patch((s) => ({ refunds: [...s.refunds, refundFor.id] }), { deptId: dept.id, kind: "refund", subject: refundFor.id, officer: dept.officer.name, note: inr(refundFor.amount) });
                toast(t("payments.refundToast", { amount: inr(refundFor.amount) }));
                setRefundFor(null);
              }}
            >
              {t("payments.confirmRefund")}
            </Btn>
          </>
        }
      />
    </>
  );
}
