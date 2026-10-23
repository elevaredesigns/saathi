"use client";

import { useEffect } from "react";

/**
 * When the prototype is rendered inside an iframe (the case-study hero embed),
 * add `is-embedded` to <html>. CSS then strips the device stage so only the
 * phone shows, on a transparent background.
 */
export function EmbedDetector() {
  useEffect(() => {
    let embedded = false;
    try {
      embedded = window.self !== window.top;
    } catch {
      embedded = true; // cross-origin access throws → we're in a frame
    }
    if (!embedded) {
      try {
        embedded =
          new URLSearchParams(window.location.search).get("embed") === "1";
      } catch {
        /* ignore */
      }
    }
    document.documentElement.classList.toggle("is-embedded", embedded);

    // Tell the host page (the website's live phone) we've hydrated and
    // painted, so it can swap its loading poster for the running app.
    if (embedded && window.parent !== window) {
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          try {
            window.parent.postMessage({ type: "saathi:ready", path: window.location.pathname }, window.location.origin);
          } catch {
            /* parent on another origin — nothing to tell */
          }
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
  }, []);

  return null;
}
