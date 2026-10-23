import { describe, expect, it } from "vitest";
import { buildNudges } from "./nudges";

describe("buildNudges", () => {
  it("asks to pay property tax until it is paid", () => {
    expect(buildNudges({ paidBills: [], submitted: [] }).some((n) => n.id === "tax_due")).toBe(true);
    expect(buildNudges({ paidBills: ["taxes_property"], submitted: [] }).some((n) => n.id === "tax_due")).toBe(false);
  });
  it("every nudge deep-links into the prototype", () => {
    for (const n of buildNudges({ paidBills: [], submitted: [] })) expect(n.href.startsWith("/prototype/")).toBe(true);
  });
});
