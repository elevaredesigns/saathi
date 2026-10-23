"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { ease } from "@/lib/design/motion";

/** Navigation depth per route — deeper screens push in from the right. */
export function routeDepth(pathname: string): number {
  if (/\/prototype\/apply/.test(pathname)) return 2;
  if (/\/prototype\/(moment|service|scheme|status|privacy)/.test(pathname)) return 1;
  return 0;
}

/**
 * Enter animation keyed by route. Push (deeper) slides in from the right, pop
 * (shallower) from the left — the same path things left on — and tab switches
 * simply cross-fade, as on iOS. Reduced motion: fade only.
 */
export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const prev = useRef(pathname);
  // The first screen is visible from the very first (server) paint — content
  // must never wait on JavaScript to appear. Only later navigations animate.
  const first = useRef(true);

  const from = routeDepth(prev.current);
  const to = routeDepth(pathname);
  const direction = prev.current === pathname ? 0 : Math.sign(to - from);

  useEffect(() => {
    prev.current = pathname;
    first.current = false;
  }, [pathname]);

  const initial = reduce
    ? { opacity: 0 }
    : direction > 0
      ? { opacity: 0, transform: "translateX(28px)" }
      : direction < 0
        ? { opacity: 0, transform: "translateX(-28px)" }
        : { opacity: 0, transform: "scale(0.995)" };

  return (
    <motion.div
      data-reveal
      key={pathname}
      initial={first.current ? false : initial}
      animate={{ opacity: 1, transform: reduce ? "none" : "translateX(0px) scale(1)" }}
      transition={{ duration: 0.34, ease: ease.drawer }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
