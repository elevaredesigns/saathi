import { describe, expect, it } from "vitest";

import { getApplyFlow } from "@/lib/applyFlows";
import { reducer as protoReducer, INITIAL as PROTO_INITIAL } from "@/lib/context/PrototypeContext";
import { SCHEMES, SERVICES } from "@/lib/mockData";
import { liveCases, OPEN_STAGES, sampleCases, slaLeft, STAGE_FROM_STATUS, STATUS_FROM_STAGE } from "./cases";
import { DEPARTMENTS, departmentFor } from "./departments";
import { jurisdictionChallans, payments } from "./operations";
import { consoleReducer } from "./store";

const ALL_SERVICE_IDS = [...SERVICES.flatMap((s) => s.tasks.map((t) => t.id)), ...SCHEMES.map((s) => s.id)];

describe("department coverage", () => {
  it("every task and scheme belongs to exactly one department", () => {
    for (const id of ALL_SERVICE_IDS) {
      const owners = DEPARTMENTS.filter((d) => d.services.includes(id));
      expect(owners.map((d) => d.id), id).toHaveLength(1);
    }
  });

  it("departments only list services that exist", () => {
    for (const d of DEPARTMENTS) for (const id of d.services) expect(ALL_SERVICE_IDS, `${d.id}:${id}`).toContain(id);
  });

  it("every department has an overview and an audit trail", () => {
    for (const d of DEPARTMENTS) {
      expect(d.modules[0]).toBe("overview");
      expect(d.modules).toContain("audit");
    }
  });

  it("routes contested challans to transport", () => {
    expect(departmentFor("transport_challan_contest")?.id).toBe("transport");
  });
});

describe("sample caseload", () => {
  it("is deterministic", () => {
    expect(sampleCases("municipal").map((c) => c.ref)).toEqual(sampleCases("municipal").map((c) => c.ref));
  });

  it("only queues services that need an officer's decision", () => {
    for (const d of DEPARTMENTS) {
      for (const c of sampleCases(d.id)) {
        expect(d.services).toContain(c.serviceId);
        expect(["apply", "renew", "register"]).toContain(getApplyFlow(c.serviceId).kind);
      }
    }
  });

  it("never exposes a full Aadhaar number", () => {
    for (const d of DEPARTMENTS) for (const c of sampleCases(d.id)) for (const f of c.fields) expect(f.value).not.toMatch(/\d{4}\s?\d{4}\s?\d{4}/);
  });

  it("counts SLA days from submission", () => {
    expect(slaLeft({ submittedAt: new Date(2026, 4, 20, 9).toISOString(), slaDays: 7 }, new Date(2026, 4, 24, 12))).toBe(3);
  });
});

describe("live cases from the prototype", () => {
  it("routes the citizen's birth certificate to the municipal console", () => {
    const apps = [{ id: "app_birth", service: { en: "Birth", hi: "", bn: "", ta: "" }, ref: "BC-1", date: "2026-05-18", status: "inProgress" as const }];
    const cases = liveCases("municipal", apps, { name: "Rakesh Verma", aadhaarLast4: "6721" });
    expect(cases).toHaveLength(1);
    expect(cases[0].live?.appId).toBe("app_birth");
    expect(liveCases("revenue", apps, { name: "", aadhaarLast4: "" })).toHaveLength(0);
  });

  it("ignores payments and downloads", () => {
    const apps = [{ id: "s1", service: { en: "Tax", hi: "", bn: "", ta: "" }, ref: "TXN-1", date: "2026-05-24", status: "ready" as const, flowId: "taxes_property" }];
    expect(liveCases("municipal", apps, { name: "", aadhaarLast4: "" })).toHaveLength(0);
  });

  it("maps stages and statuses both ways", () => {
    for (const stage of Object.keys(STATUS_FROM_STAGE) as (keyof typeof STATUS_FROM_STAGE)[]) {
      const back = STAGE_FROM_STATUS[STATUS_FROM_STAGE[stage]];
      if (!OPEN_STAGES.includes(stage)) expect(back).toBe(stage);
    }
  });

  it("an officer decision updates the citizen's application and is recorded once", () => {
    const submitted = { ...PROTO_INITIAL, submitted: [{ id: "s1", service: { en: "x", hi: "", bn: "", ta: "" }, ref: "R", date: "2026-05-24", status: "submitted" as const, flowId: "cert_income" }] };
    const event = { id: "e1", appId: "s1", ref: "R", service: submitted.submitted[0].service, action: "infoRequested" as const, officer: "S. Reddy", office: { en: "Tehsil", hi: "", bn: "", ta: "" }, at: "2026-05-24T10:00:00Z" };
    const once = protoReducer(submitted, { type: "OFFICER_EVENT", event, status: "actionNeeded" });
    const twice = protoReducer(once, { type: "OFFICER_EVENT", event, status: "actionNeeded" });
    expect(once.submitted[0].status).toBe("actionNeeded");
    expect(twice.officerEvents).toHaveLength(1);
  });

  it("ignores a repeated decision that changes nothing", () => {
    const base = { id: "a", appId: "app_birth", ref: "BC", service: { en: "x", hi: "", bn: "", ta: "" }, action: "approved" as const, officer: "Priya Nair", office: { en: "Nagar Nigam", hi: "", bn: "", ta: "" }, at: "2026-05-24T10:00:00Z" };
    const once = protoReducer(PROTO_INITIAL, { type: "OFFICER_EVENT", event: base, status: "approved" });
    const again = protoReducer(once, { type: "OFFICER_EVENT", event: { ...base, id: "b" }, status: "approved" });
    expect(again.officerEvents).toHaveLength(1);
  });

  it("decisions on built-in samples become status overrides", () => {
    const event = { id: "e2", appId: "app_birth", ref: "BC", service: { en: "x", hi: "", bn: "", ta: "" }, action: "approved" as const, officer: "Priya Nair", office: { en: "Nagar Nigam", hi: "", bn: "", ta: "" }, at: "2026-05-24T10:00:00Z" };
    const next = protoReducer(PROTO_INITIAL, { type: "OFFICER_EVENT", event, status: "approved" });
    expect(next.statusOverrides.app_birth).toBe("approved");
  });
});

describe("operations", () => {
  it("includes the citizen's own challans in the RTO's jurisdiction", () => {
    expect(jurisdictionChallans().filter((c) => c.live).length).toBeGreaterThan(0);
  });

  it("only revenue-collecting offices have a payments ledger", () => {
    for (const d of DEPARTMENTS) expect(payments(d.id).length > 0, d.id).toBe(d.modules.includes("payments"));
  });

  it("console reducer appends an audit entry with each audited patch", () => {
    const hydrated = consoleReducer({ hydrated: false } as never, { type: "HYDRATE", payload: {} });
    const next = consoleReducer(hydrated, { type: "PATCH", patch: () => ({ refunds: ["T1"] }), audit: { deptId: "municipal", kind: "refund", subject: "T1", officer: "Priya Nair" } });
    expect(next.refunds).toEqual(["T1"]);
    expect(next.audit[0].kind).toBe("refund");
  });
});
