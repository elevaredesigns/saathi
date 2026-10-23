import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Browser, Words } from "../parts";
import { C, clamp, display, inter, out } from "../theme";

/** The department console — the other side of every service. */
export const S8Console: React.FC = () => {
  const f = useCurrentFrame();
  const w = 1440;
  return (
    <AbsoluteFill style={{ background: "#EEF0F4" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center" }}>
        <div style={{ ...display, fontSize: 112 }}>
          <Words text="Both sides of the counter." start={6} />
        </div>
        <div style={{ fontFamily: inter, fontSize: 46, fontWeight: 500, color: C.ink3, marginTop: 18, letterSpacing: "-0.015em", opacity: interpolate(f, [26, 40], [0, 1], clamp) }}>
          Officers decide. The citizen&apos;s app updates in the same moment.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: (1920 - w) / 2,
          top: 360,
          translate: interpolate(f, [8, 46], ["0px 260px", "0px 0px"], { ...clamp, easing: out }),
          scale: interpolate(f, [8, 46, 165], [0.96, 1, 1.03], clamp),
          transformOrigin: "50% 0%",
        }}
      >
        <div style={{ position: "relative" }}>
          <Browser src="shots/d-console.png" width={w} url="saathi · Nagar Nigam, Kanpur" height={900} />
          <div style={{ position: "absolute", left: 0, top: 52 * (w / 1600), width: w, opacity: interpolate(f, [86, 98], [0, 1], clamp) }}>
            <Img src={staticFile("shots/d-console-case.png")} style={{ width: w, display: "block" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
