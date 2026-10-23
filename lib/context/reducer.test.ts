import { describe, expect, it } from "vitest";
import { INITIAL, reducer } from "./PrototypeContext";

describe("prototype reducer", () => {
  it("marks bills paid once", () => {
    const s1 = reducer(INITIAL, { type: "MARK_BILL_PAID", id: "taxes_property" });
    const s2 = reducer(s1, { type: "MARK_BILL_PAID", id: "taxes_property" });
    expect(s2.paidBills).toEqual(["taxes_property"]);
  });
  it("toggles consent revocation", () => {
    const s1 = reducer(INITIAL, { type: "TOGGLE_CONSENT", id: "c_digilocker" });
    expect(s1.revokedConsents).toContain("c_digilocker");
    expect(reducer(s1, { type: "TOGGLE_CONSENT", id: "c_digilocker" }).revokedConsents).not.toContain("c_digilocker");
  });
  it("hydrates old persisted state without the new fields", () => {
    const s = reducer(INITIAL, { type: "HYDRATE", payload: { onboarded: true } });
    expect(s.paidBills).toEqual([]);
    expect(s.revokedConsents).toEqual([]);
    expect(s.readNotifications).toEqual([]);
    expect(s.hydrated).toBe(true);
  });
});
