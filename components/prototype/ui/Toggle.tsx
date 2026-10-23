"use client";

import { motion, useReducedMotion } from "framer-motion";
import { spring } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

/** iOS-style switch: navy track, spring thumb. */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label?: string }) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex h-[31px] w-[51px] shrink-0 items-center rounded-full p-[2px] transition-colors duration-200 ease-out",
        checked ? "justify-end bg-navy-600" : "justify-start bg-[#E3E5EA]",
      )}
    >
      <motion.span
        layout
        transition={reduce ? { duration: 0 } : spring.ui}
        className="h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_6px_rgba(11,13,20,0.18),0_0_0_0.5px_rgba(11,13,20,0.04)]"
      />
    </button>
  );
}
