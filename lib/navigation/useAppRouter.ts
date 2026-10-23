"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

/**
 * The prototype's router.
 *
 * On its own page it is Next's router, unchanged. Inside the website's live
 * phone (an iframe), every page change would otherwise land in the browser's
 * shared Back history — so after a visitor taps around the phone, the site's
 * Back button silently rewinds the phone instead of leaving the page, and
 * feels stuck. Embedded, the phone keeps its own page stack: `push` replaces
 * the URL and remembers where it came from; `back` returns along that stack.
 */
const phoneStack: string[] = [];

function inFrame() {
  try {
    return window.self !== window.top;
  } catch {
    return true; // cross-origin access throws → we're in a frame
  }
}

export function useAppRouter() {
  const router = useRouter();
  return useMemo(() => {
    const here = () => window.location.pathname + window.location.search;
    const push: typeof router.push = (href, options) => {
      if (!inFrame()) return router.push(href, options);
      phoneStack.push(here());
      router.replace(href, options);
    };
    const back: typeof router.back = () => {
      if (!inFrame()) return router.back();
      router.replace(phoneStack.pop() ?? "/prototype/home/");
    };
    return { ...router, push, back };
  }, [router]);
}
