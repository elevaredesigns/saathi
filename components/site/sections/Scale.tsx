"use client";

import {
  ArrowDown,
  Buildings,
  CaretDown,
  Cpu,
  Database,
  DeviceMobile,
  Globe,
  Plugs,
  Queue,
  ShieldCheck,
  type Icon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";

import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { cn } from "@/lib/utils";
import { RequestJourney } from "./RequestJourney";
import { ScaleFlow } from "./ScaleFlow";

/*
 * Capacity model behind the calculator. These are design assumptions for a
 * production Saathi, stated on the page — not measurements of this prototype,
 * which is a static site with no servers.
 */
export const MODEL = {
  peakFactor: 4, // the busiest minute runs at ~4× the hour's average
  edgeShare: 0.85, // app shell, scripts, images, scheme pages: served by the CDN / offline cache
  writeShare: 0.12, // of requests that reach the API: submissions, payments, consents
  perServer: 250, // requests/second one service instance handles at ~60% CPU
  minServers: 6, // 3 per region × 2 regions, even at night
  writesPerShard: 3000, // comfortable sustained writes/second per PostgreSQL primary
};

export function capacity(perHour: number) {
  const avg = perHour / 3600;
  const peak = avg * MODEL.peakFactor;
  const api = peak * (1 - MODEL.edgeShare);
  const servers = Math.max(MODEL.minServers, Math.ceil(api / MODEL.perServer / 2) * 2);
  const writes = api * MODEL.writeShare;
  const shards = Math.max(2, Math.ceil(writes / MODEL.writesPerShard));
  return { avg, peak, edge: peak * MODEL.edgeShare, api, servers, writes, shards };
}

// Slider runs on a log scale: 1 lakh → 5 crore requests an hour.
const MIN = Math.log10(1e5);
const MAX = Math.log10(5e7);
const DEFAULT = 30e5;

const LAYERS: { key: string; icon: Icon; tone: string }[] = [
  { key: "people", icon: DeviceMobile, tone: "bg-saffron-50 text-saffron-700" },
  { key: "edge", icon: Globe, tone: "bg-navy-50 text-navy-600" },
  { key: "gateway", icon: ShieldCheck, tone: "bg-navy-50 text-navy-600" },
  { key: "services", icon: Cpu, tone: "bg-navy-50 text-navy-600" },
  { key: "queue", icon: Queue, tone: "bg-green-50 text-green-600" },
  { key: "data", icon: Database, tone: "bg-green-50 text-green-600" },
  { key: "rails", icon: Plugs, tone: "bg-saffron-50 text-saffron-700" },
];

export function Scale() {
  const t = useTranslations("site.scale");
  const { locale } = useLocaleSwitch();
  const sliderId = useId();
  const [perHour, setPerHour] = useState(DEFAULT);
  const c = useMemo(() => capacity(perHour), [perHour]);
  const moves = t.raw("moves") as { title: string; body: string }[];
  const services = t.raw("services") as string[];

  // Indian digit grouping (30,00,000) for every language, with the locale's own digits where it has them.
  const nf = (n: number) => {
    try {
      return new Intl.NumberFormat(`${locale}-IN`, { maximumFractionDigits: 0 }).format(Math.round(n));
    } catch {
      return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
    }
  };

  const stats = [
    { key: "peak", value: nf(c.peak), tone: "text-ink" },
    { key: "edge", value: nf(c.edge), tone: "text-navy-600" },
    { key: "api", value: nf(c.api), tone: "text-ink" },
    { key: "servers", value: nf(c.servers), tone: "text-green-600" },
    { key: "writes", value: nf(c.writes), tone: "text-ink" },
    { key: "shards", value: nf(c.shards), tone: "text-green-600" },
  ];

  return (
    <section id="scale" className="scroll-mt-20 bg-surface/60 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-page">
        <div className="max-w-3xl">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-navy-600">{t("eyebrow")}</p>
          <TextReveal as="h2" text={t("title")} className="mt-4 text-h1 text-ink" />
          <Reveal>
            <p className="mt-6 text-[20px] leading-relaxed text-ink-2">{t("intro")}</p>
          </Reveal>
        </div>

        {/* Load calculator */}
        <Reveal>
          <div className="mt-14 rounded-[28px] bg-white p-6 shadow-[0_40px_90px_-50px_rgba(10,28,84,0.45)] ring-1 ring-line sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <label htmlFor={sliderId} className="text-[15px] font-semibold text-ink">
                {t("calc.label")}
              </label>
              <p className="text-[34px] font-semibold leading-none tracking-[-0.02em] text-ink sm:text-[40px]">
                {nf(perHour)}
                <span className="ml-2 text-[15px] font-medium tracking-normal text-ink-3">{t("calc.perHour")}</span>
              </p>
            </div>
            <input
              id={sliderId}
              type="range"
              min={MIN}
              max={MAX}
              step={0.001}
              value={Math.log10(perHour)}
              onChange={(e) => {
                const raw = 10 ** Number(e.target.value);
                const mag = 10 ** Math.floor(Math.log10(raw));
                setPerHour(Math.round(raw / (mag / 10)) * (mag / 10));
              }}
              aria-valuetext={`${nf(perHour)} ${t("calc.perHour")}`}
              className="mt-6 h-2 w-full cursor-pointer accent-navy-600"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {[1e5, 10e5, 30e5, 1e7, 5e7].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPerHour(v)}
                  aria-pressed={perHour === v}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[13px] font-semibold ring-1 ring-inset transition-colors",
                    perHour === v ? "bg-navy-600 text-white ring-navy-600" : "bg-white text-ink-2 ring-line hover:bg-surface",
                  )}
                >
                  {nf(v)}
                </button>
              ))}
            </div>

            <div className="mt-10 border-t border-line pt-8">
              <ScaleFlow speed={(Math.log10(perHour) - MIN) / (MAX - MIN)} counters={c.servers} peopleLabel={nf(perHour)} />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[18px] bg-line ring-1 ring-line md:grid-cols-3" aria-live="polite">
              {stats.map((s) => (
                <div key={s.key} className="bg-white p-4 sm:p-5">
                  <dt className="text-[13px] font-medium text-ink-3">{t(`calc.${s.key}`)}</dt>
                  <dd className={cn("mt-1.5 text-[26px] font-semibold tabular-nums tracking-[-0.02em] sm:text-[30px]", s.tone)}>{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[13.5px] leading-relaxed text-ink-3">{t("calc.assumptions")}</p>
          </div>
        </Reveal>

        {/* One request, step by step */}
        <RequestJourney />

        {/* The worst day, in plain words */}
        <div className="mt-20">
          <h3 className="text-[26px] font-semibold tracking-[-0.015em] text-ink">{t("movesTitle")}</h3>
          <ul className="mt-8 grid gap-x-12 gap-y-7 md:grid-cols-2">
            {moves.map((m, i) => (
              <Reveal as="li" key={m.title} delay={(i % 2) * 0.05} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-600 text-[14px] font-semibold text-white tabular-nums">{i + 1}</span>
                <div>
                  <p className="text-[17px] font-semibold text-ink">{m.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-2">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <div className="mt-10 flex gap-3 rounded-[18px] bg-saffron-50 p-4 ring-1 ring-inset ring-saffron-100">
              <Buildings size={20} weight="duotone" className="mt-0.5 shrink-0 text-saffron-700" />
              <p className="text-[14px] leading-relaxed text-ink-2">{t("honest")}</p>
            </div>
          </Reveal>
        </div>

        {/* For engineers: the same story in system terms */}
        <details className="group mt-12 rounded-[22px] bg-white ring-1 ring-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block text-[18px] font-semibold text-ink">{t("arch.title")}</span>
              <span className="mt-0.5 block text-[14.5px] text-ink-3">{t("arch.intro")}</span>
            </span>
            <CaretDown size={20} weight="bold" className="shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <ol className="px-5 pb-6 sm:px-6">
            {LAYERS.map((l, i) => (
              <li key={l.key}>
                <div className="flex gap-4 rounded-[18px] bg-surface/60 p-4 ring-1 ring-line">
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]", l.tone)}>
                    <l.icon size={22} weight="duotone" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[16.5px] font-semibold text-ink">{t(`arch.layers.${l.key}.title`)}</p>
                    <p className="mt-0.5 text-[14.5px] leading-relaxed text-ink-2">{t(`arch.layers.${l.key}.body`)}</p>
                    {l.key === "services" && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {services.map((sv) => (
                          <li key={sv} className="rounded-full bg-white px-2.5 py-1 text-[12.5px] font-medium text-ink-2 ring-1 ring-inset ring-line">
                            {sv}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {i < LAYERS.length - 1 && (
                  <div aria-hidden className="flex justify-center py-1.5 text-ink-4">
                    <ArrowDown size={16} weight="bold" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </details>
      </div>
    </section>
  );
}
