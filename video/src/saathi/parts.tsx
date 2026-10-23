import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, clamp, inter, out } from "./theme";

/** The Saathi mark — two arcs and a point — drawing itself from `start`. */
export const Mark: React.FC<{ size: number; start?: number; tone?: "brand" | "white" }> = ({ size, start = 0, tone = "brand" }) => {
  const f = useCurrentFrame() - start;
  const draw = (delay: number) => interpolate(f, [delay, delay + 28], [1, 0], { ...clamp, easing: out });
  const outer = tone === "brand" ? "url(#sm-o)" : "#FFFFFF";
  const inner = tone === "brand" ? C.navy : "rgba(255,255,255,0.85)";
  const dot = tone === "brand" ? C.green : "#FFFFFF";
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <defs>
        <linearGradient id="sm-o" x1="10" y1="36" x2="46" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF8A1F" />
          <stop offset="1" stopColor="#FFA24C" />
        </linearGradient>
      </defs>
      <path d="M10 36a18 18 0 0 1 36 0" stroke={outer} strokeWidth={3.4} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(0)} />
      <path d="M18 36a10 10 0 0 1 20 0" stroke={inner} strokeWidth={3.4} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={draw(8)} />
      <circle cx={28} cy={36} r={3.2} fill={dot} style={{ scale: interpolate(f, [22, 34], [0, 1], { ...clamp, easing: out }), transformOrigin: "28px 36px" }} />
    </svg>
  );
};

/**
 * An iPhone 16 Pro–style device. The screen is a status bar (time, island,
 * glyphs) above a 393×805 screenshot of the real app.
 */
export const Phone: React.FC<{ src: string; width: number; children?: React.ReactNode; dark?: boolean; scrollY?: number }> = ({ src, width, children, dark = false, scrollY = 0 }) => {
  const f = useCurrentFrame();
  const k = width / 419; // device is 393 screen + 2×13 bezel/rail
  const screenW = 393 * k;
  const screenH = 852 * k;
  const bar = 47 * k;
  return (
    <div
      style={{
        width,
        height: (852 + 26) * k,
        // a slow camera push and a gentle float, so a phone is never a still
        scale: interpolate(f, [0, 300], [1, 1.045], clamp),
        translate: `0px ${Math.sin(f / 38) * 6 * k}px`,
        borderRadius: 64 * k,
        padding: 3 * k,
        background: "linear-gradient(135deg,#F1F2F5 0%,#C9CCD3 45%,#9EA2AA 100%)",
        boxShadow: `0 ${90 * k}px ${160 * k}px -${50 * k}px rgba(11,13,20,0.45), 0 ${30 * k}px ${60 * k}px -${30 * k}px rgba(11,13,20,0.3)`,
      }}
    >
      <div style={{ borderRadius: 61 * k, background: "#07080B", padding: 10 * k }}>
        <div style={{ position: "relative", width: screenW, height: screenH, borderRadius: 51 * k, overflow: "hidden", background: dark ? "#0A1C54" : "#FFFFFF" }}>
          {/* status bar */}
          <div style={{ position: "absolute", inset: 0, height: bar, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${30 * k}px`, fontFamily: inter, fontWeight: 600, fontSize: 16 * k, color: dark ? "#fff" : C.ink, zIndex: 3 }}>
            <span style={{ paddingTop: 4 * k }}>9:41</span>
            <span style={{ display: "flex", gap: 5 * k, alignItems: "center", paddingTop: 4 * k }}>
              <svg width={17 * k} height={11 * k} viewBox="0 0 17 11">
                {[0, 1, 2, 3].map((i) => (
                  <rect key={i} x={i * 4.5} y={8 - i * 2.6} width={3} height={3 + i * 2.6} rx={1} fill="currentColor" />
                ))}
              </svg>
              <svg width={25 * k} height={12 * k} viewBox="0 0 25 12">
                <rect x={0.5} y={0.5} width={21} height={11} rx={3.5} stroke="currentColor" strokeOpacity={0.4} fill="none" />
                <rect x={2} y={2} width={16} height={8} rx={2} fill="currentColor" />
                <rect x={22.5} y={4} width={1.6} height={4} rx={0.8} fill="currentColor" fillOpacity={0.4} />
              </svg>
            </span>
          </div>
          <div style={{ position: "absolute", left: "50%", top: 11 * k, width: 126 * k, height: 37 * k, marginLeft: -63 * k, borderRadius: 999, background: "#000", zIndex: 4 }} />
          <div style={{ position: "absolute", top: bar, left: 0, width: screenW, height: screenH - bar, overflow: "hidden" }}>
            <Img src={staticFile(src)} style={{ width: screenW, display: "block", translate: `0px ${-scrollY * k}px` }} />
            {children}
          </div>
          {/* home indicator */}
          <div style={{ position: "absolute", left: "50%", bottom: 8 * k, width: 134 * k, height: 5 * k, marginLeft: -67 * k, borderRadius: 999, background: "rgba(11,13,20,0.8)", zIndex: 4 }} />
        </div>
      </div>
    </div>
  );
};

/** A clean browser window for desktop footage. */
export const Browser: React.FC<{ src: string; width: number; url: string; scrollY?: number; height?: number }> = ({ src, width, url, scrollY = 0, height }) => {
  const k = width / 1600;
  const h = height ?? 1000 * k;
  return (
    <div style={{ width, borderRadius: 22 * k, overflow: "hidden", background: "#fff", boxShadow: `0 ${80 * k}px ${140 * k}px -${50 * k}px rgba(11,13,20,0.45), 0 0 0 ${1.5 * k}px rgba(11,13,20,0.08)` }}>
      <div style={{ height: 52 * k, background: "#F3F4F7", display: "flex", alignItems: "center", gap: 10 * k, padding: `0 ${22 * k}px`, borderBottom: `1px solid ${C.line}` }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} style={{ width: 13 * k, height: 13 * k, borderRadius: 99, background: c }} />
        ))}
        <span style={{ marginLeft: 24 * k, flex: 1, maxWidth: 560 * k, height: 30 * k, borderRadius: 9 * k, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontSize: 15 * k, color: C.ink3, border: `1px solid ${C.line}` }}>{url}</span>
      </div>
      <div style={{ height: h - 52 * k, overflow: "hidden" }}>
        <Img src={staticFile(src)} style={{ width, display: "block", translate: `0px ${-scrollY * k}px` }} />
      </div>
    </div>
  );
};

/** Words that rise in one by one — the Apple keynote headline. */
export const Words: React.FC<{ text: string; start: number; style?: React.CSSProperties; stagger?: number }> = ({ text, start, style, stagger = 3 }) => {
  const f = useCurrentFrame();
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", columnGap: "0.25em", ...style }}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
          <span
            style={{
              display: "inline-block",
              opacity: interpolate(f, [start + i * stagger, start + i * stagger + 12], [0, 1], clamp),
              translate: interpolate(f, [start + i * stagger, start + i * stagger + 22], ["0px 60%", "0px 0%"], { ...clamp, easing: out }),
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </span>
  );
};
