"use client";

import {
  Broadcast,
  Car,
  Certificate,
  Database,
  DeviceMobile,
  Exam,
  FirstAidKit,
  Fingerprint,
  Receipt,
  ShieldCheck,
  Signpost,
  Tractor,
  type Icon,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { useLocaleSwitch } from "@/components/providers/I18nProvider";
import { SaathiMark } from "@/components/system/brand/SaathiMark";
import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { cn } from "@/lib/utils";

/*
 * "One front door, a separate back room for every service." The citizen sees one
 * app; behind a router each service runs on its own servers with its own data, so
 * an exam-result rush grows the Exams lane alone and never slows a birth
 * certificate. The numbers are a stated model, not measurements.
 */

type Lane = "certs" | "land" | "tax" | "transport" | "exams" | "health";
const LANES: { key: Lane; icon: Icon }[] = [
  { key: "certs", icon: Certificate },
  { key: "land", icon: Tractor },
  { key: "tax", icon: Receipt },
  { key: "transport", icon: Car },
  { key: "exams", icon: Exam },
  { key: "health", icon: FirstAidKit },
];

type Scenario = "normal" | "exams" | "kisan" | "tax";
const SHARES: Record<Scenario, Record<Lane, number>> = {
  normal: { certs: 0.2, land: 0.15, tax: 0.2, transport: 0.2, exams: 0.1, health: 0.15 },
  exams: { certs: 0.06, land: 0.06, tax: 0.06, transport: 0.06, exams: 0.7, health: 0.06 },
  kisan: { certs: 0.07, land: 0.65, tax: 0.07, transport: 0.07, exams: 0.07, health: 0.07 },
  tax: { certs: 0.08, land: 0.08, tax: 0.6, transport: 0.08, exams: 0.08, health: 0.08 },
};
const SCENARIOS: Scenario[] = ["exams", "kisan", "tax", "normal"];

export const SPLIT_MODEL = {
  peopleAtOnce: 30e5, // people with Saathi open at the same moment
  secondsBetweenTaps: 20, // an active person makes about one request every 20 seconds
  edgeShare: 0.85, // answered from the phone / nearby copy, never reaching a lane
  perServer: 250, // requests a second one server handles comfortably
  minPerLane: 4, // every lane keeps 2 servers in each of 2 regions
};

export function splitLoad(scenario: Scenario) {
  const total = SPLIT_MODEL.peopleAtOnce / SPLIT_MODEL.secondsBetweenTaps;
  const routed = total * (1 - SPLIT_MODEL.edgeShare);
  const lanes = LANES.map((l) => {
    const rps = routed * SHARES[scenario][l.key];
    return { ...l, share: SHARES[scenario][l.key], rps, servers: Math.max(SPLIT_MODEL.minPerLane, Math.ceil(rps / SPLIT_MODEL.perServer)) };
  });
  return { total, routed, lanes };
}

// Desktop diagram geometry, in a 1000×540 box.
const G = { w: 1000, h: 540, app: { x: 90, y: 270 }, router: { x: 300, y: 270 }, laneX: 470, laneW: 330, laneY: (i: number) => 55 + i * 86, dept: 930 };
const toLane = (i: number) => `M${G.router.x + 42} ${G.router.y} C ${G.router.x + 110} ${G.router.y}, ${G.laneX - 70} ${G.laneY(i)}, ${G.laneX - 4} ${G.laneY(i)}`;
const fromLane = (i: number) => `M${G.laneX + G.laneW + 4} ${G.laneY(i)} L${G.dept - 34} ${G.laneY(i)}`;
const appToRouter = `M${G.app.x + 52} ${G.app.y} L${G.router.x - 42} ${G.router.y}`;

function Dots({ d, n, dur, color, delay = 0, r = 4 }: { d: string; n: number; dur: number; color: string; delay?: number; r?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} r={r} fill={color}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} begin={`${delay + (i * dur) / n}s`} />
        </circle>
      ))}
    </>
  );
}

export function ServiceSplit() {
  const t = useTranslations("site.split");
  const { locale } = useLocaleSwitch();
  const reduce = useReducedMotion();
  const [scenario, setScenario] = useState<Scenario>("exams");
  const load = useMemo(() => splitLoad(scenario), [scenario]);
  const busiest = load.lanes.reduce((a, b) => (b.rps > a.rps ? b : a));
  const shared = t.raw("shared.items") as { title: string; body: string }[];
  const data = t.raw("data.items") as { title: string; body: string }[];

  const nf = (n: number) => {
    try {
      return new Intl.NumberFormat(`${locale}-IN`, { maximumFractionDigits: 0 }).format(Math.round(n));
    } catch {
      return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
    }
  };

  const pips = (servers: number, hot: boolean) => (
    <span className="flex flex-wrap gap-[3px]" aria-hidden>
      {Array.from({ length: Math.min(servers, 24) }, (_, i) => (
        <motion.span
          key={i}
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: reduce ? 0 : i * 0.015 }}
          className={cn("h-[7px] w-[7px] rounded-[2px]", hot ? "bg-saffron-500" : "bg-green-600")}
        />
      ))}
      {servers > 24 && <span className={cn("ml-0.5 text-[11px] font-bold leading-[7px]", hot ? "text-saffron-700" : "text-green-800")}>+{servers - 24}</span>}
    </span>
  );

  return (
    <section id="split" className="scroll-mt-20 px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-page">
        <div className="max-w-3xl">
          <p className="text-caption font-semibold uppercase tracking-[0.14em] text-navy-600">{t("eyebrow")}</p>
          <TextReveal as="h2" text={t("title")} className="mt-4 text-h1 text-ink" />
          <Reveal>
            <p className="mt-6 text-[20px] leading-relaxed text-ink-2">{t("intro")}</p>
          </Reveal>
        </div>

        {/* the 30 lakh arithmetic, in one line */}
        <Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[22px] bg-line ring-1 ring-line sm:grid-cols-3">
            {[
              { v: nf(SPLIT_MODEL.peopleAtOnce), l: t("math.people") },
              { v: nf(load.total), l: t("math.requests", { s: SPLIT_MODEL.secondsBetweenTaps }) },
              { v: nf(load.routed), l: t("math.routed") },
            ].map((m, i) => (
              <div key={i} className="bg-white p-5">
                <p className="text-[30px] font-semibold tabular-nums tracking-[-0.02em] text-ink">{m.v}</p>
                <p className="mt-1 text-[14px] leading-snug text-ink-2">{m.l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* the day */}
        <div className="mt-12 flex flex-wrap items-center gap-2" role="radiogroup" aria-label={t("pickDay")}>
          <span className="mr-2 text-[15px] font-semibold text-ink">{t("pickDay")}</span>
          {SCENARIOS.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={scenario === s}
              onClick={() => setScenario(s)}
              className={cn(
                "rounded-full px-4 py-2 text-[14px] font-semibold ring-1 ring-inset transition-colors",
                scenario === s ? "bg-ink text-white ring-ink" : "bg-white text-ink-2 ring-line hover:bg-surface",
              )}
            >
              {t(`days.${s}`)}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[28px] bg-white p-5 shadow-[0_40px_90px_-50px_rgba(10,28,84,0.45)] ring-1 ring-line sm:p-8">
          {/* Desktop diagram */}
          <figure aria-label={t("aria")} className="relative hidden lg:block" style={{ aspectRatio: `${G.w} / ${G.h}` }}>
            <svg viewBox={`0 0 ${G.w} ${G.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <path d={appToRouter} fill="none" stroke="#F2C48D" strokeWidth={4} strokeLinecap="round" />
              {load.lanes.map((l, i) => (
                <g key={l.key}>
                  <path d={toLane(i)} fill="none" stroke={l.key === busiest.key ? "#F2C48D" : "#C9D5F5"} strokeWidth={1.5 + l.share * 7} strokeLinecap="round" style={{ transition: "stroke-width 400ms, stroke 400ms" }} />
                  <path d={fromLane(i)} fill="none" stroke="#C9D5F5" strokeWidth={1.75} strokeDasharray="3 6" strokeLinecap="round" />
                </g>
              ))}
              {!reduce && (
                <g key={scenario}>
                  <Dots d={appToRouter} n={9} dur={1.4} color="#E8892B" r={4.5} />
                  {load.lanes.map((l, i) => (
                    <g key={l.key}>
                      <Dots d={toLane(i)} n={1 + Math.round(l.share * 12)} dur={1.6} color={l.key === busiest.key ? "#E8892B" : "#1F43B8"} delay={0.6 + i * 0.07} />
                      <Dots d={fromLane(i)} n={1} dur={1.8} color="#1F43B8" delay={1.4 + i * 0.1} r={3} />
                    </g>
                  ))}
                </g>
              )}
            </svg>

            {/* unified front end */}
            <div className="absolute flex w-[150px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center" style={{ left: `${(G.app.x / G.w) * 100}%`, top: `${(G.app.y / G.h) * 100}%` }}>
              <span className="flex h-[96px] w-[96px] items-center justify-center rounded-[26px] bg-white shadow-[0_24px_50px_-24px_rgba(31,67,184,0.55)] ring-1 ring-line">
                <SaathiMark size={48} />
              </span>
              <p className="mt-3 text-[15px] font-semibold text-ink">{t("app.title")}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">{t("app.body")}</p>
            </div>

            {/* router */}
            <div className="absolute flex w-[150px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center" style={{ left: `${(G.router.x / G.w) * 100}%`, top: `${(G.router.y / G.h) * 100}%` }}>
              <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-navy-600 text-white shadow-[0_20px_40px_-18px_rgba(31,67,184,0.7)]">
                <Signpost size={34} weight="duotone" />
              </span>
              <p className="mt-3 text-[15px] font-semibold text-ink">{t("router.title")}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">{t("router.body")}</p>
            </div>

            {/* one lane per service */}
            {load.lanes.map((l, i) => {
              const hot = l.key === busiest.key && scenario !== "normal";
              return (
                <div
                  key={l.key}
                  className={cn(
                    "absolute flex -translate-y-1/2 items-center gap-3 rounded-[16px] px-3 py-2.5 ring-1 transition-[background-color,box-shadow] duration-500",
                    hot ? "bg-saffron-50 shadow-[0_16px_36px_-20px_rgba(232,137,43,0.8)] ring-saffron-100" : "bg-white ring-line",
                  )}
                  style={{ left: `${(G.laneX / G.w) * 100}%`, width: `${(G.laneW / G.w) * 100}%`, top: `${(G.laneY(i) / G.h) * 100}%` }}
                >
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]", hot ? "bg-white text-saffron-700" : "bg-navy-50 text-navy-600")}>
                    <l.icon size={21} weight="duotone" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[14px] font-semibold text-ink">{t(`lanes.${l.key}`)}</span>
                      <span className={cn("shrink-0 text-[12px] font-semibold tabular-nums", hot ? "text-saffron-700" : "text-ink-3")}>{t("perSec", { n: nf(l.rps) })}</span>
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      {pips(l.servers, hot)}
                      <span className="ml-auto shrink-0 text-[11.5px] font-medium tabular-nums text-ink-3">{t("servers", { n: l.servers })}</span>
                    </div>
                  </div>
                  <Database size={18} weight="duotone" className="shrink-0 text-green-600" aria-label={t("ownData")} />
                </div>
              );
            })}

            {/* department systems */}
            <div className="absolute flex w-[110px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center" style={{ left: `${(G.dept / G.w) * 100}%`, top: "50%" }}>
              <p className="text-[13.5px] font-semibold leading-snug text-ink">{t("dept.title")}</p>
              <p className="mt-1 text-[12px] leading-snug text-ink-3">{t("dept.body")}</p>
            </div>
          </figure>

          {/* Phone and tablet: top to bottom */}
          <div className="lg:hidden">
            <div className="flex items-center gap-3 rounded-[16px] bg-surface p-3">
              <SaathiMark size={30} />
              <div>
                <p className="text-[14.5px] font-semibold text-ink">{t("app.title")}</p>
                <p className="text-[12.5px] text-ink-3">{t("app.body")}</p>
              </div>
            </div>
            <div className="ml-7 h-5 w-[3px] bg-saffron-300" aria-hidden />
            <div className="flex items-center gap-3 rounded-[16px] bg-navy-600 p-3 text-white">
              <Signpost size={26} weight="duotone" />
              <div>
                <p className="text-[14.5px] font-semibold">{t("router.title")}</p>
                <p className="text-[12.5px] text-white/80">{t("router.body")}</p>
              </div>
            </div>
            <ul className="ml-3 mt-2 space-y-2 border-l-[3px] border-navy-100 pl-4">
              {load.lanes.map((l) => {
                const hot = l.key === busiest.key && scenario !== "normal";
                return (
                  <li key={l.key} className={cn("rounded-[14px] p-3 ring-1 transition-colors duration-500", hot ? "bg-saffron-50 ring-saffron-100" : "bg-white ring-line")}>
                    <p className="flex items-center gap-2">
                      <l.icon size={18} weight="duotone" className={hot ? "text-saffron-700" : "text-navy-600"} />
                      <span className="flex-1 text-[14px] font-semibold text-ink">{t(`lanes.${l.key}`)}</span>
                      <span className={cn("text-[12px] font-semibold tabular-nums", hot ? "text-saffron-700" : "text-ink-3")}>{t("perSec", { n: nf(l.rps) })}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {pips(l.servers, hot)}
                      <span className="ml-auto shrink-0 text-[11.5px] font-medium tabular-nums text-ink-3">{t("servers", { n: l.servers })}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-center text-[13px] font-semibold text-ink-2">↓ {t("dept.title")}</p>
          </div>

          <p className="mt-6 border-t border-line pt-5 text-[15px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">{t(`verdict.${scenario}`, { lane: t(`lanes.${busiest.key}`), n: busiest.servers })}</span>{" "}
            {t("verdictTail")}
          </p>
        </div>

        {/* shared once, used by every lane */}
        <div className="mt-16">
          <h3 className="text-[24px] font-semibold tracking-[-0.015em] text-ink">{t("shared.title")}</h3>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-ink-2">{t("shared.intro")}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {shared.map((s, i) => {
              const Glyph = [Fingerprint, ShieldCheck, Broadcast, DeviceMobile][i];
              return (
                <Reveal as="li" key={s.title} delay={i * 0.05} className="rounded-[18px] bg-white p-4 ring-1 ring-line">
                  <Glyph size={22} weight="duotone" className="text-navy-600" />
                  <p className="mt-3 text-[15.5px] font-semibold text-ink">{s.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{s.body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>

        {/* data architecture */}
        <div className="mt-16">
          <h3 className="text-[24px] font-semibold tracking-[-0.015em] text-ink">{t("data.title")}</h3>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-ink-2">{t("data.intro")}</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {data.map((d, i) => (
              <Reveal as="li" key={d.title} delay={(i % 2) * 0.05} className="flex gap-4 rounded-[18px] bg-surface/70 p-5 ring-1 ring-line">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-[14px] font-semibold text-white">{i + 1}</span>
                <div>
                  <p className="text-[16px] font-semibold text-ink">{d.title}</p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="mt-8 text-[13.5px] leading-relaxed text-ink-3">{t("model")}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

