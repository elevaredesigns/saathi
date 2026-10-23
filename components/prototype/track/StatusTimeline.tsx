"use client";

import { Check } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

import { Avatar } from "@/components/prototype/ui/Avatar";
import { ease } from "@/lib/design/motion";
import type { TimelineStep } from "@/lib/timeline";
import { cn } from "@/lib/utils";

/**
 * Vertical status timeline. Completed connectors fill downward in sequence,
 * the current stage breathes, and every stage names the person responsible.
 */
export function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  const reduce = useReducedMotion();

  return (
    <ol className="relative">
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const delay = 0.15 + i * 0.16;
        return (
          <li key={s.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span className="absolute bottom-0 left-[13px] top-8 w-[2px] overflow-hidden rounded-full bg-surface2">
                {s.state === "done" && (
                  <motion.span
                    className="absolute inset-0 origin-top rounded-full bg-green-600"
                    initial={reduce ? false : { transform: "scaleY(0)" }}
                    animate={{ transform: "scaleY(1)" }}
                    transition={{ duration: 0.45, ease: ease.inOut, delay: delay + 0.1 }}
                  />
                )}
              </span>
            )}

            <motion.span
              className="relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center"
              initial={reduce ? false : { opacity: 0, transform: "scale(0.7)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.25, delay }}
            >
              {s.state === "done" && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white">
                  <Check size={15} weight="bold" />
                </span>
              )}
              {s.state === "current" && (
                <>
                  {!reduce && <span className="absolute inset-0 animate-ripple rounded-full bg-navy-400/40" />}
                  <span className="relative h-7 w-7 rounded-full bg-navy-600 ring-[5px] ring-navy-100" />
                </>
              )}
              {s.state === "upcoming" && <span className="h-7 w-7 rounded-full bg-white ring-2 ring-inset ring-line-strong" />}
            </motion.span>

            <motion.div
              className={cn("min-w-0 flex-1 pb-1", s.state === "upcoming" && "opacity-60")}
              initial={reduce ? false : { opacity: 0, transform: "translateX(-6px)" }}
              animate={{ opacity: s.state === "upcoming" ? 0.6 : 1, transform: "translateX(0px)" }}
              transition={{ duration: 0.4, ease: ease.out, delay: delay + 0.05 }}
            >
              <p className={cn("text-[15.5px] font-semibold leading-snug", s.state === "current" ? "text-navy-700" : "text-ink")}>{s.name}</p>
              {s.officer && (
                <div className="mt-1.5 flex items-center gap-2">
                  <Avatar name={s.officer} size={22} />
                  <span className="truncate text-[13px] text-ink-2">
                    {s.officer}
                    {s.role && <span className="text-ink-3"> · {s.role}</span>}
                  </span>
                </div>
              )}
              {s.dateLabel && (
                <p className={cn("mt-1 text-[12.5px] tabular-nums", s.state === "current" ? "font-semibold text-saffron-700" : "text-ink-3")}>{s.dateLabel}</p>
              )}
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}
