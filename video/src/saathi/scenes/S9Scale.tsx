import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Mark } from "../parts";
import { clamp, display, inter, out } from "../theme";

const LANES = ["Certificates", "Land & farming", "Taxes & bills", "Transport", "Exams & results", "Health"];
const HOT = 4; // exam-result day: the rush goes to one lane
const APP = { x: 300, y: 640 };
const ROUTER = { x: 720, y: 640 };
const LANE_X = 1180;
const laneY = (i: number) => 400 + i * 96;

/** One front door, a separate room for every service — the 30 lakh answer, drawn. */
export const S9Scale: React.FC = () => {
  const f = useCurrentFrame();
  const grow = interpolate(f, [70, 120], [0, 1], { ...clamp, easing: out });

  const dot = (x1: number, y1: number, x2: number, y2: number, t: number, color: string, r: number, key: string) => {
    const p = ((t % 1) + 1) % 1;
    return <circle key={key} cx={x1 + (x2 - x1) * p} cy={y1 + (y2 - y1) * p} r={r} fill={color} opacity={Math.min(1, p * 6, (1 - p) * 6)} />;
  };

  return (
    <AbsoluteFill style={{ background: "#05070D" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}>
        <div style={{ ...display, color: "#fff", fontSize: 100, opacity: interpolate(f, [0, 14], [0, 1], clamp), translate: interpolate(f, [0, 24], ["0px 24px", "0px 0px"], { ...clamp, easing: out }) }}>
          Built for 30 lakh people at once.
        </div>
        <div style={{ fontFamily: inter, fontSize: 44, fontWeight: 500, color: "rgba(255,255,255,0.6)", marginTop: 18, letterSpacing: "-0.015em", opacity: interpolate(f, [18, 32], [0, 1], clamp) }}>
          One front door. A separate room for every service.
        </div>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={APP.x + 70} y1={APP.y} x2={ROUTER.x - 50} y2={ROUTER.y} stroke="#6B4A1F" strokeWidth={5} strokeLinecap="round" opacity={interpolate(f, [20, 34], [0, 1], clamp)} />
        {LANES.map((_, i) => (
          <line key={i} x1={ROUTER.x + 50} y1={ROUTER.y} x2={LANE_X - 10} y2={laneY(i)} stroke={i === HOT ? "#8A5A22" : "#26345F"} strokeWidth={i === HOT ? 2 + grow * 9 : 2} strokeLinecap="round" opacity={interpolate(f, [28 + i * 3, 40 + i * 3], [0, 1], clamp)} />
        ))}
        {f > 34 &&
          Array.from({ length: 10 }, (_, k) => dot(APP.x + 70, APP.y, ROUTER.x - 50, ROUTER.y, f / 28 + k / 10, "#FF8A1F", 6, `a${k}`))}
        {f > 44 &&
          LANES.map((_, i) => {
            const n = i === HOT ? Math.round(2 + grow * 10) : 2;
            return Array.from({ length: n }, (_, k) => dot(ROUTER.x + 50, ROUTER.y, LANE_X - 10, laneY(i), f / 34 + k / n + i * 0.13, i === HOT ? "#FF8A1F" : "#5577E0", 5.5, `l${i}-${k}`));
          })}
      </svg>

      {/* the app and the router */}
      <div style={{ position: "absolute", left: APP.x - 70, top: APP.y - 70, width: 140, height: 140, borderRadius: 38, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", scale: interpolate(f, [12, 30], [0.6, 1], { ...clamp, easing: out }), opacity: interpolate(f, [12, 22], [0, 1], clamp) }}>
        <Mark size={84} start={12} />
      </div>
      <div style={{ position: "absolute", left: APP.x - 140, top: APP.y + 90, width: 280, textAlign: "center", fontFamily: inter, fontSize: 28, fontWeight: 600, color: "#fff", opacity: interpolate(f, [22, 34], [0, 1], clamp) }}>One Saathi app</div>
      <div style={{ position: "absolute", left: ROUTER.x - 50, top: ROUTER.y - 50, width: 100, height: 100, borderRadius: 99, background: "#1F43B8", boxShadow: "0 0 60px rgba(47,85,212,0.6)", opacity: interpolate(f, [22, 32], [0, 1], clamp) }} />
      <div style={{ position: "absolute", left: ROUTER.x - 140, top: ROUTER.y + 70, width: 280, textAlign: "center", fontFamily: inter, fontSize: 28, fontWeight: 600, color: "#fff", opacity: interpolate(f, [26, 38], [0, 1], clamp) }}>Smart router</div>

      {/* one room per service */}
      {LANES.map((name, i) => {
        const hot = i === HOT;
        const servers = hot ? Math.round(6 + grow * 58) : 6;
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: LANE_X,
              top: laneY(i) - 38,
              width: 520,
              height: 76,
              borderRadius: 18,
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: hot ? `rgba(255,138,31,${0.08 + grow * 0.14})` : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${hot ? `rgba(255,162,76,${0.3 + grow * 0.5})` : "rgba(255,255,255,0.12)"}`,
              opacity: interpolate(f, [32 + i * 4, 44 + i * 4], [0, 1], clamp),
              translate: interpolate(f, [32 + i * 4, 52 + i * 4], ["30px 0px", "0px 0px"], { ...clamp, easing: out }),
            }}
          >
            <span style={{ fontFamily: inter, fontSize: 30, fontWeight: 600, color: "#fff" }}>{name}</span>
            <span style={{ fontFamily: inter, fontSize: 26, fontWeight: 600, color: hot ? "#FFB066" : "rgba(255,255,255,0.55)", fontVariantNumeric: "tabular-nums" }}>{servers} servers</span>
          </div>
        );
      })}

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, textAlign: "center", fontFamily: inter, fontSize: 42, fontWeight: 500, color: "rgba(255,255,255,0.8)", letterSpacing: "-0.012em", opacity: interpolate(f, [108, 124], [0, 1], clamp) }}>
        Exam-result rush? That room grows on its own. Every other service stays fast.
      </div>
    </AbsoluteFill>
  );
};
