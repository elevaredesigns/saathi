import React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { staticFile } from "remotion";
import { fade } from "@remotion/transitions/fade";
import { S1Apps } from "./scenes/S1Apps";
import { S2Title } from "./scenes/S2Title";
import { S3Home } from "./scenes/S3Home";
import { S4AI } from "./scenes/S4AI";
import { S5Languages } from "./scenes/S5Languages";
import { S6Schemes } from "./scenes/S6Schemes";
import { S7Trust } from "./scenes/S7Trust";
import { S8Console } from "./scenes/S8Console";
import { S9Scale } from "./scenes/S9Scale";
import { S10Outro } from "./scenes/S10Outro";

export const SCENES = [
  { id: "Apps", component: S1Apps, frames: 150 },
  { id: "Title", component: S2Title, frames: 120 },
  { id: "Home", component: S3Home, frames: 165 },
  { id: "AI", component: S4AI, frames: 270 },
  { id: "Languages", component: S5Languages, frames: 220 },
  { id: "Schemes", component: S6Schemes, frames: 160 },
  { id: "Trust", component: S7Trust, frames: 150 },
  { id: "Console", component: S8Console, frames: 165 },
  { id: "Scale", component: S9Scale, frames: 180 },
  { id: "Outro", component: S10Outro, frames: 160 },
] as const;

export const FADE = 15;
export const FILM_FRAMES = SCENES.reduce((n, s) => n + s.frames, 0) - FADE * (SCENES.length - 1);

/** Saathi — the product film. */
export const SaathiFilm: React.FC = () => {
  return (
    <>
    <Audio src={staticFile("music.wav")} />
    <TransitionSeries>
      {SCENES.map((s, i) => (
        <React.Fragment key={s.id}>
          {i > 0 && <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />}
          <TransitionSeries.Sequence durationInFrames={s.frames} name={s.id}>
            <s.component />
          </TransitionSeries.Sequence>
        </React.Fragment>
      ))}
    </TransitionSeries>
    </>
  );
};
