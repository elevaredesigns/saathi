"use client";

import { ArrowRight, Check, CopySimple, Megaphone } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { ScreenHeader } from "@/components/prototype/frame/ScreenHeader";
import { OfficerMessage } from "@/components/prototype/track/OfficerMessage";
import { StatusTimeline } from "@/components/prototype/track/StatusTimeline";
import { DetailSkeleton } from "@/components/prototype/ui/DetailSkeleton";
import { ProgressBar } from "@/components/prototype/ui/ProgressBar";
import { StatusBadge } from "@/components/prototype/ui/StatusBadge";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Reveal } from "@/components/system/motion/Reveal";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { loc } from "@/lib/mockData";
import { stageProgress } from "@/lib/progress";
import { buildTimeline } from "@/lib/timeline";
import { formatDate } from "@/lib/utils/dateUtils";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

export default function StatusPage() {
  const router = useAppRouter();
  const t = useTranslations("track");
  const { locale } = useLocaleSwitch();
  const { applications } = usePrototype();
  const [id, setId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const app = applications.find((a) => a.id === id);
  if (!app) return <DetailSkeleton />;

  const steps = buildTimeline(app, locale);
  const progress = stageProgress(app.status);
  const complete = progress.index >= progress.total;

  const copy = () => {
    navigator.clipboard?.writeText(app.ref).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="pb-8">
      <ScreenHeader back title={loc(app.service, locale)} eyebrow={t("submittedOn", { date: formatDate(app.date, locale) })} />

      <div className="mx-5 rounded-[24px] bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={app.status} />
          <button type="button" onClick={copy} className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 font-mono text-[12px] text-ink-2 ring-1 ring-line active:scale-95">
            {app.ref}
            {copied ? <Check size={13} weight="bold" className="text-green-600" /> : <CopySimple size={13} weight="bold" />}
          </button>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-[15px] font-semibold text-ink">{complete ? t("complete") : t("stageOf", { n: progress.index, total: progress.total })}</p>
          <p className="text-[13px] tabular-nums text-ink-3">{Math.round(progress.fraction * 100)}%</p>
        </div>
        <ProgressBar value={progress.fraction} tone={complete ? "green" : "navy"} className="mt-2 h-[6px]" />
      </div>

      <OfficerMessage app={app} />

      <section className="mt-7 px-5">
        <h2 className="mb-5 text-[19px] font-semibold tracking-[-0.012em] text-ink">{t("timeline")}</h2>
        <StatusTimeline steps={steps} />
      </section>

      <Reveal as="section" className="mt-8 px-5">
        <div className="overflow-hidden rounded-[22px] ring-1 ring-line">
          <p className="bg-surface px-4 py-3 text-[14px] font-semibold text-ink-2">{complete ? t("helpDone") : t("helpTitle")}</p>
          <button
            type="button"
            onClick={() => router.push(`/prototype/saathi/?app=${app.id}`)}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-surface"
          >
            <SaathiOrb size={36} />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-ink">{t("askWhy")}</span>
              <span className="block text-[12.5px] text-ink-3">{t("askWhySub")}</span>
            </span>
            <ArrowRight size={16} weight="bold" className="text-ink-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push("/prototype/apply/?id=griev_file")}
            className="flex w-full items-center gap-3 border-t border-line px-4 py-3.5 text-left transition-colors active:bg-surface"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface2 text-ink-2">
              <Megaphone size={18} weight="duotone" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-ink">{t("grievance")}</span>
              <span className="block text-[12.5px] text-ink-3">{t("grievanceSub")}</span>
            </span>
            <ArrowRight size={16} weight="bold" className="text-ink-4" />
          </button>
        </div>
      </Reveal>
    </div>
  );
}
