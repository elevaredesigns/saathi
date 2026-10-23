import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Phone, Words } from "../parts";
import { C, clamp, display, inOut, inter, out } from "../theme";

/** The phone arrives: a home built around your life, not around departments. */
export const S3Home: React.FC = () => {
  const f = useCurrentFrame();
  const swap = interpolate(f, [92, 104], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.page }}>
      <div
        style={{
          position: "absolute",
          left: 1080,
          top: 70,
          translate: interpolate(f, [0, 44], ["0px 620px", "0px 0px"], { ...clamp, easing: out }),
          rotate: interpolate(f, [0, 44, 165], ["8deg", "0deg", "-1.5deg"], { ...clamp, easing: inOut }),
        }}
      >
        <Phone src="shots/p-home.png" width={440}>
          <Img src={staticFile("shots/p-explore.png")} style={{ position: "absolute", inset: 0, width: "100%", opacity: swap }} />
        </Phone>
      </div>

      <div style={{ position: "absolute", left: 160, top: 300, width: 860 }}>
        <div style={{ ...display, fontSize: 126, textAlign: "left" }}>
          <Words text="Starts from your life." start={18} style={{ justifyContent: "flex-start" }} />
        </div>
        <div style={{ position: "relative", height: 140, marginTop: 30 }}>
          <div style={{ position: "absolute", fontFamily: inter, fontSize: 50, fontWeight: 500, color: C.ink3, letterSpacing: "-0.015em", lineHeight: 1.3, opacity: interpolate(f, [40, 54, 88, 98], [0, 1, 1, 0], clamp) }}>
            Not from a department.
          </div>
          <div style={{ position: "absolute", fontFamily: inter, fontSize: 50, fontWeight: 500, color: C.ink3, letterSpacing: "-0.015em", lineHeight: 1.3, opacity: interpolate(f, [100, 114], [0, 1], clamp), translate: interpolate(f, [100, 120], ["0px 16px", "0px 0px"], { ...clamp, easing: out }) }}>
            A new baby. A first job. A harvest.
            <br />
            Everything it needs, in one place.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
