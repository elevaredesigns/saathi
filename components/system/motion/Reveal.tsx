"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { duration, ease } from "@/lib/design/motion";

export type RevealVariant = "up" | "fade" | "scale" | "blur";

/** Hidden → shown states per variant. Reduced motion collapses to opacity. */
export function revealVariants(variant: RevealVariant, reduce: boolean | null): Variants {
  if (reduce) return { hidden: { opacity: 0 }, shown: { opacity: 1 } };
  switch (variant) {
    case "fade":
      return { hidden: { opacity: 0 }, shown: { opacity: 1 } };
    case "scale":
      return {
        hidden: { opacity: 0, transform: "scale(0.96)" },
        shown: { opacity: 1, transform: "scale(1)" },
      };
    case "blur":
      return {
        hidden: { opacity: 0, filter: "blur(10px)", transform: "translateY(12px)" },
        shown: { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
      };
    case "up":
    default:
      return {
        hidden: { opacity: 0, transform: "translateY(24px)" },
        shown: { opacity: 1, transform: "translateY(0px)" },
      };
  }
}

const TAGS = { div: motion.div, section: motion.section, li: motion.li, span: motion.span } as const;

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  once?: boolean;
  /** Fraction of the element that must be visible before revealing. */
  amount?: number;
  as?: keyof typeof TAGS;
  className?: string;
}

/** Fades content in as it scrolls into view. */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  once = true,
  amount = 0.25,
  as = "div",
  className,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = TAGS[as];
  return (
    <Tag
      data-reveal
      className={className}
      variants={revealVariants(variant, reduce)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount }}
      transition={{ duration: reduce ? duration.fast : duration.slow + 0.14, ease: ease.cinematic, delay }}
    >
      {children}
    </Tag>
  );
}
