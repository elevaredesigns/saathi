import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Phone } from "../parts";
import { arab, beng, C, clamp, deva, display, guru, inter, mlym, mtei, out, taml } from "../theme";

// The same home screen, captured in each language, with "Saathi" in that script.
const LANGS: { shot: string; word: string; font: string; name: string; rtl?: boolean }[] = [
  { shot: "p-home-hi", word: "साथी", font: deva, name: "Hindi" },
  { shot: "p-home-bn", word: "সাথী", font: beng, name: "Bengali" },
  { shot: "p-home-ta", word: "சாத்தி", font: taml, name: "Tamil" },
  { shot: "p-home-mni", word: "ꯁꯥꯊꯤ", font: mtei, name: "Manipuri · Meetei Mayek" },
  { shot: "p-home-ml", word: "സാഥി", font: mlym, name: "Malayalam" },
  { shot: "p-home-pa", word: "ਸਾਥੀ", font: guru, name: "Punjabi" },
  { shot: "p-home-ur", word: "ساتھی", font: arab, name: "Urdu · right to left", rtl: true },
];
const STEP = 26;
const START = 24;

/** Every screen in 23 languages — the same app, switching scripts. */
export const S5Languages: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#fff" }}>
      <div style={{ position: "absolute", left: 1080, top: 70, translate: interpolate(f, [0, 30], ["0px 40px", "0px 0px"], { ...clamp, easing: out }), opacity: interpolate(f, [0, 12], [0, 1], clamp) }}>
        <Phone src="shots/p-home.png" width={440}>
          {LANGS.map((l, i) => (
            <Img key={l.shot} src={staticFile(`shots/${l.shot}.png`)} style={{ position: "absolute", inset: 0, width: "100%", opacity: interpolate(f, [START + i * STEP, START + i * STEP + 6], [0, 1], clamp) }} />
          ))}
        </Phone>
      </div>

      <div style={{ position: "absolute", left: 160, top: 200, width: 880 }}>
        <div style={{ ...display, fontSize: 120 }}>
          <span style={{ opacity: interpolate(f, [4, 18], [0, 1], clamp) }}>It speaks</span>
          <br />
          <span style={{ opacity: interpolate(f, [10, 24], [0, 1], clamp) }}>your language.</span>
        </div>

        {/* the word "Saathi" changing script, in step with the phone */}
        <div style={{ position: "relative", height: 210, marginTop: 40 }}>
          {LANGS.map((l, i) => {
            const a = START + i * STEP;
            const isLast = i === LANGS.length - 1;
            return (
              <div
                key={l.word}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  opacity: interpolate(f, isLast ? [a, a + 6] : [a, a + 6, a + STEP - 4, a + STEP], isLast ? [0, 1] : [0, 1, 1, 0], clamp),
                  translate: interpolate(f, [a, a + 14], ["0px 30px", "0px 0px"], { ...clamp, easing: out }),
                }}
              >
                <div style={{ fontFamily: l.font, fontWeight: 600, fontSize: 156, lineHeight: 1.15, color: C.navy, direction: l.rtl ? "rtl" : "ltr" }}>{l.word}</div>
                <div style={{ fontFamily: inter, fontSize: 30, fontWeight: 500, color: C.ink3, marginTop: 4 }}>{l.name}</div>
              </div>
            );
          })}
        </div>

        <div style={{ fontFamily: inter, fontSize: 46, fontWeight: 500, color: C.ink2, marginTop: 50, letterSpacing: "-0.015em", lineHeight: 1.3, opacity: interpolate(f, [58, 74], [0, 1], clamp) }}>
          English and all 22 languages of the Eighth Schedule.
          <br />
          <span style={{ color: C.ink3 }}>Twelve scripts. Voice on every field.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
