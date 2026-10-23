"use client";

import { CaretDown, CheckCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: "text" | "select" | "readout";
  options?: string[];
  placeholder?: string;
  selectPrompt?: string;
  hint?: string;
  /** Just filled by voice / DigiLocker — plays a confirmation sweep. */
  highlight?: boolean;
  trailing?: React.ReactNode;
  inputMode?: "text" | "numeric" | "tel" | "email";
  className?: string;
}

/**
 * Form field. Label sits above (never inside) so Indic scripts keep their full
 * line height; 56px targets; navy focus ring; a filled-by-Saathi sweep.
 */
export function Field({
  label,
  value,
  onChange,
  type = "text",
  options = [],
  placeholder,
  selectPrompt = "Select",
  hint,
  highlight = false,
  trailing,
  inputMode,
  className,
}: FieldProps) {
  const id = useId();
  const reduce = useReducedMotion();

  const shell = cn(
    "relative flex min-h-[56px] items-center overflow-hidden rounded-[14px] bg-white ring-1 ring-inset transition-[box-shadow,background-color] duration-200",
    "focus-within:ring-2 focus-within:ring-navy-600",
    highlight ? "bg-navy-50/60 ring-navy-200" : "ring-line-strong",
    type === "readout" && "bg-surface ring-line",
  );

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center justify-between gap-2 text-[13px] font-medium text-ink-2">
        <span>{label}</span>
        <AnimatePresence>
          {highlight && (
            <motion.span
              initial={{ opacity: 0, transform: "scale(0.9)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-[12px] font-semibold text-green-600"
            >
              <CheckCircle size={14} weight="fill" />
            </motion.span>
          )}
        </AnimatePresence>
      </label>

      <div className={shell}>
        {highlight && !reduce && (
          <motion.span
            aria-hidden
            initial={{ transform: "translateX(-100%)" }}
            animate={{ transform: "translateX(100%)" }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            className="pointer-events-none absolute inset-y-0 w-2/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"
          />
        )}

        {type === "readout" ? (
          <span id={id} className="relative flex-1 px-4 py-3 text-[16px] font-medium text-ink">
            {value}
          </span>
        ) : type === "select" ? (
          <>
            <select
              id={id}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className={cn(
                "relative h-[56px] flex-1 appearance-none bg-transparent px-4 pr-10 text-[16px] outline-none",
                value ? "text-ink" : "text-ink-3",
              )}
            >
              <option value="" disabled>
                {selectPrompt}
              </option>
              {options.map((o) => (
                <option key={o} value={o} className="text-ink">
                  {o}
                </option>
              ))}
            </select>
            <CaretDown size={16} weight="bold" className="pointer-events-none absolute right-4 text-ink-3" />
          </>
        ) : (
          <input
            id={id}
            value={value}
            inputMode={inputMode}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="relative h-[56px] min-w-0 flex-1 bg-transparent px-4 text-[16px] text-ink outline-none placeholder:text-ink-4"
          />
        )}
        {trailing && <span className="relative flex shrink-0 items-center pr-2">{trailing}</span>}
      </div>
      {hint && <p className="mt-1.5 text-[12.5px] text-ink-3">{hint}</p>}
    </div>
  );
}
