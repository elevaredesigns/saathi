"use client";

import { Bank, Check, CheckCircle, Clock, CurrencyInr, FileText, Globe, SealCheck, UserCheck, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { ScreenHeader } from "@/components/prototype/frame/ScreenHeader";
import { SCHEME_VISUAL } from "@/components/prototype/home/SchemeRail";
import { Button } from "@/components/prototype/ui/Button";
import { DetailSkeleton } from "@/components/prototype/ui/DetailSkeleton";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import { CountUp } from "@/components/system/motion/CountUp";
import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { Badge } from "@/components/system/ui/Badge";
import { IconTile } from "@/components/system/ui/IconTile";
import { getApplyFlow } from "@/lib/applyFlows";
import { usePrototype } from "@/lib/context/PrototypeContext";
import { getScheme, loc } from "@/lib/mockData";
import { formatINR, formatINRCompact } from "@/lib/utils/currency";
import { useAppRouter } from "@/lib/navigation/useAppRouter";

const HOW_ICONS: Icon[] = [UserCheck, FileText, Bank];

export default function SchemeDetailPage() {
  const router = useAppRouter();
  const t = useTranslations("explore");
  const ta = useTranslations("apply");
  const { locale } = useLocaleSwitch();
  const { lifeContext } = usePrototype();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const scheme = getScheme(id);
  if (!scheme) return <DetailSkeleton />;

  const flow = getApplyFlow(scheme.id);
  const matched = scheme.forContext.some((c) => lifeContext.includes(c));
  const v = scheme.id === "pmkisan" ? SCHEME_VISUAL.farming : SCHEME_VISUAL[scheme.category] ?? SCHEME_VISUAL.money;
  const how = t.raw("how") as { title: string; body: string }[];
  const fee = flow.fee === "Free" || !flow.fee ? ta("free") : flow.fee;

  const facts: { icon: Icon; label: string; value: string }[] = [
    { icon: Globe, label: t("portal"), value: flow.portal },
    { icon: Clock, label: t("time"), value: loc(flow.timeline, locale) },
    { icon: CurrencyInr, label: t("fee"), value: fee },
    { icon: FileText, label: t("documents"), value: t("docsCount", { count: flow.documents.length }) },
  ];

  return (
    <div className="pb-4">
      <ScreenHeader back title={loc(scheme.name, locale)} eyebrow={loc(scheme.department, locale)}>
        <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{loc(scheme.desc, locale)}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="green" icon={SealCheck}>
            {t("officialScheme")}
          </Badge>
          {matched && <Badge tone="violet">{t("matchesYou")}</Badge>}
        </div>
      </ScreenHeader>

      {/* Benefit */}
      <div className="relative mx-5 overflow-hidden rounded-[24px] bg-gradient-to-br from-navy-900 via-navy-800 to-navy-600 p-5 text-white shadow-[0_22px_44px_-22px_rgba(10,28,84,0.7)]">
        <Guilloche tone="white" opacity={0.13} className="absolute -right-16 -top-16 h-60 w-60" />
        <div className="relative flex items-start justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">{t("benefit")}</p>
          <IconTile icon={v.icon} tone={v.tone} size="sm" />
        </div>
        <p className="relative mt-2 text-[40px] font-semibold leading-none tracking-[-0.03em]">
          {scheme.benefit != null ? (
            <CountUp value={scheme.benefit} format={(n) => (scheme.benefit! >= 100000 ? formatINRCompact(n) : formatINR(n))} duration={1.1} />
          ) : (
            t("savingsAccount")
          )}
        </p>
        <p className="relative mt-1.5 text-[14px] text-white/75">{loc(scheme.benefitNote, locale)}</p>
      </div>

      {/* Why you qualify */}
      <section className="mt-7 px-5">
        <h2 className="text-[19px] font-semibold tracking-[-0.012em] text-ink">{t("whyQualify")}</h2>
        <p className="mt-0.5 text-[13.5px] text-ink-3">{matched ? t("basedOnProfile") : t("checkCriteria")}</p>
        <Stagger as="ul" className="mt-3 space-y-2" gap={0.06} amount={0}>
          {scheme.eligibility.map((e, i) => (
            <StaggerItem as="li" key={i} className="flex items-center gap-3 rounded-[16px] bg-green-50/70 px-3.5 py-3 ring-1 ring-inset ring-green-100">
              <CheckCircle size={20} weight="fill" className="shrink-0 text-green-600" />
              <span className="text-[15px] font-medium text-ink">{loc(e, locale)}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Facts */}
      <Reveal as="section" className="mt-7 px-5">
        <h2 className="text-[19px] font-semibold tracking-[-0.012em] text-ink">{t("detailsTitle")}</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {facts.map((f) => (
            <div key={f.label} className="rounded-[18px] bg-surface p-3.5">
              <f.icon size={18} weight="duotone" className="text-navy-600" />
              <p className="mt-2 text-[11.5px] font-medium uppercase tracking-[0.06em] text-ink-3">{f.label}</p>
              <p className="text-[14px] font-semibold leading-snug text-ink">{f.value}</p>
            </div>
          ))}
        </div>
        {flow.documents.length > 0 && (
          <ul className="mt-3 space-y-1.5 rounded-[18px] p-3.5 ring-1 ring-line">
            {flow.documents.map((d, i) => (
              <li key={i} className="flex items-center gap-2 text-[14px] text-ink-2">
                <Check size={14} weight="bold" className="text-green-600" />
                {loc(d, locale)}
              </li>
            ))}
          </ul>
        )}
      </Reveal>

      {/* How it works */}
      <Reveal as="section" className="mt-7 px-5">
        <h2 className="text-[19px] font-semibold tracking-[-0.012em] text-ink">{t("howItWorks")}</h2>
        <ol className="mt-3 space-y-0">
          {how.map((step, i) => {
            const StepIcon = HOW_ICONS[i];
            return (
              <li key={step.title} className="relative flex gap-3 pb-5 last:pb-0">
                {i < how.length - 1 && <span className="absolute bottom-0 left-[17px] top-9 w-[2px] rounded-full bg-surface2" />}
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600">
                  <StepIcon size={18} weight="duotone" />
                </span>
                <span className="pt-1">
                  <span className="block text-[15px] font-semibold text-ink">{step.title}</span>
                  <span className="block text-[13.5px] leading-snug text-ink-3">{step.body}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </Reveal>

      {/* Sticky actions above the tab bar */}
      <div className="sticky bottom-0 z-10 mt-8 px-4 pb-2">
        <div className="flex gap-2 rounded-[22px] bg-white/85 p-2 shadow-[0_12px_32px_-12px_rgba(11,13,20,0.25)] ring-1 ring-black/[0.05] backdrop-blur-xl">
          <Button
            variant="secondary"
            size="md"
            className="shrink-0 px-3.5"
            onClick={() => router.push(`/prototype/saathi/?scheme=${scheme.id}`)}
            iconLeft={<SaathiOrb size={22} />}
          >
            {t("askAbout")}
          </Button>
          <Button size="md" className="flex-1" onClick={() => router.push(`/prototype/apply/?id=${scheme.id}`)}>
            {t("apply")}
          </Button>
        </div>
      </div>
    </div>
  );
}
