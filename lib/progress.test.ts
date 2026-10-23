import { describe, expect, it } from "vitest";
import { stageProgress } from "./progress";

describe("stageProgress", () => {
  it("maps statuses onto the five stages", () => {
    expect(stageProgress("submitted")).toEqual({ index: 1, total: 5, fraction: 0.2 });
    expect(stageProgress("inProgress").index).toBe(2);
    expect(stageProgress("approved").index).toBe(4);
    expect(stageProgress("ready")).toEqual({ index: 5, total: 5, fraction: 1 });
  });
});
