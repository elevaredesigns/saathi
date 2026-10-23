"use client";

import { ArrowRight, CaretRight } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { KIND_VISUAL } from "@/components/prototype/apply/kindVisual";
import { ServiceCard } from "@/components/prototype/explore/ServiceCard";
import { ScreenHeader } from "@/components/prototype/frame/ScreenHeader";
import { SCHEME_VISUAL } from "@/components/prototype/home/SchemeRail";
import { DetailSkeleton } from "@/components/prototype/ui/DetailSkeleton";
import { SectionHeader } from "@/components/prototype/ui/SectionHeader";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { KolamField } from "@/components/system/imagery/KolamField";
import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { IconTile } from "@/components/system/ui/IconTile";
import { getApplyFlow } from "@/lib/applyFlows";
import { getMoment, getScheme, getService, loc, type L } from "@/lib/mockData";
import { formatINRCompact } from "@/lib/utils/currency";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

/** Moment-specific first task per service (otherwise the service's first task). */
const PREFERRED_TASK: Record<string, Record<string, string>> = {
  newBaby: { certificates: "cert_birth", health: "health_ayushman", identity: "identity_eaadhaar" },
  bereavement: { certificates: "cert_income", money: "money_bank" },
  farming: { land: "land_record" },
  buyingHome: { land: "land_mutation" },
};

interface ChecklistItem {
  key: string;
  title: L;
  subtitle: string;
  href: string;
  visual: { icon: typeof ArrowRight; tone: Parameters<typeof IconTile>[0]["tone"] };
}

export default function MomentDetailPage() {
  const router = useAppRouter();
  const t = useTranslations("explore");
  const { locale } = useLocaleSwitch();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const moment = getMoment(id);
  if (!moment) return <DetailSkeleton />;

  const services = moment.services.flatMap((sid) => {
    const s = getService(sid);
    return s ? [s] : [];
  });
  const schemes = moment.schemes.flatMap((scid) => {
    const s = getScheme(scid);
    return s ? [s] : [];
  });

  const checklist: ChecklistItem[] = [
    ...services.map((s) => {
      const taskId = PREFERRED_TASK[moment.id]?.[s.id] ?? s.tasks[0].id;
      const task = s.tasks.find((x) => x.id === taskId) ?? s.tasks[0];
      const flow = getApplyFlow(task.id);
      return {
        key: task.id,
        title: task.name,
        subtitle: `${flow.portal} · ${loc(flow.timeline, locale)}`,
        href: `/prototype/apply/?id=${task.id}`,
        visual: KIND_VISUAL[flow.kind],
      };
    }),
    ...schemes.map((sc) => ({
      key: sc.id,
      title: sc.name,
      subtitle: sc.benefit != null ? `${formatINRCompact(sc.benefit)} ${loc(sc.benefitNote, locale)}` : loc(sc.desc, locale),
      href: `/prototype/scheme/?id=${sc.id}`,
      visual: SCHEME_VISUAL[sc.category] ?? SCHEME_VISUAL.money,
    })),
  ];

  return (
    <div className="pb-8">
      <ScreenHeader back title={loc(moment.name, locale)} eyebrow={t("momentEyebrow")} />

      <div className="relative mx-5 overflow-hidden rounded-[24px] bg-surface p-5">
        <KolamField cols={5} rows={3} cell={34} seed={moment.id.length * 11} density={0.6} className="pointer-events-none absolute -right-6 -top-4 h-32 w-56 text-ink/[0.07]" />
        <IconTile icon={moment.icon} tone={moment.tone} size="xl" className="relative" />
        <p className="relative mt-4 text-[15.5px] leading-relaxed text-ink-2">{t("momentDetailIntro")}</p>
      </div>

      <section className="mt-7 px-5">
        <SectionHeader title={t("checklistTitle")} />
        <p className="-mt-2 mb-3 text-[13.5px] text-ink-3">{t("checklistSub")}</p>
        <Stagger as="ol" className="divide-y divide-line overflow-hidden rounded-[22px] bg-white ring-1 ring-line" gap={0.05} amount={0}>
          {checklist.map((item, i) => (
            <StaggerItem as="li" key={item.key}>
              <button
                type="button"
                onClick={() => router.push(item.href)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 active:bg-surface"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface2 text-[12px] font-bold tabular-nums text-ink-2">{i + 1}</span>
                <IconTile icon={item.visual.icon} tone={item.visual.tone} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold leading-snug text-ink">{loc(item.title, locale)}</span>
                  <span className="block truncate text-[12.5px] text-ink-3">{item.subtitle}</span>
                </span>
                <CaretRight size={16} weight="bold" className="shrink-0 text-ink-4" />
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal className="mt-5 px-5">
        <button
          type="button"
          onClick={() => router.push(`/prototype/saathi/?moment=${moment.id}`)}
          className="flex w-full items-center gap-3 rounded-[22px] bg-gradient-to-br from-navy-900 to-navy-600 p-4 text-left text-white shadow-[0_18px_36px_-18px_rgba(10,28,84,0.7)] transition-transform duration-150 active:scale-[0.99]"
        >
          <SaathiOrb size={46} />
          <span className="min-w-0 flex-1">
            <span className="block text-[15.5px] font-semibold">{t("askMoment")}</span>
            <span className="block text-[12.5px] leading-snug text-white/75">{t("askMomentSub")}</span>
          </span>
          <ArrowRight size={18} weight="bold" />
        </button>
      </Reveal>

      <Reveal as="section" className="mt-8 px-5">
        <SectionHeader title={t("relatedServices")} />
        <div className="grid grid-cols-3 gap-2">
          {services.map((s) => (
            <ServiceCard key={s.id} compact service={s} onClick={() => router.push(`/prototype/service/?id=${s.id}`)} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
