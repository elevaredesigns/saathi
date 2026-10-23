"use client";

import { useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";
import "lenis/dist/lenis.css";

/**
 * Lenis smooth scrolling for the website. Skipped for people who prefer
 * reduced motion, and in ?capture=1 screenshot mode (which also jumps to the
 * URL hash once the page has laid out).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [capture, setCapture] = useState(false);

  useEffect(() => {
    if (!document.documentElement.hasAttribute("data-capture")) return;
    setCapture(true);
    const id = window.location.hash.slice(1);
    if (id) window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 600);
  }, []);

  if (reduce || capture) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, anchors: { offset: -72 } }}>
      {children}
    </ReactLenis>
  );
}
