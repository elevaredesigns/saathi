import { describe, expect, it } from "vitest";
import { search } from "./search";

describe("search", () => {
  it("returns nothing for an empty query", () => {
    expect(search("  ", "en")).toEqual([]);
  });
  it("finds tasks and routes them to the apply flow", () => {
    const hit = search("property tax", "en").find((h) => h.kind === "task");
    expect(hit?.href).toBe("/prototype/apply/?id=taxes_property");
  });
  it("finds schemes by their English name from a Hindi UI", () => {
    expect(search("kisan", "hi").some((h) => h.kind === "scheme" && h.id === "pmkisan")).toBe(true);
  });
  it("matches native-script queries and returns native titles", () => {
    const hits = search("जन्म", "hi");
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].title).toMatch(/जन्म/);
  });
  it("keeps digits and every letter in queries (only diacritics are stripped)", () => {
    expect(search("file income", "en").some((h) => h.id === "taxes_income")).toBe(true);
    expect(search("rsum", "en")).toEqual([]);
  });
  it("respects the limit", () => {
    expect(search("a", "en", 3)).toHaveLength(3);
  });
});
