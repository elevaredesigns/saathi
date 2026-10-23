"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SaathiOrb } from "@/components/system/brand/SaathiOrb";
import { cn } from "@/lib/utils";

/** Frame outer size from IPhoneFrame: 393×852 screen + 3px rail + 10px bezel. */
const W = 419;
const H = 878;
const R = 60;
/** If the embedded app hasn't said it's ready by then, reload it (what a manual refresh used to fix). */
const RETRY_AFTER_MS = 9000;

function embedSrc(path: string) {
  const [p, q] = path.split("?");
  const base = p.endsWith("/") ? p : `${p}/`;
  return `${base}?${q ? `${q}&` : ""}embed=1`;
}

/**
 * The real prototype, running in an iframe and scaled to fit.
 *
 * Loading is designed, not left blank: a phone-shaped poster (frame, notch,
 * skeleton, the Saathi orb) shows until the embedded app posts
 * `saathi:ready` after it has hydrated, then the live app cross-fades in.
 * Off-screen phones mount their iframe ~1.5 screens early; a phone that never
 * reports ready is reloaded once automatically.
 */
export function LivePhone({ src = "/prototype/home/", scale: maxScale = 0.72, title = "Saathi prototype", className, priority = false }: { src?: string; scale?: number; title?: string; className?: string; priority?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(maxScale);
  const [capture, setCapture] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => setCapture(document.documentElement.hasAttribute("data-capture")), []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const fit = () => host.clientWidth > 0 && setScale(Math.min(maxScale, host.clientWidth / W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    return () => ro.disconnect();
  }, [maxScale]);

  // Above-the-fold phones start once the page itself has loaded, so the
  // embedded app never competes with the page's own first paint (the
  // poster covers the gap).
  useEffect(() => {
    if (!priority || mounted) return;
    const start = () => window.setTimeout(() => setMounted(true), 50);
    if (document.readyState === "complete") return void start();
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [priority, mounted]);

  // Mount the iframe when the phone is within ~1.5 viewports of the screen.
  useEffect(() => {
    if (priority || mounted || !hostRef.current) return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setMounted(true), { rootMargin: "150% 0px" });
    io.observe(hostRef.current);
    return () => io.disconnect();
  }, [priority, mounted]);

  // The embedded prototype announces itself once hydrated.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow) return;
      if ((e.data as { type?: string } | null)?.type === "saathi:ready") setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Safety net: reload a phone that never became ready (at most twice).
  useEffect(() => {
    if (!mounted || ready || attempt >= 2) return;
    const id = window.setTimeout(() => setAttempt((a) => a + 1), RETRY_AFTER_MS);
    return () => window.clearTimeout(id);
  }, [mounted, ready, attempt]);

  // Same-origin fallback: if the page inside is already interactive, don't wait for the message.
  const onLoad = useCallback(() => {
    window.setTimeout(() => {
      try {
        if (frameRef.current?.contentDocument?.documentElement.classList.contains("is-embedded")) setReady(true);
      } catch {
        /* cross-origin — rely on the message */
      }
    }, 600);
  }, []);

  const showLive = ready || capture;

  return (
    <div ref={hostRef} className={className}>
      <div className="relative mx-auto" style={{ width: W * scale, height: H * scale }}>
        <div aria-hidden className="absolute inset-0" style={{ borderRadius: R * scale, boxShadow: "0 60px 110px -40px rgba(11,13,20,0.42), 0 20px 40px -24px rgba(11,13,20,0.25)" }} />
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})`, clipPath: `inset(0 round ${R}px)` }}>
          <PhonePoster className={cn("absolute inset-0 transition-opacity duration-500", showLive ? "opacity-0" : "opacity-100")} />
          {mounted && (
            <iframe
              key={attempt}
              ref={frameRef}
              src={embedSrc(src) + (capture ? "&capture=1" : "") + (attempt ? `&r=${attempt}` : "")}
              title={title}
              onLoad={onLoad}
              className={cn("relative block border-0 bg-transparent transition-opacity duration-500", showLive ? "opacity-100" : "opacity-0")}
              style={{ width: W, height: H }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** What the phone looks like while the live app loads: the device, a quiet skeleton and the orb. */
function PhonePoster({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      <div className="absolute inset-0 rounded-[60px] bg-[#1B1D24] p-[3px]">
        <div className="relative h-full w-full overflow-hidden rounded-[57px] bg-[#0B0D14] p-[10px]">
          <div className="relative h-full w-full overflow-hidden rounded-[47px] bg-white">
            <div className="absolute left-1/2 top-[11px] h-[34px] w-[122px] -translate-x-1/2 rounded-full bg-[#0B0D14]" />
            <div className="px-6 pt-[70px]">
              <div className="h-3 w-24 animate-pulse rounded-full bg-surface2" />
              <div className="mt-3 h-7 w-56 animate-pulse rounded-full bg-surface2" />
              <div className="mt-6 h-14 animate-pulse rounded-[18px] bg-surface" />
              <div className="mt-4 h-[180px] animate-pulse rounded-[24px] bg-surface2" />
              <div className="mt-6 grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-[16px] bg-surface" />
                ))}
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-[150px] flex flex-col items-center gap-3">
              <SaathiOrb size={72} state="thinking" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
