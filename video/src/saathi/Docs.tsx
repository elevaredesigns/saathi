import React from "react";
import { AbsoluteFill } from "remotion";
import { Browser, Mark, Phone } from "./parts";
import { C, deva, display, inter } from "./theme";

/* Still images for the project documentation, built from the same real footage. */

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ padding: "14px 26px", borderRadius: 999, background: "#fff", border: `2px solid ${C.line}`, fontFamily: inter, fontSize: 30, fontWeight: 600, color: C.ink2 }}>{children}</span>
);

export const DocHero: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(135deg,#FFFFFF 0%,#F3F5FA 100%)" }}>
    <div style={{ position: "absolute", left: 150, top: 300, width: 1150 }}>
      <Mark size={150} start={-100} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 10 }}>
        <span style={{ ...display, fontSize: 190 }}>Saathi</span>
        <span style={{ fontFamily: deva, fontWeight: 600, fontSize: 110, color: C.ink3 }}>साथी</span>
      </div>
      <div style={{ ...display, fontSize: 64, fontWeight: 500, color: C.ink2, marginTop: 24, letterSpacing: "-0.02em" }}>One door to every government service.</div>
      <div style={{ fontFamily: inter, fontSize: 36, color: C.ink3, marginTop: 26, lineHeight: 1.45 }}>
        A multilingual, voice-first citizen app with an assistant that asks before it acts — and a console for the departments on the other side.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 48 }}>
        <Chip>23 languages</Chip>
        <Chip>Saathi AI</Chip>
        <Chip>15 department consoles</Chip>
        <Chip>Works offline</Chip>
      </div>
    </div>
    <div style={{ position: "absolute", right: 520, top: 170, rotate: "-6deg" }}>
      <Phone src="shots/p-eligibility.png" width={430} />
    </div>
    <div style={{ position: "absolute", right: 110, top: 170, rotate: "6deg" }}>
      <Phone src="shots/p-ai-after-6500.png" width={430} />
    </div>
    <div style={{ position: "absolute", right: 300, top: 110 }}>
      <Phone src="shots/p-home.png" width={470} />
    </div>
  </AbsoluteFill>
);

const Row: React.FC<{ shots: string[]; bg?: string; labels?: string[] }> = ({ shots, bg = "#F6F7FA", labels }) => (
  <AbsoluteFill style={{ background: bg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 60 }}>
    {shots.map((s, i) => (
      <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <Phone src={`shots/${s}.png`} width={400} />
        {labels && <span style={{ fontFamily: inter, fontSize: 34, fontWeight: 600, color: bg === "#05070D" ? "#fff" : C.ink2 }}>{labels[i]}</span>}
      </div>
    ))}
  </AbsoluteFill>
);

export const DocApp: React.FC = () => <Row shots={["p-home", "p-explore", "p-eligibility", "p-status", "p-privacy"]} labels={["Home", "Life moments", "Schemes for me", "Track", "Privacy"]} />;
export const DocAI: React.FC = () => (
  <Row shots={["p-ai-1800", "p-ai-4800", "p-ai-consent", "p-ai-after-6500"]} bg="#05070D" labels={["1 · It reads the request", "2 · It makes a plan", "3 · It asks first", "4 · Done, with proof"]} />
);
export const DocLanguages: React.FC = () => (
  <Row shots={["p-home-hi", "p-home-bn", "p-home-ta", "p-home-mni", "p-home-ur"]} bg="#fff" labels={["Hindi", "Bengali", "Tamil", "Manipuri (Meetei Mayek)", "Urdu (right to left)"]} />
);
export const DocConsole: React.FC = () => (
  <AbsoluteFill style={{ background: "#EEF0F4", alignItems: "center", justifyContent: "center" }}>
    <Browser src="shots/d-console-case.png" width={2160} url="saathi · Department console · Nagar Nigam, Kanpur" />
  </AbsoluteFill>
);
