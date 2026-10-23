"use client";

import { useScroll, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollSceneProps {
  /** Total scroll distance the scene occupies (the pinned stage is one viewport). */
  height?: string;
  className?: string;
  stageClassName?: string;
  children: (progress: MotionValue<number>) => React.ReactNode;
}

/**
 * A pinned, scroll-scrubbed stage. The outer element is tall; the inner stage
 * sticks to the viewport while `progress` runs 0 → 1 across the scroll.
 * Consumers map progress to transforms with useTransform.
 */
export function ScrollScene({ height = "300vh", className, stageClassName, children }: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className={cn("relative", className)} style={{ height }}>
      <div className={cn("sticky top-0 h-screen overflow-hidden", stageClassName)}>{children(scrollYProgress)}</div>
    </div>
  );
}
