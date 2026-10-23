import { describe, expect, it } from "vitest";
import { rosettePath, waveBandPaths } from "./guilloche";

const nums = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe("guilloche", () => {
  it("rosette is a finite closed path within its radius", () => {
    const d = rosettePath({ cx: 100, cy: 100, R: 60, r: 22, d: 30, steps: 1200 });
    expect(d.startsWith("M")).toBe(true);
    expect(d.trim().endsWith("Z")).toBe(true);
    const n = nums(d);
    n.forEach((v) => expect(Number.isFinite(v)).toBe(true));
    const xs = n.filter((_, i) => i % 2 === 0);
    const ys = n.filter((_, i) => i % 2 === 1);
    const maxR = Math.max(...xs.map((x, i) => Math.hypot(x - 100, ys[i] - 100)));
    expect(maxR).toBeLessThanOrEqual(60 - 22 + 30 + 0.1);
  });

  it("wave band returns one path per line spanning the width", () => {
    const paths = waveBandPaths({ width: 300, height: 80, lines: 9, amplitude: 10, frequency: 3, phaseStep: 0.4, steps: 60 });
    expect(paths).toHaveLength(9);
    for (const p of paths) {
      const n = nums(p);
      expect(n[0]).toBe(0);
      expect(n[n.length - 2]).toBeCloseTo(300, 1);
      n.forEach((v) => expect(Number.isFinite(v)).toBe(true));
    }
  });
});
