import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Mark, Words } from "../parts";
import { C, clamp, deva, display, inter, out } from "../theme";

/** Sign-off. */
export const S10Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginTop: -60 }}>
        <Mark size={170} start={6} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26, marginTop: 4, opacity: interpolate(f, [24, 38], [0, 1], clamp), translate: interpolate(f, [24, 46], ["0px 24px", "0px 0px"], { ...clamp, easing: out }) }}>
        <span style={{ ...display, fontSize: 132 }}>Saathi</span>
        <span style={{ fontFamily: deva, fontWeight: 600, fontSize: 76, color: C.ink3 }}>साथी</span>
      </div>
      <div style={{ ...display, fontSize: 60, fontWeight: 500, color: C.ink2, marginTop: 24, letterSpacing: "-0.02em" }}>
        <Words text="Your companion through citizen life." start={44} />
      </div>
      <div style={{ position: "absolute", bottom: 96, left: 0, right: 0, textAlign: "center", fontFamily: inter, fontSize: 34, fontWeight: 500, color: C.ink3, lineHeight: 1.5, opacity: interpolate(f, [76, 92], [0, 1], clamp) }}>
        Designed for Viksit Bharat @2047
        <br />
        <span style={{ color: C.ink2, fontWeight: 600 }}>Krishom Sharma</span> · Chandigarh University
      </div>
    </AbsoluteFill>
  );
};
