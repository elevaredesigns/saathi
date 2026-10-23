/**
 * A QR-*looking* matrix for illustration (finder + timing patterns, seeded
 * modules). It encodes nothing and is always labelled "Sample" in the UI —
 * a prototype must never show a scannable identity code.
 */
import { mulberry32 } from "./random";

export function sampleQrMatrix(seed: number, size = 25): boolean[][] {
  const rand = mulberry32(seed);
  const m: boolean[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => rand() > 0.52));

  const finder = (r0: number, c0: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = r0 + r;
        const cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        const ring = r === 0 || r === 6 || c === 0 || c === 6;
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const inside = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        m[rr][cc] = inside && (ring || core);
      }
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    m[6][i] = i % 2 === 0;
    m[i][6] = i % 2 === 0;
  }
  return m;
}
