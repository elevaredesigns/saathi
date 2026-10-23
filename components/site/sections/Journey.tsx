"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { ScrollScene } from "@/components/system/motion/ScrollScene";
import { cn } from "@/lib/utils";

interface Milestone {
  year: string;
  title: string;
  body: string;
  target?: boolean;
}

function Card({ m, targetLabel }: { m: Milestone; targetLabel: string }) {
  return (
    <article className="flex w-[min(78vw,360px)] shrink-0 flex-col">
      <p className={cn("text-[clamp(64px,8vw,120px)] font-semibold leading-none tracking-[-0.05em] tabular-nums", m.target ? "text-navy-200" : "text-ink")}>{m.year}</p>
      <div className="mt-6 h-[2px] w-full bg-line">
        <div className={cn("h-full w-12", m.target ? "bg-navy-200" : "bg-navy-600")} />
      </div>
      <p className="mt-5 text-[22px] font-semibold tracking-[-0.015em] text-ink">{m.title}</p>
      <p className="mt-2 max-w-[30ch] text-[16px] leading-relaxed text-ink-2">{m.body}</p>
      {m.target && <span className="mt-3 self-start rounded-full bg-navy-50 px-2.5 py-1 text-[12.5px] font-semibold text-navy-700">{targetLabel}</span>}
    </article>
  );
}

function Track({ progress, items, targetLabel, title, intro }: { progress: MotionValue<number>; items: Milestone[]; targetLabel: string; title: string; intro: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 64));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useTransform(progress, [0.14, 0.9], [0, -distance]);
  const bar = useTransform(progress, [0.14, 0.9], ["0%", "100%"]);

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-page px-5 sm:px-8">
        <h2 className="max-w-[20ch] text-h1 text-ink">{title}</h2>
        <p className="mt-4 max-w-xl text-[18px] text-ink-2">{intro}</p>
      </div>
      <motion.div ref={trackRef} style={{ x }} className="mt-14 flex gap-14 pl-[max(20px,calc((100vw-1240px)/2+32px))] pr-16">
        {items.map((m) => (
          <Card key={m.year} m={m} targetLabel={targetLabel} />
        ))}
      </motion.div>
      <div className="mx-auto mt-14 w-full max-w-page px-5 sm:px-8">
        <div className="h-[3px] overflow-hidden rounded-full bg-surface2">
          <motion.div
            style={{ width: bar, background: "linear-gradient(90deg, #FF8A1F 0%, #FF8A1F 33%, #1F43B8 33%, #1F43B8 66%, #12803C 66%)" }}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}

/** 1947 → 2047 as a horizontal track, scrubbed by vertical scroll. */
export function Journey() {
  const t = useTranslations("site.journey");
  const reduce = useReducedMotion();
  const items = t.raw("items") as Milestone[];

  if (reduce) {
    return (
      <section id="journey" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-page px-5 sm:px-8">
          <h2 className="text-h1 text-ink">{t("title")}</h2>
          <p className="mt-4 max-w-xl text-[18px] text-ink-2">{t("intro")}</p>
        </div>
        <div className="no-scrollbar mt-12 flex gap-12 overflow-x-auto px-5 pb-6 sm:px-8">
          {items.map((m) => (
            <Card key={m.year} m={m} targetLabel={t("target")} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="journey" className="relative">
      <ScrollScene height={`${items.length * 45}vh`}>
        {(progress) => <Track progress={progress} items={items} targetLabel={t("target")} title={t("title")} intro={t("intro")} />}
      </ScrollScene>
    </section>
  );
}
