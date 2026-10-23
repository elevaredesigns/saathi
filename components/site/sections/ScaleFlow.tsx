"use client";

import { Buildings, DeviceMobile, Door, HardDrives, Ticket, Lightning, type Icon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

/*
 * The scale story told as a festival-day railway station, for people who don't
 * build software: dots are requests. Most turn back at the "nearby copy" (cache)
 * answered; a thin stream goes on through a fair gate, counters that open more
 * windows by themselves (autoscaling servers) and a token line (queue) to the
 * government systems. Dot speed follows the calculator above it.
 */

type NodeKey = "people" | "nearby" | "gate" | "counters" | "token" | "govt";
const NODES: { key: NodeKey; icon: Icon; tone: string }[] = [
  { key: "people", icon: DeviceMobile, tone: "bg-saffron-50 text-saffron-700 ring-saffron-100" },
  { key: "nearby", icon: Lightning, tone: "bg-green-50 text-green-600 ring-green-100" },
  { key: "gate", icon: Door, tone: "bg-navy-50 text-navy-600 ring-navy-100" },
  { key: "counters", icon: HardDrives, tone: "bg-navy-50 text-navy-600 ring-navy-100" },
  { key: "token", icon: Ticket, tone: "bg-navy-50 text-navy-600 ring-navy-100" },
  { key: "govt", icon: Buildings, tone: "bg-saffron-50 text-saffron-700 ring-saffron-100" },
];

// Desktop: a left-to-right line in a 1000×300 box.
const H = { w: 1000, h: 300, y: 190, xs: [70, 250, 420, 590, 760, 930] };
// Phone: a top-to-bottom line in a 340×960 box, icons on the line at x=40.
const V = { w: 340, h: 960, x: 40, ys: [40, 210, 380, 550, 720, 890] };

const seg = (a: number, b: number, horizontal: boolean) =>
  horizontal ? `M${H.xs[a] + 30} ${H.y} L${H.xs[b] - 30} ${H.y}` : `M${V.x} ${V.ys[a] + 30} L${V.x} ${V.ys[b] - 30}`;
// The return trip: answered requests loop back to people.
const back = (horizontal: boolean) =>
  horizontal
    ? `M${H.xs[1]} ${H.y - 32} C ${H.xs[1] - 20} ${H.y - 150}, ${H.xs[0] + 20} ${H.y - 150}, ${H.xs[0]} ${H.y - 32}`
    : `M${V.x - 28} ${V.ys[1]} C ${V.x - 40} ${V.ys[1] - 60}, ${V.x - 40} ${V.ys[0] + 60}, ${V.x - 28} ${V.ys[0]}`;

function Dots({ d, n, dur, color, r = 4, delay = 0 }: { d: string; n: number; dur: number; color: string; r?: number; delay?: number }) {
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

export function ScaleFlow({ speed, counters, peopleLabel }: { speed: number; counters: number; peopleLabel: string }) {
  const t = useTranslations("site.scale.flow");
  const reduce = useReducedMotion();
  // speed: 0 (1 lakh/hour) → 1 (5 crore/hour). Busier hour = faster, denser dots.
  const busy = Math.round(4 + speed * 8);
  const dur = 2.6 - speed * 1.4;
  const lit = Math.min(8, Math.max(2, Math.round(Math.log2(counters) * 1.6)));

  const lines = (horizontal: boolean) => (
    <svg viewBox={horizontal ? `0 0 ${H.w} ${H.h}` : `0 0 ${V.w} ${V.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      {/* rails */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.path
          key={i}
          d={seg(i, i + 1, horizontal)}
          fill="none"
          stroke={i === 0 ? "#F2C48D" : "#B9C8F0"}
          strokeWidth={i === 0 ? 3 : 1.75}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: ease.inOut, delay: 0.15 + i * 0.15 }}
        />
      ))}
      <motion.path
        d={back(horizontal)}
        fill="none"
        stroke="#9ED9B4"
        strokeWidth={2.5}
        strokeDasharray="2 7"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: ease.inOut, delay: 0.5 }}
      />
      {!reduce && (
        <g key={`${busy}-${dur.toFixed(2)}`}>
          {/* a crowd heads for the nearby copy… */}
          <Dots d={seg(0, 1, horizontal)} n={busy} dur={dur} color="#E8892B" r={4.5} delay={0.8} />
          {/* …most are answered there and go straight back */}
          <Dots d={back(horizontal)} n={Math.max(3, busy - 2)} dur={dur * 1.3} color="#1E9E5A" r={4} delay={1.6} />
          {/* only a thin stream travels on */}
          <Dots d={seg(1, 2, horizontal)} n={2} dur={dur * 1.1} color="#1F43B8" delay={1.4} />
          <Dots d={seg(2, 3, horizontal)} n={2} dur={dur * 1.1} color="#1F43B8" delay={1.9} />
          <Dots d={seg(3, 4, horizontal)} n={2} dur={dur * 1.1} color="#1F43B8" delay={2.4} />
          {/* the token line releases work at the pace offices can take */}
          <Dots d={seg(4, 5, horizontal)} n={1} dur={dur * 1.8} color="#1F43B8" delay={2.9} />
        </g>
      )}
    </svg>
  );

  const card = (k: NodeKey) => (
    <>
      <p className="text-[15px] font-semibold leading-snug text-ink">{t(`${k}.title`)}</p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{k === "people" ? `${peopleLabel} · ${t("people.body")}` : t(`${k}.body`)}</p>
    </>
  );

  const icon = (n: (typeof NODES)[number], i: number) => (
    <motion.span
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.25, delay: 0.1 + i * 0.15 }}
      className={cn("relative flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_14px_30px_-16px_rgba(10,28,84,0.45)] ring-1", n.tone)}
    >
      <n.icon size={28} weight="duotone" />
      {n.key === "counters" && (
        // windows that light up as the crowd grows
        <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-[3px] rounded-full bg-white px-1.5 py-1 ring-1 ring-line">
          {Array.from({ length: 8 }, (_, w) => (
            <span key={w} className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300", w < lit ? "bg-green-600" : "bg-line-strong")} />
          ))}
        </span>
      )}
    </motion.span>
  );

  return (
    <figure aria-label={t("aria")}>
      {/* Desktop */}
      <div className="relative hidden lg:block" style={{ aspectRatio: `${H.w} / ${H.h + 70}` }}>
        <div className="absolute inset-x-0 top-0" style={{ aspectRatio: `${H.w} / ${H.h}` }}>
          {lines(true)}
          {/* answered-instantly tag on the return loop */}
          <span className="absolute -translate-x-1/2 rounded-full bg-green-50 px-3 py-1 text-[13px] font-semibold text-green-800 ring-1 ring-inset ring-green-100" style={{ left: `${((H.xs[0] + H.xs[1]) / 2 / H.w) * 100}%`, top: `${((H.y - 160) / H.h) * 100}%` }}>
            {t("answered")}
          </span>
          <span className="absolute -translate-x-1/2 whitespace-nowrap text-[12.5px] font-semibold text-navy-600" style={{ left: `${((H.xs[1] + H.xs[2]) / 2 / H.w) * 100}%`, top: `${((H.y - 34) / H.h) * 100}%` }}>
            {t("onward")}
          </span>
          {NODES.map((n, i) => (
            <div key={n.key} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(H.xs[i] / H.w) * 100}%`, top: `${(H.y / H.h) * 100}%` }}>
              {icon(n, i)}
            </div>
          ))}
        </div>
        <ol className="absolute inset-x-0 bottom-0 grid grid-cols-6 gap-3" style={{ top: `${((H.y + 44) / (H.h + 70)) * 100}%` }}>
          {NODES.map((n) => (
            <li key={n.key} className="text-center">
              {card(n.key)}
            </li>
          ))}
        </ol>
      </div>

      {/* Phone and tablet: top to bottom */}
      <div className="relative mx-auto max-w-[460px] lg:hidden" style={{ aspectRatio: `${V.w} / ${V.h}` }}>
        {lines(false)}
        {NODES.map((n, i) => (
          <div key={n.key} className="absolute flex items-start gap-4" style={{ left: `${((V.x - 30) / V.w) * 100}%`, right: 0, top: `${((V.ys[i] - 30) / V.h) * 100}%` }}>
            {icon(n, i)}
            <div className="min-w-0 pt-1.5">{card(n.key)}</div>
          </div>
        ))}
        <span className="absolute rounded-full bg-green-50 px-2.5 py-0.5 text-[12px] font-semibold text-green-800 ring-1 ring-inset ring-green-100" style={{ left: `${((V.x + 40) / V.w) * 100}%`, top: `${((V.ys[0] + V.ys[1]) / 2 / V.h) * 100}%` }}>
          {t("answered")}
        </span>
      </div>
      <figcaption className="mt-6 text-center text-[13.5px] text-ink-3">{t("legend")}</figcaption>
    </figure>
  );
}
