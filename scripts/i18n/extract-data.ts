/**
 * Collects every localized data string (objects shaped { en, hi, bn, ta })
 * reachable from the app's data modules and writes the unique English source
 * strings to scripts/i18n/data-source.json. Translation overlays for further
 * languages are keyed by that English text (see lib/i18n/dataDictionary.ts).
 *   npx vite-node scripts/i18n/extract-data.ts
 */
import { writeFileSync } from "node:fs";

import * as agentMissions from "@/lib/agent/missions";
import { getApplyFlow } from "@/lib/applyFlows";
import * as cases from "@/lib/console/cases";
import * as departments from "@/lib/console/departments";
import * as operations from "@/lib/console/operations";
import * as reasons from "@/lib/console/reasons";
import * as challans from "@/lib/data/challans";
import * as inbox from "@/lib/data/inbox";
import * as notifications from "@/lib/data/notifications";
import * as nudges from "@/lib/data/nudges";
import * as privacy from "@/lib/data/privacy";
import * as wallet from "@/lib/data/wallet";
import * as mock from "@/lib/mockData";
import { buildTimeline } from "@/lib/timeline";

const found = new Map<string, number>();
const seen = new WeakSet<object>();

function isL(v: unknown): v is Record<string, string> {
  return !!v && typeof v === "object" && !Array.isArray(v) && typeof (v as Record<string, unknown>).en === "string" && typeof (v as Record<string, unknown>).hi === "string";
}

function walk(v: unknown, depth = 0) {
  if (!v || typeof v !== "object" || depth > 12) return;
  if (seen.has(v as object)) return;
  seen.add(v as object);
  if (isL(v)) {
    const en = (v as Record<string, string>).en;
    found.set(en, (found.get(en) ?? 0) + 1);
    return;
  }
  if (Array.isArray(v)) v.forEach((x) => walk(x, depth + 1));
  else Object.values(v as object).forEach((x) => walk(x, depth + 1));
}

[mock, notifications, nudges, privacy, wallet, challans, departments, reasons, operations, agentMissions, inbox, cases].forEach((m) => walk(m));

// Values produced by functions.
const ids = [...mock.SERVICES.flatMap((s) => s.tasks.map((t) => t.id)), ...mock.SCHEMES.map((s) => s.id), "cert_birth"];
ids.forEach((id) => walk(getApplyFlow(id)));
departments.DEPARTMENTS.forEach((d) => {
  walk(operations.payments(d.id));
  walk(operations.dbtBatches(d.id));
  walk(operations.grievances(d.id));
});
walk(operations.jurisdictionChallans());
walk(nudges.buildNudges({ paidBills: [], submitted: [] }));
walk(nudges.buildNudges({ paidBills: ["taxes_property"], submitted: [] }));
mock.APPLICATIONS.forEach((a) => walk(buildTimeline(a, "en")));
const ctx = { paidBills: [], lifeContext: [], locale: "en" as const };
agentMissions.ALL_MISSIONS.forEach((m) => walk(agentMissions.buildMission(m, ctx, "hindi")));
walk(agentMissions.buildMission("tax", { ...ctx, paidBills: ["taxes_property"] }));
mock.SCHEMES.forEach((sc) => walk(agentMissions.buildMission("scheme", ctx, "", sc.id)));
mock.APPLICATIONS.forEach((a) => walk(agentMissions.buildMission("status", ctx, "", a.id)));

const list = Array.from(found.keys()).sort();
writeFileSync("scripts/i18n/data-source.json", JSON.stringify(list, null, 1) + "\n");
console.log(`unique strings: ${list.length}, chars: ${list.reduce((s, x) => s + x.length, 0)}`);
