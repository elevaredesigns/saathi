"use client";

import { ArrowUpRight, Baby, ChartLineUp, Compass, IdentificationCard, Microphone, Target, UserPlus, Wallet, type Icon } from "@phosphor-icons/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { Guilloche } from "@/components/system/imagery/Guilloche";
import { KolamField } from "@/components/system/imagery/KolamField";
import { Reveal } from "@/components/system/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/system/motion/Stagger";
import { IconTile, type TileTone } from "@/components/system/ui/IconTile";
import { Chapter, Prose } from "./Chapter";

export function SystemChapter() {
  const t = useTranslations("caseStudy");
  const colours = t.raw("cs.system.colours") as { name: string; hex: string; use: string }[];
  return (
    <Chapter id="system" label={t("cs.chapters.system")} heading={t("cs.system.heading")}>
      <Prose paragraphs={[t("cs.system.body")]} />

      <p className="mt-12 text-[20px] font-semibold tracking-[-0.01em] text-ink">{t("cs.system.colourTitle")}</p>
      <Stagger as="ul" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5" gap={0.05}>
        {colours.map((c) => (
          <StaggerItem as="li" key={c.hex}>
            <div className="h-24 rounded-[18px] ring-1 ring-inset ring-black/[0.08]" style={{ background: c.hex }} />
            <p className="mt-2.5 text-[15px] font-semibold text-ink">{c.name}</p>
            <p className="text-[13px] text-ink-3">{c.hex}</p>
            <p className="mt-1 text-[13.5px] leading-snug text-ink-2">{c.use}</p>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <Reveal className="rounded-[24px] bg-surface p-6">
          <p className="font-wordmark text-[40px] leading-none text-ink">
            Aa <span className="font-anek-deva">अ</span> <span className="font-anek-tamil">த</span>
          </p>
          <p className="mt-5 text-[17px] font-semibold text-ink">{t("cs.system.typeTitle")}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{t("cs.system.typeBody")}</p>
        </Reveal>
        <Reveal delay={0.06} className="relative overflow-hidden rounded-[24px] bg-surface p-6">
          <div className="flex h-10 items-center gap-2">
            <KolamField cols={3} rows={3} cell={14} seed={7} density={0.62} diamond className="h-10 w-10 text-navy-600" />
            <Guilloche tone="navy" opacity={0.6} className="h-10 w-10" />
          </div>
          <p className="mt-5 text-[17px] font-semibold text-ink">{t("cs.system.imageryTitle")}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{t("cs.system.imageryBody")}</p>
        </Reveal>
        <Reveal delay={0.12} className="rounded-[24px] bg-surface p-6">
          <SaathiOrb size={40} state="thinking" />
          <p className="mt-5 text-[17px] font-semibold text-ink">{t("cs.system.motionTitle")}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{t("cs.system.motionBody")}</p>
        </Reveal>
      </div>

      <Reveal className="mt-10 rounded-[20px] bg-surface p-5">
        <p className="text-[15px] leading-relaxed text-ink-2">{t("brand.disclaimer")}</p>
      </Reveal>

      <Reveal className="mt-8">
        <Link href="/system/" className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-navy-600 underline-offset-4 hover:underline">
          {t("cs.system.link")}
          <ArrowUpRight size={16} weight="bold" />
        </Link>
      </Reveal>
    </Chapter>
  );
}

const FLOW_VISUAL: { icon: Icon; tone: TileTone }[] = [
  { icon: UserPlus, tone: "navy" },
  { icon: Baby, tone: "saffron" },
  { icon: Microphone, tone: "green" },
  { icon: Compass, tone: "violet" },
  { icon: Wallet, tone: "teal" },
  { icon: IdentificationCard, tone: "navy" },
];

export function FlowsChapter() {
  const t = useTranslations("caseStudy");
  const items = t.raw("flows.items") as { name: string; goal: string; desc: string }[];
  const hrefs = t.raw("flows.hrefs") as string[];
  return (
    <Chapter id="flows" label={t("cs.chapters.flows")} heading={t("flows.heading")}>
      <Stagger as="ol" className="grid gap-3 sm:grid-cols-2" gap={0.05}>
        {items.map((f, i) => (
          <StaggerItem as="li" key={f.name}>
            <Link href={hrefs[i] ?? "/prototype/"} className="group flex h-full flex-col rounded-[24px] p-6 ring-1 ring-line transition-[box-shadow,transform] duration-200 hover:shadow-[0_18px_40px_-24px_rgba(11,13,20,0.35)] active:scale-[0.99]">
              <div className="flex items-center justify-between">
                <IconTile icon={FLOW_VISUAL[i].icon} tone={FLOW_VISUAL[i].tone} size="md" />
                <ArrowUpRight size={18} weight="bold" className="text-ink-4 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-600" />
              </div>
              <p className="mt-5 text-[18px] font-semibold text-ink">{f.name}</p>
              <p className="mt-1 text-[15px] font-medium text-navy-700">{f.goal}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{f.desc}</p>
              <span className="mt-auto pt-4 text-[14px] font-semibold text-navy-600">{t("cs.flowsLinks.open")}</span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Chapter>
  );
}

export function SuccessChapter() {
  const t = useTranslations("caseStudy.cs");
  const metrics = t.raw("success.metrics") as { value: string; label: string }[];
  const plan = t.raw("success.plan") as { title: string; body: string }[];
  return (
    <Chapter id="success" label={t("chapters.success")} heading={t("success.heading")}>
      <Prose paragraphs={[t("success.body")]} />
      <p className="mt-12 flex items-center gap-2 text-[20px] font-semibold tracking-[-0.01em] text-ink">
        <Target size={22} weight="duotone" className="text-navy-600" />
        {t("success.metricsTitle")}
      </p>
      <Stagger as="ul" className="mt-5 grid gap-px overflow-hidden rounded-[24px] bg-line ring-1 ring-line sm:grid-cols-2" gap={0.05}>
        {metrics.map((m) => (
          <StaggerItem as="li" key={m.label} className="bg-white p-6">
            <p className="text-[44px] font-semibold leading-none tracking-[var(--track-display)] text-ink">{m.value}</p>
            <p className="mt-3 max-w-[30ch] text-[15px] leading-snug text-ink-2">{m.label}</p>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-14 flex items-center gap-2 text-[20px] font-semibold tracking-[-0.01em] text-ink">
        <ChartLineUp size={22} weight="duotone" className="text-navy-600" />
        {t("success.planTitle")}
      </p>
      <ol className="mt-5 space-y-0">
        {plan.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.05} className="relative flex gap-4 pb-7 last:pb-0">
            {i < plan.length - 1 && <span className="absolute bottom-0 left-[15px] top-9 w-[2px] rounded-full bg-surface2" />}
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-[14px] font-semibold tabular-nums text-navy-700">{i + 1}</span>
            <div className="pt-1">
              <p className="text-[17px] font-semibold text-ink">{p.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Chapter>
  );
}

const OTHER_URLS = ["https://knotapp.space/", "https://atelieros.space/"];

export function ReflectionChapter() {
  const t = useTranslations("caseStudy");
  const others = t.raw("reflection.others") as { name: string; desc: string }[];
  return (
    <Chapter id="reflection" label={t("cs.chapters.reflection")} heading={t("reflection.heading")}>
      <Prose paragraphs={t.raw("reflection.body") as string[]} />

      <Reveal className="mt-12 grid gap-6 rounded-[28px] bg-surface p-7 md:grid-cols-[auto_1fr] md:p-9">
        <SaathiMark size={52} />
        <div>
          <p className="text-[20px] font-semibold text-ink">{t("reflection.aboutHeading")}</p>
          <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed text-ink-2">{t("reflection.aboutBody")}</p>
          <a href="https://krishom.me/" target="_blank" rel="noreferrer" className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-[15px] font-semibold text-white transition-transform active:scale-[0.97]">
            {t("reflection.contact")}
          </a>
        </div>
      </Reveal>

      <p className="mt-12 text-[15px] font-semibold text-ink">{t("reflection.otherWork")}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {others.map((o, i) => (
          <li key={o.name}>
            <a href={OTHER_URLS[i]} target="_blank" rel="noreferrer" className="group flex items-center justify-between rounded-[20px] p-5 ring-1 ring-line transition-shadow duration-200 hover:shadow-[0_14px_30px_-20px_rgba(11,13,20,0.35)]">
              <span>
                <span className="block text-[17px] font-semibold text-ink">{o.name}</span>
                <span className="block text-[14.5px] text-ink-2">{o.desc}</span>
              </span>
              <ArrowUpRight size={18} weight="bold" className="text-ink-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}
