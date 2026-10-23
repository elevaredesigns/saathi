/**
 * Guilloche — the fine interlaced linework printed on banknotes, passports and
 * certificates to make them hard to forge. In Saathi it signals "this is an
 * official, verified object" on identity cards, receipts and trust surfaces.
 */

/** A tenth of a unit is finer than a device pixel at any size these patterns are drawn. */
const round = (v: number) => Math.round(v * 10) / 10;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/** Hypotrochoid rosette (spirograph). R, r are rounded to integers for closure. */
export function rosettePath({
  cx,
  cy,
  R,
  r,
  d,
  steps = 1400,
}: {
  cx: number;
  cy: number;
  R: number;
  r: number;
  d: number;
  steps?: number;
}): string {
  const Ri = Math.max(1, Math.round(R));
  const ri = Math.max(1, Math.round(r));
  const turns = ri / gcd(Ri, ri);
  const k = (Ri - ri) / ri;
  const total = Math.PI * 2 * turns;

  let path = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * total;
    const x = cx + (Ri - ri) * Math.cos(t) + d * Math.cos(k * t);
    const y = cy + (Ri - ri) * Math.sin(t) - d * Math.sin(k * t);
    // After the first "L", further coordinate pairs are implicit line-tos — no need to repeat it.
    path += `${i === 0 ? "M" : i === 1 ? " L" : " "}${round(x)} ${round(y)}`;
  }
  return `${path} Z`;
}

/** A band of phase-shifted waves whose overlap forms a moiré ribbon. */
export function waveBandPaths({
  width,
  height,
  lines,
  amplitude,
  frequency,
  phaseStep,
  steps = 120,
}: {
  width: number;
  height: number;
  lines: number;
  amplitude: number;
  frequency: number;
  phaseStep: number;
  steps?: number;
}): string[] {
  const paths: string[] = [];
  const mid = height / 2;
  for (let l = 0; l < lines; l++) {
    const phase = l * phaseStep;
    const spread = (l - (lines - 1) / 2) * (height / (lines * 2.2));
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const a = (x / width) * Math.PI * 2 * frequency;
      const y = mid + spread * Math.cos(a * 0.5 + phase) + amplitude * (0.72 * Math.sin(a + phase) + 0.28 * Math.sin(2.3 * a - phase));
      d += `${i === 0 ? "M" : i === 1 ? " L" : " "}${round(x)} ${round(y)}`;
    }
    paths.push(d);
  }
  return paths;
}
