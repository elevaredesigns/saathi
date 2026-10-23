"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Six-box OTP entry with auto-advance, backspace and paste. The value is
 *  assembled from the boxes themselves so rapid/paste/programmatic entry stay
 *  consistent. `verified` turns every box green with a small pop. */
export function OtpInput({
  value,
  onChange,
  length = 6,
  verified = false,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  verified?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const reduce = useReducedMotion();
  const chars = value.split("");

  const assemble = () =>
    refs.current
      .slice(0, length)
      .map((el) => (el?.value ?? "").replace(/\D/g, "").slice(-1))
      .join("");

  const handleChange = (i: number) => {
    const filled = !!refs.current[i]?.value;
    onChange(assemble().slice(0, length));
    if (filled && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !refs.current[i]?.value && i > 0) {
      e.preventDefault();
      const prev = refs.current[i - 1];
      if (prev) prev.value = "";
      prev?.focus();
      onChange(assemble().slice(0, length));
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    text.split("").forEach((c, idx) => {
      const el = refs.current[idx];
      if (el) el.value = c;
    });
    onChange(text);
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-between gap-2" onPaste={onPaste}>
      {Array.from({ length }).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          animate={verified && !reduce ? { transform: ["scale(1)", "scale(1.08)", "scale(1)"] } : undefined}
          transition={{ duration: 0.36, delay: i * 0.04 }}
          inputMode="numeric"
          maxLength={1}
          value={chars[i] ?? ""}
          onChange={() => handleChange(i)}
          onKeyDown={(e) => onKeyDown(i, e)}
          aria-label={`Digit ${i + 1}`}
          disabled={verified}
          className={cn(
            "h-[60px] w-[50px] rounded-[14px] bg-white text-center font-mono text-[24px] font-semibold tabular-nums text-ink outline-none ring-1 ring-inset transition-[box-shadow,background-color] duration-200 focus:ring-2 focus:ring-navy-600",
            verified ? "bg-green-50 text-green-800 ring-green-500" : chars[i] ? "ring-navy-400" : "ring-line-strong",
          )}
        />
      ))}
    </div>
  );
}
