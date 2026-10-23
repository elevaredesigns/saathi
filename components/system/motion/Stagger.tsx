"use client";

import { motion, useReducedMotion } from "framer-motion";
import { duration, ease, STAGGER } from "@/lib/design/motion";
import { revealVariants, type RevealVariant } from "./Reveal";

interface StaggerProps {
  children: React.ReactNode;
  gap?: number;
  delay?: number;
  amount?: number;
  className?: string;
  as?: "div" | "ul" | "ol";
}

/** Container that cascades its <StaggerItem> children into view. */
export function Stagger({ children, gap = STAGGER, delay = 0, amount = 0.2, className, as = "div" }: StaggerProps) {
  const Tag = as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  variant = "up",
  className,
  as = "div",
}: {
  children: React.ReactNode;
  variant?: RevealVariant;
  className?: string;
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      data-reveal
      className={className}
      variants={revealVariants(variant, reduce)}
      transition={{ duration: reduce ? duration.fast : duration.slow, ease: ease.cinematic }}
    >
      {children}
    </Tag>
  );
}
