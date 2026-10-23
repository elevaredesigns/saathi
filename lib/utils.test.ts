import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("keeps custom font sizes next to text colours", () => {
    expect(cn("text-h1 text-ink")).toBe("text-h1 text-ink");
    expect(cn("text-body text-navy-600")).toBe("text-body text-navy-600");
  });
  it("still resolves conflicts within a group", () => {
    expect(cn("text-h1", "text-h2")).toBe("text-h2");
    expect(cn("text-ink", "text-ink-2")).toBe("text-ink-2");
    expect(cn("shadow-soft", "shadow-lift")).toBe("shadow-lift");
  });
});
