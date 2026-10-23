// Original score for the Saathi film, synthesised from scratch (no samples, no
// licensing). Timed to the cut: drone + riser into the logo impact at 4.5 s,
// piano arpeggio over pads, a soft beat from Saathi AI (13 s), the build at
// Scale (42.7 s), and a resolve on the outro (48.2 s). Writes public/music.wav.
import { writeFileSync } from "node:fs";

const SR = 48000;
const DUR = 53.5;
const N = Math.floor(SR * DUR);
const L = new Float32Array(N);
const R = new Float32Array(N);
const sendL = new Float32Array(N); // reverb send
const sendR = new Float32Array(N);

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const T = {
  impact: 4.5,
  ai: 13.0,
  lang: 21.5,
  scale: 42.67,
  outro: 48.17,
};
const BPM = 84;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

// I–V–vi–IV in D major
const CHORDS = [
  { bass: 38, pad: [50, 57, 62, 66], arp: [62, 66, 69, 74] }, // D
  { bass: 33, pad: [45, 52, 57, 61], arp: [61, 64, 69, 73] }, // A
  { bass: 35, pad: [47, 54, 59, 62], arp: [62, 66, 71, 74] }, // Bm
  { bass: 31, pad: [43, 50, 55, 59], arp: [62, 67, 71, 74] }, // G
];

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function add(i, l, r, send = 0) {
  if (i < 0 || i >= N) return;
  L[i] += l;
  R[i] += r;
  sendL[i] += l * send;
  sendR[i] += r * send;
}

/** Soft piano: decaying harmonics with a gentle hammer. */
function piano(t0, m, vel, pan = 0, len = 3.2) {
  const f = midi(m);
  const start = Math.floor(t0 * SR);
  const n = Math.floor(len * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const att = Math.min(1, t / 0.004);
    let s = 0;
    for (let h = 1; h <= 6; h++) {
      const fh = f * h * (1 + 0.0004 * h * h);
      s += (Math.sin(2 * Math.PI * fh * t) / Math.pow(h, 1.6)) * Math.exp(-t * (1.1 + h * 0.9));
    }
    const rel = k > n - 2400 ? (n - k) / 2400 : 1;
    const v = s * att * rel * vel * 0.22;
    add(start + k, v * gl, v * gr, 0.55);
  }
}

/** Warm pad: detuned soft saws through a one-pole low-pass, slow swell. */
function pad(t0, t1, notes, vel, cutoff = 1400, attack = 1.4, release = 1.8) {
  const start = Math.floor(t0 * SR);
  const n = Math.floor((t1 - t0 + release) * SR);
  const a = Math.exp((-2 * Math.PI * cutoff) / SR);
  const state = notes.map(() => [0, 0]);
  for (let k = 0; k < n; k++) {
    const t = k / SR;
    const env = Math.min(1, t / attack) * (t > t1 - t0 ? Math.max(0, 1 - (t - (t1 - t0)) / release) : 1);
    if (env <= 0) continue;
    let sl = 0;
    let sr = 0;
    notes.forEach((m, j) => {
      const f = midi(m);
      for (const [d, side] of [[-0.12, 0], [0.11, 1]]) {
        const fd = f * Math.pow(2, d / 12);
        let saw = 0;
        for (let h = 1; h <= 7; h++) saw += Math.sin(2 * Math.PI * fd * h * t + j) / h;
        const st = state[j];
        st[side] = st[side] * a + saw * (1 - a);
        if (side === 0) sl += st[side];
        else sr += st[side];
      }
    });
    const v = env * vel * 0.05;
    add(start + k, sl * v, sr * v, 0.7);
  }
}

function kick(t0, vel) {
  const start = Math.floor(t0 * SR);
  let ph = 0;
  for (let k = 0; k < SR * 0.45; k++) {
    const t = k / SR;
    const f = 44 + 90 * Math.exp(-t * 32);
    ph += (2 * Math.PI * f) / SR;
    const v = Math.sin(ph) * Math.exp(-t * 7) * vel * 0.55;
    add(start + k, v, v, 0.05);
  }
}

function hat(t0, vel, pan = 0.3) {
  const start = Math.floor(t0 * SR);
  let prev = 0;
  for (let k = 0; k < SR * 0.06; k++) {
    const t = k / SR;
    const w = rnd();
    const hp = w - prev; // crude high-pass
    prev = w;
    const v = hp * Math.exp(-t * 70) * vel * 0.05;
    add(start + k, v * (1 - pan), v * (1 + pan), 0.2);
  }
}

/** Filtered-noise swell rising into a hit. */
function riser(t0, t1, vel) {
  const start = Math.floor(t0 * SR);
  const n = Math.floor((t1 - t0) * SR);
  let lp = 0;
  for (let k = 0; k < n; k++) {
    const p = k / n;
    const cutoff = 300 + 6000 * p * p;
    const a = Math.exp((-2 * Math.PI * cutoff) / SR);
    lp = lp * a + rnd() * (1 - a);
    const v = lp * Math.pow(p, 2.2) * vel * 0.9;
    add(start + k, v * (1 - 0.3 * Math.sin(p * 9)), v * (1 + 0.3 * Math.sin(p * 9)), 0.8);
  }
}

/** Impact: sub boom + a bright, slightly inharmonic bell over D. */
function impact(t0, vel) {
  const start = Math.floor(t0 * SR);
  let ph = 0;
  for (let k = 0; k < SR * 3.5; k++) {
    const t = k / SR;
    const f = 36 + 40 * Math.exp(-t * 9);
    ph += (2 * Math.PI * f) / SR;
    const boom = Math.sin(ph) * Math.exp(-t * 2.2) * 0.8;
    let bell = 0;
    for (const [mult, amp, dec] of [[1, 1, 1.4], [2.01, 0.5, 2], [3.02, 0.3, 2.8], [4.17, 0.18, 3.6], [5.43, 0.1, 4.5]]) {
      bell += Math.sin(2 * Math.PI * midi(74) * mult * t) * amp * Math.exp(-t * dec);
    }
    const v = (boom + bell * 0.25) * Math.min(1, t / 0.002) * vel;
    add(start + k, v, v, 0.9);
  }
}

// ---------------------------------------------------------------- arrangement
// Opening drone (A) under the flood of apps, swelling into the collapse.
pad(0.0, 4.35, [33, 45, 52], 0.9, 520, 2.2, 0.15);
riser(2.2, 4.47, 0.55);
impact(T.impact, 0.75);

// Progression from the reveal to the outro.
const startProg = T.impact;
for (let bar = 0; ; bar++) {
  const t = startProg + bar * BAR;
  if (t >= T.outro - 0.05) break;
  const ch = CHORDS[bar % 4];
  const tEnd = Math.min(t + BAR, T.outro);
  const lift = t >= T.scale ? 1.35 : t >= T.lang ? 1.1 : t >= T.ai ? 1.0 : 0.75;
  pad(t, tEnd, ch.pad, 0.75 * lift, t >= T.ai ? 1800 : 1200, 0.6, 1.2);
  piano(t, ch.bass + 12, 0.45 * lift, -0.1, BAR + 0.5); // left-hand root
  if (t >= T.ai) piano(t, ch.bass, 0.35 * lift, 0, BAR + 0.4); // low octave once the beat arrives

  // right-hand arpeggio
  const steps = t >= T.ai ? 8 : 4;
  const pattern = [0, 1, 2, 3, 2, 1, 2, 3];
  for (let s = 0; s < steps; s++) {
    const ts = t + (s * BAR) / steps;
    if (ts >= T.outro - 0.05) break;
    const m = ch.arp[pattern[s % pattern.length]] + (t >= T.scale && s % 2 === 1 ? 12 : 0);
    const vel = (s % 2 === 0 ? 0.62 : 0.45) * (t >= T.scale ? 1.15 : 1);
    piano(ts, m, vel, s % 2 ? 0.35 : -0.35, 2.4);
  }

  // drums
  for (let b = 0; b < 4; b++) {
    const tb = t + b * BEAT;
    if (tb >= T.outro - BEAT) break;
    if (t >= T.scale) kick(tb, 0.8);
    else if (t >= T.ai && (b === 0 || b === 2)) kick(tb, 0.6);
    if (t >= T.lang) {
      hat(tb + BEAT / 2, 0.8);
      if (t >= T.scale) hat(tb, 0.45, -0.3);
    }
  }
}

// Build into the outro, then resolve on D.
riser(T.outro - 2.2, T.outro - 0.02, 0.35);
impact(T.outro, 0.45);
pad(T.outro, DUR - 1.2, [38, 50, 57, 62, 66, 69], 0.9, 1500, 0.8, 1.2);
piano(T.outro, 74, 0.7, 0.2, 4.5);
piano(T.outro + 0.9, 69, 0.45, -0.3, 4.0);
piano(T.outro + 1.8, 78, 0.4, 0.3, 3.8);
piano(T.outro + 2.7, 74, 0.35, 0, 3.5);

// --------------------------------------------------------------- reverb bus
function reverb(inp, delays, apDelays, fb = 0.84, damp = 0.25) {
  const out = new Float32Array(N);
  for (const d of delays) {
    const buf = new Float32Array(d);
    let idx = 0;
    let lp = 0;
    for (let i = 0; i < N; i++) {
      const y = buf[idx];
      lp = y * (1 - damp) + lp * damp;
      buf[idx] = inp[i] + lp * fb;
      idx = (idx + 1) % d;
      out[i] += y;
    }
  }
  for (const d of apDelays) {
    const buf = new Float32Array(d);
    let idx = 0;
    for (let i = 0; i < N; i++) {
      const b = buf[idx];
      const x = out[i];
      buf[idx] = x + b * 0.5;
      out[i] = b - x * 0.5;
      idx = (idx + 1) % d;
    }
  }
  return out;
}
const rvL = reverb(sendL, [1557, 1617, 1491, 1422, 1277, 1356], [225, 556, 441]);
const rvR = reverb(sendR, [1580, 1640, 1514, 1445, 1300, 1379], [248, 579, 464]);

// ------------------------------------------------------------------- master
const out = new Int16Array(N * 2);
let peak = 0;
const mix = (i, dry, wet) => Math.tanh((dry + wet * 0.14) * 1.1);
const ML = new Float32Array(N);
const MR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fadeIn = Math.min(1, t / 0.4);
  const fadeOut = Math.min(1, (DUR - t) / 2.2);
  ML[i] = mix(i, L[i], rvL[i]) * fadeIn * fadeOut;
  MR[i] = mix(i, R[i], rvR[i]) * fadeIn * fadeOut;
  peak = Math.max(peak, Math.abs(ML[i]), Math.abs(MR[i]));
}
const gain = 0.85 / peak; // -1.4 dBFS peak
let sumSq = 0;
for (let i = 0; i < N; i++) {
  const l = ML[i] * gain;
  const r = MR[i] * gain;
  sumSq += l * l + r * r;
  out[i * 2] = Math.round(l * 32767);
  out[i * 2 + 1] = Math.round(r * 32767);
}
const rms = Math.sqrt(sumSq / (N * 2));

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + out.byteLength, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(out.byteLength, 40);
writeFileSync(new URL("../public/music.wav", import.meta.url), Buffer.concat([header, Buffer.from(out.buffer)]));
console.log(`music.wav  ${DUR}s  peak ${(20 * Math.log10(0.85)).toFixed(1)} dBFS  rms ${(20 * Math.log10(rms)).toFixed(1)} dBFS`);
