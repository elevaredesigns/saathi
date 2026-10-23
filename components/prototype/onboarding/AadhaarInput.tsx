"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * 12-digit Aadhaar entry. Digits render in three groups of four fixed cells,
 * and each cell owns the progress tick directly beneath it, so digit and tick
 * can never drift apart. A single real <input> sits on top for typing, paste,
 * autofill and screen readers; the cells are presentation only.
 */
export function AadhaarInput({ value, onChange }: { value: string; onChange: (digits: string) => void }) {
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const done = value.length === 12;
  const caret = Math.min(value.length, 11);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "relative cursor-text rounded-[18px] bg-white px-4 pb-3 pt-3.5 ring-inset transition-shadow duration-200",
        focused ? "ring-2 ring-navy-600" : done ? "ring-2 ring-green-500" : "ring-1 ring-line-strong",
      )}
    >
      <input
        ref={inputRef}
        inputMode="numeric"
        autoComplete="off"
        maxLength={14}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 12))}
        aria-label="Aadhaar number"
        className="absolute inset-0 h-full w-full cursor-text rounded-[18px] bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent"
      />

      <div aria-hidden className="pointer-events-none grid grid-cols-3 gap-3">
        {[0, 1, 2].map((g) => (
          <div key={g} className="grid grid-cols-4 gap-[3px]">
            {[0, 1, 2, 3].map((c) => {
              const i = g * 4 + c;
              const filled = i < value.length;
              const isCaret = focused && !done && i === caret;
              return (
                <div key={c} className="flex flex-col items-center">
                  <span className="relative flex h-9 w-full items-center justify-center font-mono text-[24px] leading-none tabular-nums">
                    {filled ? (
                      <motion.span
                        key={value[i]}
                        initial={reduce ? false : { opacity: 0, transform: "translateY(6px)" }}
                        animate={{ opacity: 1, transform: "translateY(0px)" }}
                        transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                        className="text-ink"
                      >
                        {value[i]}
                      </motion.span>
                    ) : isCaret ? (
                      <span className="h-6 w-[2px] animate-pulse rounded-full bg-navy-600" />
                    ) : (
                      <span className="text-ink-4/60">0</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 h-[3px] w-full rounded-full transition-colors duration-150",
                      filled ? (done ? "bg-green-600" : "bg-navy-600") : isCaret ? "bg-navy-200" : "bg-surface2",
                    )}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
