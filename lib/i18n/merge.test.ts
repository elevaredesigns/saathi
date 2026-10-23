import { describe, expect, it } from "vitest";
import { deepMerge } from "./merge";

describe("deepMerge", () => {
  it("fills missing nested keys from base", () => {
    expect(deepMerge({ a: { b: "en", c: "en" } }, { a: { b: "hi" } })).toEqual({ a: { b: "hi", c: "en" } });
  });
  it("replaces arrays and scalars wholesale", () => {
    expect(deepMerge({ a: [1, 2, 3], s: "x" }, { a: [9], s: "y" })).toEqual({ a: [9], s: "y" });
  });
  it("ignores undefined overrides and does not mutate inputs", () => {
    const base = { a: { b: 1 } };
    const out = deepMerge(base, { a: undefined });
    expect(out).toEqual({ a: { b: 1 } });
    expect(out).not.toBe(base);
  });
});
