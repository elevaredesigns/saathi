import { describe, expect, it } from "vitest";
import { contrastRatio, hexToRgb, relativeLuminance } from "./contrast";
import { palette, textPairs } from "./tokens";

describe("contrast", () => {
  it("parses 3- and 6-digit hex", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
    expect(hexToRgb("#1F43B8")).toEqual([31, 67, 184]);
  });
  it("matches WCAG reference values", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#FFFFFF")).toBe(1);
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 5);
    expect(contrastRatio("#777777", "#FFFFFF")).toBeCloseTo(4.48, 1);
  });
  it("base is pure white", () => {
    expect(palette.base).toBe("#FFFFFF");
  });
  it.each(textPairs)("$name ≥ $min:1", ({ fg, bg, min }) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
  it("saffron-500 is not a legal text colour on white", () => {
    expect(contrastRatio(palette.saffron[500], palette.base)).toBeLessThan(4.5);
  });
});
