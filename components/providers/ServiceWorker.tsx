"use client";

import { useEffect } from "react";

/**
 * Registers the offline service worker (public build only), after the page has
 * loaded so it never competes with first paint. Once it has run, every page,
 * the prototype, Saathi AI and the department console work without a network.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
