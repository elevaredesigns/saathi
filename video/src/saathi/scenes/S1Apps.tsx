import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Words } from "../parts";
import { clamp, display, inOut, inter, out } from "../theme";

const APPS = [
  "UMANG", "DigiLocker", "mParivahan", "e-District", "PM-KISAN", "RailMadad", "mAadhaar", "EPFO", "Passport Seva", "BHIM",
  "IRCTC", "NSP", "e-Hospital", "Bhuvan", "Skill India", "DigiYatra", "CoWIN", "Aaykar Setu", "UTS", "SWAYAM",
  "eCourts", "Jan Dhan", "PMAY-G", "MyGov", "Sarathi", "Vahan", "e-Shram", "PFMS", "Poshan", "Meri Pehchaan",
  "e-Nam", "Ayushman", "NCS", "eGramSwaraj", "Bhulekh", "CPGRAMS", "ePathshala", "Saral", "Mera Ration", "UDID",
];

/** Cold open: hundreds of apps flood the screen, then are pulled into one point. */
export const S1Apps: React.FC = () => {
  const f = useCurrentFrame();
  const pull = interpolate(f, [92, 132], [0, 1], { ...clamp, easing: inOut });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {APPS.map((name, i) => {
        const x = random(`x${i}`) * 1760 + 80;
        const y = random(`y${i}`) * 900 + 90;
        const drift = Math.sin(f / 40 + i) * 12;
        const appear = interpolate(f, [4 + i * 1.6, 18 + i * 1.6], [0, 1], clamp);
        const tx = (960 - x) * pull;
        const ty = (540 - y) * pull;
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: x,
              top: y,
              translate: `calc(-50% + ${tx}px) calc(-50% + ${ty + drift}px)`,
              scale: interpolate(pull, [0, 1], [0.85 + random(`s${i}`) * 0.4, 0.05]),
              opacity: appear * interpolate(pull, [0.6, 1], [0.75, 0], clamp) * (0.45 + random(`o${i}`) * 0.55),
              padding: "12px 22px",
              borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,0.28)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: inter,
              fontWeight: 500,
              fontSize: 26,
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </div>
        );
      })}

      {/* the single point everything collapses into */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 540,
          width: 40,
          height: 40,
          marginLeft: -20,
          marginTop: -20,
          borderRadius: 999,
          background: "#fff",
          scale: interpolate(f, [118, 134, 150], [0, 1, 70], { ...clamp, easing: inOut }),
          opacity: interpolate(f, [116, 122], [0, 1], clamp),
        }}
      />

      {/* a soft dark pool behind the words so the apps never fight the headline */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 760px 300px at 50% 50%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 100%)", opacity: interpolate(f, [86, 100], [1, 0], clamp) }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: interpolate(f, [86, 100], [1, 0], clamp) }}>
        <div style={{ ...display, color: "#fff", fontSize: 140, textShadow: "0 0 80px #000, 0 0 40px #000" }}>
          <Words text="Hundreds of apps." start={14} />
        </div>
        <div style={{ ...display, color: "rgba(255,255,255,0.6)", fontSize: 64, marginTop: 28, opacity: interpolate(f, [46, 60], [0, 1], clamp), translate: interpolate(f, [46, 64], ["0px 20px", "0px 0px"], { ...clamp, easing: out }), textShadow: "0 0 60px #000" }}>
          Different logins. Forms. Languages.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
