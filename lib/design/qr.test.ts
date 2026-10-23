import { describe, expect, it } from "vitest";
import { sampleQrMatrix } from "./qr";

describe("sampleQrMatrix", () => {
  it("is square, deterministic and seed-sensitive", () => {
    const a = sampleQrMatrix(7);
    expect(a).toHaveLength(25);
    a.forEach((row) => expect(row).toHaveLength(25));
    expect(sampleQrMatrix(7)).toEqual(a);
    expect(sampleQrMatrix(8)).not.toEqual(a);
  });

  it("draws the three finder patterns (dark ring, light gap, dark core)", () => {
    const m = sampleQrMatrix(3);
    for (const [r0, c0] of [
      [0, 0],
      [0, 18],
      [18, 0],
    ]) {
      expect(m[r0][c0]).toBe(true); // outer ring
      expect(m[r0 + 1][c0 + 1]).toBe(false); // gap
      expect(m[r0 + 3][c0 + 3]).toBe(true); // core
    }
  });
});
