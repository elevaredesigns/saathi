import { describe, expect, it } from "vitest";
import { generateKolam } from "./kolam";
import { mulberry32 } from "./random";

const nums = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe("mulberry32", () => {
  it("is deterministic and in range", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 50; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});

describe("generateKolam", () => {
  it("is deterministic for a seed", () => {
    expect(generateKolam({ cols: 6, rows: 4, seed: 7 })).toEqual(generateKolam({ cols: 6, rows: 4, seed: 7 }));
  });

  it("changes with the seed", () => {
    expect(generateKolam({ cols: 6, rows: 6, seed: 1, density: 0.5 }).loops).not.toEqual(
      generateKolam({ cols: 6, rows: 6, seed: 2, density: 0.5 }).loops,
    );
  });

  it("uses every segment exactly once", () => {
    const k = generateKolam({ cols: 7, rows: 5, seed: 3, density: 0.4 });
    expect(k.segmentCount).toBe(4 * 7 * 5);
    expect(k.traversed).toBe(k.segmentCount);
  });

  it("emits closed, finite, in-bounds loops and one dot per cell", () => {
    const k = generateKolam({ cols: 5, rows: 5, cell: 40, seed: 9, symmetry: "mirror" });
    expect(k.width).toBe(200);
    expect(k.height).toBe(200);
    expect(k.dots).toHaveLength(25);
    expect(k.loops.length).toBeGreaterThan(0);
    for (const d of k.loops) {
      expect(d.startsWith("M")).toBe(true);
      expect(d.trim().endsWith("Z")).toBe(true);
      for (const n of nums(d)) {
        expect(Number.isFinite(n)).toBe(true);
        expect(n).toBeGreaterThanOrEqual(0);
        expect(n).toBeLessThanOrEqual(200);
      }
    }
  });

  it("density 0 on a 1×1 grid is a single loop", () => {
    expect(generateKolam({ cols: 1, rows: 1, density: 0 }).loops).toHaveLength(1);
  });
});
