import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Phone, Words } from "../parts";
import { C, clamp, display, inter, out } from "../theme";

const STATS: [string, string, string][] = [
  ["7", "you qualify for", C.green],
  ["1", "might apply — one more check", "#B45309"],
  ["4", "not for you, and why", C.ink3],
];

/** Every scheme checked — not one suggestion, all twelve, with reasons. */
export const S6Schemes: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.page }}>
      <div style={{ position: "absolute", left: 220, top: 70, translate: interpolate(f, [0, 34], ["0px 60px", "0px 0px"], { ...clamp, easing: out }), opacity: interpolate(f, [0, 14], [0, 1], clamp) }}>
        <Phone src="shots/p-eligibility.png" width={440} />
      </div>
      <div style={{ position: "absolute", left: 860, top: 220, width: 960 }}>
        <div style={{ ...display, fontSize: 120 }}>
          <Words text="Everything you're owed." start={10} style={{ justifyContent: "flex-start" }} />
        </div>
        <div style={{ fontFamily: inter, fontSize: 48, fontWeight: 500, color: C.ink3, marginTop: 24, letterSpacing: "-0.015em", opacity: interpolate(f, [30, 44], [0, 1], clamp) }}>
          All 12 schemes, checked against your life.
        </div>
        <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 22 }}>
          {STATS.map(([n, label, color], i) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 26, opacity: interpolate(f, [52 + i * 10, 64 + i * 10], [0, 1], clamp), translate: interpolate(f, [52 + i * 10, 76 + i * 10], ["-30px 0px", "0px 0px"], { ...clamp, easing: out }) }}>
              <span style={{ ...display, fontSize: 104, color, width: 70, textAlign: "right" }}>{n}</span>
              <span style={{ fontFamily: inter, fontSize: 50, fontWeight: 500, color: C.ink2, letterSpacing: "-0.015em" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
