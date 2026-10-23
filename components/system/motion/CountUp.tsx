"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ease } from "@/lib/design/motion";

interface CountUpProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
  /** Decimal places kept while counting (defaults to the value's own precision). */
  decimals?: number;
}

const defaultFormat = (n: number) => n.toLocaleString("en-IN");

/** Mission-counter numerals that count up once when scrolled into view. */
export function CountUp({ value, format = defaultFormat, duration = 1.6, className, decimals }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const places = decimals ?? (String(value).split(".")[1]?.length || 0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: ease.cinematic,
      onUpdate: (v) => setShown(Number(v.toFixed(places))),
    });
    return () => controls.stop();
  }, [inView, reduce, value, duration, places]);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers hear the final number once, not every frame of the count. */}
      <span className="sr-only">{format(value)}</span>
      <span aria-hidden className="tabular-nums">
        {format(shown)}
      </span>
    </span>
  );
}
