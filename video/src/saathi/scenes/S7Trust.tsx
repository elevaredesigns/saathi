import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Phone, Words } from "../parts";
import { C, clamp, display, inter, out } from "../theme";

/** Privacy: every share is asked for, every look is logged where you can see it. */
export const S7Trust: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <div style={{ position: "absolute", left: 1080, top: 70, translate: interpolate(f, [0, 34], ["0px 60px", "0px 0px"], { ...clamp, easing: out }), opacity: interpolate(f, [0, 14], [0, 1], clamp) }}>
        <Phone src="shots/p-privacy.png" width={440}>
          <Img src={staticFile("shots/p-status.png")} style={{ position: "absolute", inset: 0, width: "100%", opacity: interpolate(f, [84, 94], [0, 1], clamp) }} />
        </Phone>
      </div>
      <div style={{ position: "absolute", left: 160, top: 290, width: 880 }}>
        <div style={{ ...display, fontSize: 124 }}>
          <Words text="Nothing moves without your yes." start={10} style={{ justifyContent: "flex-start" }} />
        </div>
        <div style={{ position: "relative", marginTop: 34, height: 140 }}>
          <div style={{ position: "absolute", fontFamily: inter, fontSize: 48, fontWeight: 500, color: C.ink3, lineHeight: 1.3, letterSpacing: "-0.015em", opacity: interpolate(f, [34, 48, 80, 88], [0, 1, 1, 0], clamp) }}>
            Every look at your data is logged —
            <br />
            and you can switch it off.
          </div>
          <div style={{ position: "absolute", fontFamily: inter, fontSize: 48, fontWeight: 500, color: C.ink3, lineHeight: 1.3, letterSpacing: "-0.015em", opacity: interpolate(f, [90, 104], [0, 1], clamp) }}>
            Every application tracked,
            <br />
            with a named officer and a date.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
