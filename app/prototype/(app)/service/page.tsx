"use client";

import { CaretRight } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { KIND_VISUAL } from "@/components/prototype/apply/kindVisual";
import { SchemeCard } from "@/components/prototype/explore/SchemeCard";
import { ScreenHeader } from "@/components/prototype/frame/ScreenHeader";
import { DetailSkeleton } from "@/components/prototype/ui/DetailSkeleton";
import { SectionHeader } from "@/components/prototype/ui/SectionHeader";
import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { IconTile } from "@/components/system/ui/IconTile";
import { getApplyFlow } from "@/lib/applyFlows";
import { getService, loc, SCHEMES } from "@/lib/mockData";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

export default function ServiceDetailPage() {
  const router = useAppRouter();
  const t = useTranslations("explore");
  const ta = useTranslations("apply");
  const { locale } = useLocaleSwitch();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const service = getService(id);
  if (!service) return <DetailSkeleton />;

  const schemes = SCHEMES.filter((s) => s.category === service.id);

  return (
    <div className="pb-8">
      <ScreenHeader back title={loc(service.name, locale)} eyebrow={t("serviceEyebrow")}>
        <div className="mt-4 flex items-center gap-3.5">
          <IconTile icon={service.icon} tone={service.tone} size="lg" />
          <p className="flex-1 text-[15px] leading-relaxed text-ink-2">{loc(service.blurb, locale)}</p>
        </div>
      </ScreenHeader>

      <section className="px-5">
        <SectionHeader title={t("tasksTitle")} />
        <Stagger className="divide-y divide-line overflow-hidden rounded-[22px] bg-white ring-1 ring-line" gap={0.05} amount={0}>
          {service.tasks.map((task) => {
            const flow = getApplyFlow(task.id);
            const v = KIND_VISUAL[flow.kind];
            const cost = flow.kind === "pay" ? flow.amount : flow.fee === "Free" ? ta("free") : flow.fee;
            return (
              <StaggerItem key={task.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/prototype/apply/?id=${task.id}`)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 active:bg-surface"
                >
                  <IconTile icon={v.icon} tone={v.tone} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15.5px] font-semibold leading-snug text-ink">{loc(task.name, locale)}</span>
                    <span className="mt-0.5 block truncate text-[12.5px] text-ink-3">
                      {flow.portal} · {loc(flow.timeline, locale)}
                      {cost ? ` · ${cost}` : ""}
                    </span>
                  </span>
                  <CaretRight size={16} weight="bold" className="shrink-0 text-ink-4" />
                </button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {schemes.length > 0 && (
        <Reveal as="section" className="mt-8 px-5">
          <SectionHeader title={t("relatedSchemes")} />
          <div className="space-y-2.5">
            {schemes.map((s) => (
              <SchemeCard key={s.id} scheme={s} onClick={() => router.push(`/prototype/scheme/?id=${s.id}`)} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
