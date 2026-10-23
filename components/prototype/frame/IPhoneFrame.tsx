"use client";

import { useScroll, type MotionValue } from "framer-motion";
import { createContext, useContext, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";
import { DynamicIsland } from "./DynamicIsland";
import { HomeIndicator } from "./HomeIndicator";
import { StatusBar } from "./StatusBar";

/**
 * Portal host = the screen <div>. Sheets/modals (language selector, voice
 * modal…) render into it so they overlay the device — never the whole page.
 */
const FramePortalContext = createContext<HTMLElement | null>(null);
export const useFramePortal = () => useContext(FramePortalContext);

/** Scroll position of the screen's content — drives collapsing headers. */
interface ScreenScroll {
  scrollY: MotionValue<number>;
  containerRef: RefObject<HTMLElement>;
}
const ScreenScrollContext = createContext<ScreenScroll | null>(null);
export function useScreenScroll(): ScreenScroll {
  const ctx = useContext(ScreenScrollContext);
  if (!ctx) throw new Error("useScreenScroll must be used inside <IPhoneFrame>");
  return ctx;
}

interface IPhoneFrameProps {
  children: React.ReactNode;
  /** Floating tab bar, pinned above the home indicator. */
  tabBar?: React.ReactNode;
  /** Floated top-right under the status bar. */
  topRight?: React.ReactNode;
  /** Full-width strip below the status bar (e.g. the proxy banner). */
  banner?: React.ReactNode;
  statusBarTime?: string;
  /** "dark" status glyphs on light screens (default), "light" on navy screens. */
  tone?: "dark" | "light";
  /** Screen background. */
  screenClassName?: string;
}

/** Device size on wide screens. On phones (≤640px, not embedded) the frame drops its
 *  chrome and the screen fills the real display — see .proto-* rules in globals.css. */
export const SCREEN_W = 393;
export const SCREEN_H = 852;

export function IPhoneFrame({
  children,
  tabBar,
  topRight,
  banner,
  statusBarTime,
  tone = "dark",
  screenClassName,
}: IPhoneFrameProps) {
  const [screenEl, setScreenEl] = useState<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll({ container: containerRef });

  return (
    <div className="proto-device relative shrink-0" style={{ width: SCREEN_W + 26 }}>
      {/* Side buttons — action, volume, power */}
      <div className="proto-chrome absolute -left-[3px] top-[118px] h-[30px] w-[4px] rounded-l-[3px] bg-gradient-to-b from-[#D9DBE0] to-[#B4B7BE]" />
      <div className="proto-chrome absolute -left-[3px] top-[176px] h-[54px] w-[4px] rounded-l-[3px] bg-gradient-to-b from-[#D9DBE0] to-[#B4B7BE]" />
      <div className="proto-chrome absolute -left-[3px] top-[242px] h-[54px] w-[4px] rounded-l-[3px] bg-gradient-to-b from-[#D9DBE0] to-[#B4B7BE]" />
      <div className="proto-chrome absolute -right-[3px] top-[206px] h-[84px] w-[4px] rounded-r-[3px] bg-gradient-to-b from-[#D9DBE0] to-[#B4B7BE]" />

      {/* Titanium rail */}
      <div className="proto-rail rounded-[60px] bg-gradient-to-br from-[#F1F2F5] via-[#C9CCD3] to-[#A6A9B1] p-[3px] shadow-[0_70px_120px_-40px_rgba(11,13,20,0.38),0_24px_48px_-24px_rgba(11,13,20,0.22),inset_0_1px_0_rgba(255,255,255,0.9)]">
        {/* Bezel */}
        <div className="proto-bezel rounded-[57px] bg-[#0A0B0F] p-[10px]">
          {/* Screen */}
          <div
            ref={setScreenEl}
            className={cn("proto-screen relative isolate overflow-hidden rounded-[47px] bg-page", screenClassName)}
            style={{ width: SCREEN_W, height: SCREEN_H }}
          >
            <FramePortalContext.Provider value={screenEl}>
              <ScreenScrollContext.Provider value={{ scrollY, containerRef }}>
                <DynamicIsland />

                {/* Status glyphs over a scroll-edge fade (no hard bar) */}
                <div
                  aria-hidden
                  className={cn(
                    "proto-chrome pointer-events-none absolute inset-x-0 top-0 z-30 h-[58px]",
                    tone === "dark"
                      ? "bg-gradient-to-b from-white via-white/85 to-white/0"
                      : "bg-gradient-to-b from-navy-900/60 to-transparent",
                  )}
                />
                <div className="proto-chrome pointer-events-none absolute inset-x-0 top-0 z-[90]">
                  <StatusBar time={statusBarTime} tone={tone} />
                </div>

                {topRight && <div className="absolute right-4 z-30" style={{ top: "calc(var(--proto-top) + 10px)" }}>{topRight}</div>}
                {banner && <div className="absolute inset-x-0 z-30" style={{ top: "var(--proto-top)" }}>{banner}</div>}

                {/* Scrollable screen content — the page's main landmark */}
                <main
                  id="main"
                  ref={containerRef}
                  className="no-scrollbar relative h-full w-full overflow-y-auto overscroll-contain"
                  style={{
                    paddingTop: banner ? "calc(var(--proto-top) + 48px)" : "var(--proto-top)",
                    paddingBottom: tabBar ? "calc(118px + var(--proto-bottom))" : "calc(34px + var(--proto-bottom))",
                  }}
                >
                  {children}
                </main>

                {tabBar && <div className="absolute inset-x-3 z-40" style={{ bottom: "calc(20px + var(--proto-bottom))" }}>{tabBar}</div>}

                <HomeIndicator tone={tone} />
              </ScreenScrollContext.Provider>
            </FramePortalContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
