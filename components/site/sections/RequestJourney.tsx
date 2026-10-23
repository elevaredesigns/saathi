"use client";

import { Bank, Buildings, DeviceMobile, Door, HardDrives, Lightning, Pause, Play, Ticket, Warning, type Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

/*
 * "Follow one request": the same stops as the diagram above, but for one action at
 * a time — what happens at each stop, how long it takes, and what happens if that
 * stop has a problem. Steps play on their own; any step can be tapped.
 */

type Stop = "phone" | "nearby" | "gate" | "counter" | "bank" | "token" | "office";
const STOPS: Record<Stop, { icon: Icon; tone: string }> = {
  phone: { icon: DeviceMobile, tone: "bg-saffron-50 text-saffron-700 ring-saffron-100" },
  nearby: { icon: Lightning, tone: "bg-green-50 text-green-600 ring-green-100" },
  gate: { icon: Door, tone: "bg-navy-50 text-navy-600 ring-navy-100" },
  counter: { icon: HardDrives, tone: "bg-navy-50 text-navy-600 ring-navy-100" },
  bank: { icon: Bank, tone: "bg-saffron-50 text-saffron-700 ring-saffron-100" },
  token: { icon: Ticket, tone: "bg-navy-50 text-navy-600 ring-navy-100" },
  office: { icon: Buildings, tone: "bg-saffron-50 text-saffron-700 ring-saffron-100" },
};

interface Step {
  stop: Stop;
  title: string;
  body: string;
  time: string;
  fail?: string;
}
interface Kind {
  key: string;
  label: string;
  total: string;
  summary: string;
  steps: Step[];
}

const STEP_MS = 2600;

export function RequestJourney() {
  const t = useTranslations("site.scale.journey");
  const reduce = useReducedMotion();
  const kinds = t.raw("kinds") as Kind[];
  const [k, setK] = useState(2); // start on "submitting an application" — the one judges ask about
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const kind = kinds[k];
  const step = kind.steps[i];

  // Only start playing once the block is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !seen) return;
    const id = window.setTimeout(() => {
      if (i < kind.steps.length - 1) setI(i + 1);
      else setPlaying(false);
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, seen, i, kind.steps.length]);

  const pick = (n: number) => {
    setK(n);
    setI(0);
    setPlaying(!reduce);
  };
  const toggle = () => {
    if (playing) setPlaying(false);
    else {
      if (i === kind.steps.length - 1) setI(0);
      setPlaying(true);
    }
  };
  const progress = kind.steps.length > 1 ? i / (kind.steps.length - 1) : 1;

  return (
    <div ref={ref} className="mt-20">
      <h3 className="text-[26px] font-semibold tracking-[-0.015em] text-ink">{t("title")}</h3>
      <p className="mt-3 max-w-2xl text-[16.5px] leading-relaxed text-ink-2">{t("intro")}</p>

      {/* what kind of request */}
      <div role="tablist" aria-label={t("title")} className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {kinds.map((kd, n) => (
          <button
            key={kd.key}
            role="tab"
            type="button"
            aria-selected={n === k}
            onClick={() => pick(n)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold ring-1 ring-inset transition-colors",
              n === k ? "bg-ink text-white ring-ink" : "bg-white text-ink-2 ring-line hover:bg-surface",
            )}
          >
            {kd.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] bg-white shadow-[0_40px_90px_-50px_rgba(10,28,84,0.45)] ring-1 ring-line">
        {/* the route, with a dot travelling it */}
        <div className="border-b border-line px-5 pb-6 pt-7 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <p className="max-w-xl text-[15px] leading-relaxed text-ink-2">{kind.summary}</p>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden rounded-full bg-green-50 px-3 py-1 text-[13px] font-semibold text-green-800 ring-1 ring-inset ring-green-100 sm:inline">
                {t("total")} {kind.total}
              </span>
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? t("pause") : t("play")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-600 text-white transition-transform active:scale-95"
              >
                {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
              </button>
            </div>
          </div>

          <div className="relative mt-8 px-[17px] sm:px-[22px]">
            <div className="absolute inset-x-[17px] top-[17px] h-[3px] rounded-full bg-line sm:inset-x-[22px] sm:top-[22px]" />
            <div
              className="absolute left-[17px] top-[17px] h-[3px] w-[calc((100%-34px)*var(--p))] rounded-full bg-navy-600 transition-[width] duration-500 ease-in-out sm:left-[22px] sm:top-[22px] sm:w-[calc((100%-44px)*var(--p))]"
              style={{ ["--p" as string]: progress }}
            />
            <ol className="relative flex justify-between">
              {kind.steps.map((s, n) => {
                const S = STOPS[s.stop];
                const done = n <= i;
                return (
                  <li key={`${kind.key}-${n}`} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setI(n);
                        setPlaying(false);
                      }}
                      aria-label={s.title}
                      aria-current={n === i ? "step" : undefined}
                      className={cn(
                        "relative -mx-[17px] flex h-[34px] w-[34px] items-center sm:-mx-[22px] sm:h-11 sm:w-11 justify-center rounded-full bg-white ring-1 transition-[transform,box-shadow] duration-300",
                        done ? S.tone : "text-ink-4 ring-line",
                        n === i && "scale-110 shadow-[0_10px_24px_-10px_rgba(31,67,184,0.6)]",
                      )}
                    >
                      <S.icon className="h-[17px] w-[17px] sm:h-[21px] sm:w-[21px]" weight={done ? "duotone" : "regular"} />
                      {n === i && !reduce && <span className="absolute inset-0 animate-ping rounded-full ring-2 ring-navy-600/30" />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* what happens at this stop */}
        <div className="grid lg:grid-cols-[1fr_1.15fr]">
          <div className="border-b border-line p-5 sm:p-8 lg:border-b-0 lg:border-r">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${kind.key}-${i}`}
                initial={{ opacity: 0, transform: "translateY(8px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: ease.out }}
                aria-live="polite"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                  {t("step", { n: i + 1, total: kind.steps.length })} · <span className="normal-case tracking-normal text-navy-600">{step.time}</span>
                </p>
                <p className="mt-3 text-[22px] font-semibold leading-snug tracking-[-0.01em] text-ink">{step.title}</p>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{step.body}</p>
                {step.fail && (
                  <div className="mt-5 flex gap-3 rounded-[16px] bg-saffron-50 p-4 ring-1 ring-inset ring-saffron-100">
                    <Warning size={20} weight="duotone" className="mt-0.5 shrink-0 text-saffron-700" />
                    <p className="text-[14.5px] leading-relaxed text-ink-2">
                      <span className="font-semibold text-ink">{t("ifFails")} </span>
                      {step.fail}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* all steps at a glance */}
          <ol className="p-3 sm:p-5">
            {kind.steps.map((s, n) => {
              const S = STOPS[s.stop];
              return (
                <li key={`${kind.key}-row-${n}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setI(n);
                      setPlaying(false);
                    }}
                    className={cn("flex w-full items-start gap-3 rounded-[14px] p-3 text-left transition-colors", n === i ? "bg-navy-50" : "hover:bg-surface")}
                  >
                    <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1", n <= i ? S.tone : "bg-white text-ink-4 ring-line")}>
                      <S.icon size={16} weight="duotone" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block text-[14.5px] font-semibold", n === i ? "text-navy-700" : "text-ink")}>{s.title}</span>
                    </span>
                    <span className="shrink-0 pt-0.5 text-[12.5px] font-medium tabular-nums text-ink-3">{s.time}</span>
                  </button>
                </li>
              );
            })}
            <li className="mt-2 flex items-center justify-between rounded-[14px] bg-green-50 px-4 py-3 sm:hidden">
              <span className="text-[13.5px] font-semibold text-green-800">{t("total")}</span>
              <span className="text-[13.5px] font-semibold text-green-800">{kind.total}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
