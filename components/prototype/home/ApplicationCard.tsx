"use client";

import { CaretRight } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { ProgressBar } from "@/components/prototype/ui/ProgressBar";
import { StatusBadge } from "@/components/prototype/ui/StatusBadge";
import { loc, type TrackableApplication } from "@/lib/mockData";
import { stageProgress } from "@/lib/progress";
import { buildTimeline } from "@/lib/timeline";

/** An application at a glance: where it is, how far along, what's next. */
export function ApplicationCard({ app, onClick }: { app: TrackableApplication; onClick?: () => void }) {
  const { locale } = useLocaleSwitch();
  const t = useTranslations("home");
  const progress = stageProgress(app.status);
  const timeline = buildTimeline(app, locale);
  const current = timeline.find((s) => s.state === "current");
  const done = progress.index >= progress.total;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[22px] bg-white p-4 text-left ring-1 ring-line transition-[transform,box-shadow] duration-150 ease-out active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-semibold leading-snug text-ink">{loc(app.service, locale)}</p>
          <p className="mt-0.5 font-mono text-[11.5px] tracking-[0.02em] text-ink-3">{app.ref}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>
      <div className="mt-3.5 flex items-center gap-3">
        <ProgressBar value={progress.fraction} tone={done ? "green" : "navy"} className="flex-1" label={loc(app.service, locale)} />
        <span className="text-[12px] font-semibold tabular-nums text-ink-3">
          {progress.index}/{progress.total}
        </span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-[13px] text-ink-2">
          {done ? t("appDone") : current ? t("appNext", { step: current.name }) : ""}
          {current?.dateLabel && !done && <span className="text-ink-3"> · {current.dateLabel}</span>}
        </p>
        <CaretRight size={15} weight="bold" className="shrink-0 text-ink-4" />
      </div>
    </button>
  );
}
