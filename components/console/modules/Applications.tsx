"use client";

import { Broadcast, Flag, MagnifyingGlass, Tray } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { isOpen, queueServices, serviceName, slaLeft, type ConsoleCase } from "@/lib/console/cases";
import { FLAGS } from "@/lib/console/reasons";
import { loc } from "@/lib/mockData";
import { formatDate } from "@/lib/utils/dateUtils";
import { cn } from "@/lib/utils";
import { CaseDrawer } from "../CaseDrawer";
import { ModuleHeader, type ModuleProps } from "../ConsoleApp";
import { Empty, Initials, Pill, SlaPill, StagePill, Tabs } from "../ui";

type Filter = "open" | "info" | "decided" | "all";

const matchFilter = (c: ConsoleCase, f: Filter) =>
  f === "all" ? true : f === "open" ? isOpen(c.stage) : f === "info" ? c.stage === "infoRequested" : ["approved", "issued", "rejected"].includes(c.stage);

export function ApplicationsModule({ dept, cases, route, go }: ModuleProps) {
  const t = useTranslations("console");
  const { locale } = useLocaleSwitch();
  const [filter, setFilter] = useState<Filter>("open");
  const [service, setService] = useState("all");
  const [query, setQuery] = useState(route.q);

  useEffect(() => {
    setQuery(route.q);
    if (route.q) setFilter("all");
  }, [route.q]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases
      .filter((c) => matchFilter(c, filter))
      .filter((c) => service === "all" || c.serviceId === service)
      .filter((c) => !q || c.ref.toLowerCase().includes(q) || c.applicant.name.toLowerCase().includes(q))
      .sort((a, b) => Number(!!b.live) - Number(!!a.live) || (isOpen(a.stage) && isOpen(b.stage) ? slaLeft(a) - slaLeft(b) : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
  }, [cases, filter, service, query]);

  const selected = cases.find((c) => c.id === route.c) ?? null;
  const count = (f: Filter) => cases.filter((c) => matchFilter(c, f)).length;

  // Keyboard triage: j / k move through the list, Enter opens.
  const [cursor, setCursor] = useState(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (selected || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      if (e.key === "j") setCursor((i) => Math.min(i + 1, rows.length - 1));
      if (e.key === "k") setCursor((i) => Math.max(i - 1, 0));
      if (e.key === "Enter" && rows[cursor]) go({ c: rows[cursor].id });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rows, cursor, selected, go]);

  return (
    <>
      <ModuleHeader title={t("modules.applications")} subtitle={t("apps.subtitle", { open: count("open"), total: cases.length })} />

      <div className="rounded-[16px] border border-line bg-white shadow-[0_1px_2px_rgba(11,13,20,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-2">
          <Tabs
            value={filter}
            onChange={(f) => {
              setFilter(f);
              setCursor(0);
            }}
            className="border-b-0"
            items={[
              { value: "open", label: t("apps.filterOpen"), count: count("open") },
              { value: "info", label: t("apps.filterInfo"), count: count("info") },
              { value: "decided", label: t("apps.filterDecided"), count: count("decided") },
              { value: "all", label: t("apps.filterAll"), count: cases.length },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <select value={service} onChange={(e) => setService(e.target.value)} aria-label={t("apps.service")} className="h-9 max-w-[240px] rounded-[10px] bg-white px-2.5 text-[13px] text-ink ring-1 ring-inset ring-line-strong outline-none focus:ring-2 focus:ring-navy-600">
              <option value="all">{t("apps.allServices")}</option>
              {queueServices(dept).map((id) => (
                <option key={id} value={id}>
                  {loc(serviceName(id), locale)}
                </option>
              ))}
            </select>
            <label className="flex h-9 w-[220px] items-center gap-2 rounded-[10px] px-2.5 ring-1 ring-inset ring-line-strong focus-within:ring-2 focus-within:ring-navy-600">
              <MagnifyingGlass size={14} className="text-ink-3" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("apps.search")} aria-label={t("apps.search")} className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-3" />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-line">
          {rows.length === 0 ? (
            <Empty icon={Tray} title={t("apps.emptyTitle")} body={t("apps.emptyBody")} />
          ) : (
            <table className="w-full min-w-[920px] text-left">
              <thead>
                <tr className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">
                  <th className="px-4 py-2.5">{t("apps.colApplicant")}</th>
                  <th className="px-3 py-2.5">{t("apps.colService")}</th>
                  <th className="px-3 py-2.5">{t("apps.colRef")}</th>
                  <th className="px-3 py-2.5">{t("apps.colReceived")}</th>
                  <th className="px-3 py-2.5">{t("apps.colSla")}</th>
                  <th className="px-3 py-2.5">{t("apps.colStage")}</th>
                  <th className="px-4 py-2.5 text-right">{t("apps.colFlags")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((c, i) => (
                  <tr
                    key={c.id}
                    onClick={() => go({ c: c.id })}
                    onMouseEnter={() => setCursor(i)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && go({ c: c.id })}
                    aria-selected={i === cursor}
                    className={cn("cursor-pointer text-[13px] outline-none transition-colors focus-visible:bg-navy-50", i === cursor ? "bg-surface/80" : "hover:bg-surface/60", c.live && "bg-green-50/40")}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Initials name={c.applicant.name} size={30} />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-semibold text-ink">
                            {c.applicant.name}
                            {c.live && (
                              <Pill tone="green" icon={Broadcast} className="h-5 px-1.5 text-[10.5px]">
                                {t("liveBadge")}
                              </Pill>
                            )}
                          </p>
                          <p className="font-mono text-[11.5px] text-ink-3">XXXX XXXX {c.applicant.aadhaarLast4}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[220px] truncate px-3 py-2.5 text-ink-2">{loc(c.service, locale)}</td>
                    <td className="px-3 py-2.5 font-mono text-[12px] text-ink-2">{c.ref}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-ink-2">{formatDate(c.submittedAt, locale)}</td>
                    <td className="px-3 py-2.5">
                      <SlaPill days={slaLeft(c)} open={isOpen(c.stage)} />
                    </td>
                    <td className="px-3 py-2.5">
                      <StagePill stage={c.stage} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {c.flags.length > 0 ? (
                        <span title={c.flags.map((f) => loc(FLAGS[f].label, locale)).join(", ")} className="inline-flex items-center gap-1 text-[12px] font-semibold text-saffron-700">
                          <Flag size={13} weight="fill" />
                          {c.flags.length}
                        </span>
                      ) : (
                        <span className="text-ink-4">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="border-t border-line px-4 py-2.5 text-[12px] text-ink-3">{t("apps.keyboard")}</p>
      </div>

      <CaseDrawer dept={dept} kase={selected} onClose={() => go({ c: null })} />
    </>
  );
}
