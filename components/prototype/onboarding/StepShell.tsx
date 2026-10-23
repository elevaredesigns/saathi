"use client";

import { motion, useReducedMotion } from "framer-motion";

import { ReadAloudButton } from "@/components/prototype/frame/ReadAloudButton";
import { ease } from "@/lib/design/motion";
import { cn } from "@/lib/utils";

/**
 * Onboarding step layout: title + subtitle, body, and a footer pinned to the
 * bottom over a soft white fade. `center` vertically centres hero moments.
 * Title and body stagger in on every step.
 */
export function StepShell({
  title,
  subtitle,
  children,
  footer,
  center = false,
}: {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  center?: boolean;
}) {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(10px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 0.5, ease: ease.cinematic, delay },
  });

  return (
    <div className="flex h-full flex-col">
      <div className={cn("no-scrollbar flex-1 overflow-y-auto px-6 pb-6", center && "flex flex-col")}>
        {(title || subtitle) && (
          <motion.div data-reveal {...rise(0.04)} className="pt-3">
            {title && (
              <div className="flex items-start gap-2">
                <h1 className="flex-1 text-[28px] font-semibold leading-[1.15] tracking-[var(--track-tight)] text-ink">{title}</h1>
                <ReadAloudButton text={`${title}. ${subtitle ?? ""}`} className="mt-1" />
              </div>
            )}
            {subtitle && <p className="mt-2.5 text-[16px] leading-relaxed text-ink-2">{subtitle}</p>}
          </motion.div>
        )}
        <motion.div data-reveal {...rise(0.12)} className={cn(center ? "flex flex-1 flex-col justify-center" : "pt-7")}>
          {children}
        </motion.div>
      </div>
      {footer && (
        <div className="relative shrink-0 px-6 pb-6 pt-3">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-white to-white/0" />
          {footer}
        </div>
      )}
    </div>
  );
}
