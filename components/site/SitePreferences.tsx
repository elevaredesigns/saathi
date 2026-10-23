"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Website accessibility preferences (GIGW asks for text resizing and a
 * contrast option on every government site). Stored per browser.
 */
export interface SitePrefs {
  textSize: 0 | 1 | 2;
  contrast: boolean;
  reduceMotion: boolean;
}

const DEFAULTS: SitePrefs = { textSize: 0, contrast: false, reduceMotion: false };
const KEY = "saathi.site.prefs";
const ZOOM = [1, 1.12, 1.25];

interface Ctx {
  prefs: SitePrefs;
  setPrefs: (next: Partial<SitePrefs>) => void;
  reset: () => void;
}

const PrefsContext = createContext<Ctx | null>(null);

export function useSitePrefs(): Ctx {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("useSitePrefs must be used inside <SitePreferences>");
  return ctx;
}

export function SitePreferences({ children }: { children: React.ReactNode }) {
  const [prefs, setState] = useState<SitePrefs>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<SitePrefs>) });
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setPrefs = useCallback((next: Partial<SitePrefs>) => {
    setState((prev) => {
      const merged = { ...prev, ...next };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(merged));
      } catch {
        /* non-fatal */
      }
      return merged;
    });
  }, []);

  const reset = useCallback(() => setPrefs(DEFAULTS), [setPrefs]);
  const value = useMemo(() => ({ prefs, setPrefs, reset }), [prefs, setPrefs, reset]);

  return (
    <PrefsContext.Provider value={value}>
      <MotionConfig reducedMotion={prefs.reduceMotion ? "always" : "user"}>
        <div
          className={cn("site-root", prefs.contrast && "site-contrast", prefs.reduceMotion && "site-still")}
          style={prefs.textSize ? { zoom: ZOOM[prefs.textSize] } : undefined}
        >
          {children}
        </div>
      </MotionConfig>
    </PrefsContext.Provider>
  );
}
