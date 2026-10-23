import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Phone } from "../parts";
import { clamp, display, inter, out } from "../theme";

// Real frames of Saathi AI handling one request, in order.
const SCREENS: [number, string][] = [
  [0, "shots/p-saathi.png"],
  [34, "shots/p-ai-700.png"],
  [62, "shots/p-ai-1800.png"],
  [92, "shots/p-ai-3200.png"],
  [124, "shots/p-ai-4800.png"],
  [160, "shots/p-ai-consent.png"],
  [212, "shots/p-ai-after-1200.png"],
  [232, "shots/p-ai-after-6500.png"],
];

const CAPTIONS: [number, number, string, string][] = [
  [10, 66, "Tell it what you need.", "In your words. In your language."],
  [70, 156, "It makes a plan.", "Records from DigiLocker. The form, already filled."],
  [160, 214, "It asks first.", "Nothing is shared until you say yes."],
  [218, 300, "Done.", "A reference number, a named officer, a date."],
];

/** Saathi AI — the assistant that acts, and asks before it does. */
export const S4AI: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(1200px 800px at 70% 50%, #13245E 0%, #05070D 70%)" }}>
      <div style={{ position: "absolute", left: 1080, top: 70, translate: interpolate(f, [0, 30], ["0px 40px", "0px 0px"], { ...clamp, easing: out }), opacity: interpolate(f, [0, 14], [0, 1], clamp) }}>
        <Phone src={SCREENS[0][1]} width={440}>
          {SCREENS.slice(1).map(([at, src]) => (
            <Img key={src} src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", opacity: interpolate(f, [at, at + 7], [0, 1], clamp) }} />
          ))}
        </Phone>
      </div>

      <div style={{ position: "absolute", left: 160, top: 340, width: 880 }}>
        <div style={{ fontFamily: inter, fontSize: 30, fontWeight: 600, letterSpacing: "0.14em", color: "#8EA6F0", marginBottom: 26 }}>SAATHI AI</div>
        {CAPTIONS.map(([a, b, title, sub]) => (
          <div key={title} style={{ position: "absolute", top: 60, opacity: interpolate(f, [a, a + 12, b - 8, b], [0, 1, 1, 0], clamp), translate: interpolate(f, [a, a + 22], ["0px 26px", "0px 0px"], { ...clamp, easing: out }) }}>
            <div style={{ ...display, color: "#fff", fontSize: 128 }}>{title}</div>
            <div style={{ fontFamily: inter, fontSize: 50, fontWeight: 500, color: "rgba(255,255,255,0.62)", marginTop: 26, letterSpacing: "-0.012em", lineHeight: 1.3 }}>{sub}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
