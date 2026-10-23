"use client";

import { Certificate, DownloadSimple, MagnifyingGlass, Printer } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { loc } from "@/lib/mockData";
import { formatDate } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { RecordPreview } from "../RecordPreview";
import { Btn, Card, Empty, Pill, useToast } from "../ui";

/** Register of everything this office has issued — searchable, re-printable, pushed to DigiLocker. */
export function RecordsModule({ dept, cases }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const issued = useMemo(() => cases.filter((c) => c.stage === "issued" || c.stage === "approved"), [cases]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = issued.filter((c) => !query || c.ref.toLowerCase().includes(query.toLowerCase()) || c.applicant.name.toLowerCase().includes(query.toLowerCase()));
  const selected = issued.find((c) => c.id === selectedId) ?? list[0];

  return (
    <>
      <ModuleHeader title={t("modules.records")} subtitle={t("records.subtitle", { records: loc(dept.records, locale).toLowerCase() })} />
      <div className="grid gap-4 xl:grid-cols-[1fr_1.05fr]">
        <Card
          padded={false}
          title={t("records.register", { count: issued.length })}
          action={
            <label className="flex h-8 w-[200px] items-center gap-2 rounded-[10px] px-2.5 ring-1 ring-inset ring-line-strong focus-within:ring-2 focus-within:ring-navy-600">
              <MagnifyingGlass size={13} className="text-ink-3" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("records.search")} aria-label={t("records.search")} className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-ink-3" />
            </label>
          }
        >
          {list.length === 0 ? (
            <Empty icon={Certificate} title={t("records.emptyTitle")} body={t("records.emptyBody")} />
          ) : (
            <ul className="max-h-[560px] divide-y divide-line overflow-y-auto">
              {list.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => setSelectedId(c.id)} className={cn("flex w-full items-center gap-3 px-5 py-3 text-left transition-colors", selected?.id === c.id ? "bg-navy-50/60" : "hover:bg-surface/70")}>
                    <Certificate size={20} weight="duotone" className="shrink-0 text-navy-600" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-ink">{loc(c.service, locale)}</span>
                      <span className="block truncate text-[12.5px] text-ink-3">
                        {c.applicant.name} · <span className="font-mono">{c.ref}</span>
                      </span>
                    </span>
                    <Pill tone={c.stage === "issued" ? "green" : "saffron"}>{t(c.stage === "issued" ? "records.inLocker" : "records.awaitingSignature")}</Pill>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {selected && (
          <Card
            title={t("records.preview")}
            action={
              <div className="flex gap-1.5">
                <Btn size="sm" variant="ghost" icon={Printer} onClick={() => toast(t("records.printed"), "navy")}>
                  {t("records.print")}
                </Btn>
                <Btn size="sm" icon={DownloadSimple} onClick={() => toast(t("records.copyIssued", { ref: selected.ref }), "navy")}>
                  {t("records.certifiedCopy")}
                </Btn>
              </div>
            }
          >
            <RecordPreview dept={dept} service={selected.service} holder={selected.applicant.name} refNo={selected.ref} issuedAt={selected.submittedAt} signed={selected.stage === "issued"} />
            <p className="mt-3 text-[12.5px] text-ink-3">{t("records.note", { date: formatDate(selected.submittedAt, locale) })}</p>
          </Card>
        )}
      </div>
    </>
  );
}
