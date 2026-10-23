"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

import { spring } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

/** Segmented control whose white thumb glides between options. */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number }[];
  className?: string;
}) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <div role="tablist" className={cn("flex rounded-[14px] bg-surface2 p-[3px]", className)}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative flex-1 rounded-[11px] px-2 py-2 text-[13.5px] font-semibold transition-colors duration-200",
              active ? "text-ink" : "text-ink-3",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={reduce ? { duration: 0 } : spring.layout}
                className="absolute inset-0 rounded-[11px] bg-white shadow-[0_1px_2px_rgba(11,13,20,0.08),0_2px_8px_-2px_rgba(11,13,20,0.08)]"
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {o.label}
              {o.count !== undefined && (
                <span className={cn("rounded-full px-1.5 text-[11px] tabular-nums", active ? "bg-navy-50 text-navy-700" : "bg-white/70 text-ink-3")}>
                  {o.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
