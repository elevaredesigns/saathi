import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Mark, Words } from "../parts";
import { C, clamp, deva, display, out } from "../theme";

/** The reveal: the mark draws itself, then the name and the promise. */
export const S2Title: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
      <div style={{ scale: interpolate(f, [0, 40], [0.86, 1], { ...clamp, easing: out }), marginTop: -40 }}>
        <Mark size={230} start={4} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 34, marginTop: 6 }}>
        <div style={{ ...display, fontSize: 168, opacity: interpolate(f, [26, 42], [0, 1], clamp), translate: interpolate(f, [26, 50], ["0px 30px", "0px 0px"], { ...clamp, easing: out }) }}>Saathi</div>
        <div style={{ fontFamily: deva, fontWeight: 600, fontSize: 96, color: C.ink3, opacity: interpolate(f, [36, 52], [0, 1], clamp), translate: interpolate(f, [36, 58], ["0px 30px", "0px 0px"], { ...clamp, easing: out }) }}>साथी</div>
      </div>
      <div style={{ ...display, fontSize: 64, fontWeight: 500, color: C.ink2, marginTop: 30, letterSpacing: "-0.02em" }}>
        <Words text="One door to every government service." start={56} stagger={3} />
      </div>
    </AbsoluteFill>
  );
};
