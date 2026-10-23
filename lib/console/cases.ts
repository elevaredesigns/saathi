/**
 * Case files for a department console. Sample cases are generated
 * deterministically per department (same seed → same queue on every load);
 * the citizen's own prototype applications are merged in as live cases whose
 * stage is read from — and written back to — the prototype's shared state.
 */
import { getApplyFlow, type ApplyKind } from "@/lib/applyFlows";
import type { SubmittedApplication } from "@/lib/context/PrototypeContext";
import { mulberry32 } from "@/lib/design/random";
import { APPLICATIONS, getScheme, getTask, type AppStatus, type L } from "@/lib/mockData";
import { PROTOTYPE_TODAY } from "@/lib/utils/dateUtils";
import { DEPARTMENTS, departmentFor, type Department, type DeptId } from "./departments";
import type { FlagId } from "./reasons";

export type CaseStage = "new" | "docCheck" | "verification" | "decision" | "infoRequested" | "approved" | "issued" | "rejected";

export const OPEN_STAGES: CaseStage[] = ["new", "docCheck", "verification", "decision"];

export interface CaseDocument {
  name: L;
  source: "digilocker" | "upload";
}

export interface Applicant {
  name: string;
  gender: "F" | "M";
  age: number;
  locality: string;
  aadhaarLast4: string;
  mobileLast4: string;
}

export interface ConsoleCase {
  id: string;
  ref: string;
  deptId: DeptId;
  serviceId: string;
  service: L;
  kind: ApplyKind;
  applicant: Applicant;
  submittedAt: string;
  /** Service-level time limit in days (Right to Services style). */
  slaDays: number;
  stage: CaseStage;
  flags: FlagId[];
  documents: CaseDocument[];
  fields: { label: L; value: string }[];
  fee?: string;
  channel: "saathi" | "csc" | "portal";
  /** Present when this case is the citizen's own application in the prototype. */
  live?: { appId: string };
}

const FIRST_F = ["Aarti", "Neha", "Pooja", "Shabana", "Kavya", "Ritu", "Anjali", "Sneha", "Farzana", "Divya", "Lakshmi", "Meenakshi", "Rekha", "Gurpreet", "Sunita", "Nazia", "Priyanka", "Bhavna"];
const FIRST_M = ["Amit", "Rahul", "Mohammed", "Suresh", "Arvind", "Deepak", "Imran", "Karan", "Manoj", "Harish", "Sanjay", "Ravi", "Abdul", "Vijay", "Gaurav", "Joseph", "Naveen", "Tarun"];
const LAST = ["Sharma", "Yadav", "Khan", "Gupta", "Mishra", "Verma", "Singh", "Ansari", "Tiwari", "Pandey", "Srivastava", "Chauhan", "Qureshi", "Nigam", "Awasthi", "Dixit", "Rathore", "Saxena"];
const LOCALITIES = ["Kidwai Nagar", "Swaroop Nagar", "Govind Nagar", "Kakadeo", "Kalyanpur", "Civil Lines", "Panki", "Barra", "Shyam Nagar", "Juhi", "Harsh Nagar", "Chamanganj", "Rawatpur", "Arya Nagar"];

const SLA: Record<ApplyKind, number> = { apply: 15, renew: 7, register: 7, download: 1, pay: 1, grievance: 30 };

const STAGE_WEIGHTS: [CaseStage, number][] = [
  ["new", 0.2],
  ["docCheck", 0.18],
  ["verification", 0.16],
  ["decision", 0.14],
  ["infoRequested", 0.08],
  ["approved", 0.1],
  ["issued", 0.1],
  ["rejected", 0.04],
];

function pick<T>(rand: () => number, list: T[]): T {
  return list[Math.floor(rand() * list.length) % list.length];
}

function weighted<T>(rand: () => number, entries: [T, number][]): T {
  const r = rand();
  let acc = 0;
  for (const [v, w] of entries) {
    acc += w;
    if (r <= acc) return v;
  }
  return entries[entries.length - 1][0];
}

const deptSeed = (id: string) => Array.from(id).reduce((s, ch) => s * 31 + ch.charCodeAt(0), 7) >>> 0;

export const serviceName = (serviceId: string): L =>
  getTask(serviceId)?.name ?? getScheme(serviceId)?.name ?? { en: serviceId, hi: serviceId, bn: serviceId, ta: serviceId };

/** Services in a department that create a case an officer has to decide on. */
export const queueServices = (dept: Department) => dept.services.filter((id) => ["apply", "renew", "register"].includes(getApplyFlow(id).kind));

function refFor(dept: Department, n: number) {
  return `${dept.code}-2026-${String(10000 + n).padStart(5, "0")}`;
}

const HOSPITALS = ["District Women Hospital, Kanpur", "GSVM Medical College, Kanpur", "Regency Hospital, Kanpur", "Community Health Centre, Kalyanpur"];
const INSTITUTIONS = ["Government Inter College, Kanpur", "Christ Church College", "Dr. Virendra Swarup Public School", "Government Polytechnic, Kanpur"];

function fieldValue(id: string, a: Applicant, rand: () => number, options?: string[], value?: string): string {
  if (value) return value;
  const surname = a.name.split(" ").slice(-1)[0];
  if (id === "gender") return a.gender === "F" ? "Female" : "Male";
  if (options?.length) return pick(rand, options);
  switch (id) {
    case "childName":
      return a.name === CITIZEN.name ? "Aanya Verma" : `${pick(rand, ["Aarav", "Diya", "Ishaan", "Myra", "Kabir", "Saanvi"])} ${surname}`;
    case "motherName":
      return a.gender === "F" ? a.name : `${pick(rand, FIRST_F)} ${surname}`;
    case "fatherName":
      return a.gender === "M" ? a.name : `${pick(rand, FIRST_M)} ${surname}`;
    case "guardianName":
      return a.name;
    case "placeOfBirth":
    case "hospital":
      return pick(rand, HOSPITALS);
    case "institution":
      return pick(rand, INSTITUTIONS);
    case "course":
      return pick(rand, ["Class XII (Science)", "B.A. 2nd year", "B.Sc. 1st year", "Class X"]);
    case "board":
      return pick(rand, ["UP Board", "CBSE", "CSJM University"]);
    case "rollNo":
      return String(2600000 + Math.floor(rand() * 99999));
    case "examYear":
    case "admissionYear":
      return pick(rand, ["2024", "2025", "2026"]);
    case "dlNumber":
      return `UP78 20${10 + Math.floor(rand() * 15)} 000${1000 + Math.floor(rand() * 8999)}`;
    case "chassisNo":
      return `MA3${pick(rand, ["EW", "FJ", "KB"])}••••••${10000 + Math.floor(rand() * 89999)}`;
    case "engineNo":
      return `K12M••${100000 + Math.floor(rand() * 899999)}`;
    case "makerModel":
      return pick(rand, ["Maruti Suzuki Swift", "Hero Splendor+", "Tata Nexon", "Honda Activa 6G"]);
    case "pan":
      return `•••••${1000 + Math.floor(rand() * 8999)}${pick(rand, ["K", "L", "P"])}`;
    case "ifsc":
      return pick(rand, ["SBIN0001234", "PUNB0123400", "BARB0KANPUR"]);
    case "occupation":
      return pick(rand, ["Shopkeeper", "Farmer", "Driver", "Tailor", "Teacher", "Daily-wage worker"]);
    case "pincode":
      return `2080${String(10 + Math.floor(rand() * 30))}`;
    case "district":
      return "Kanpur Nagar";
    case "state":
      return "Uttar Pradesh";
    case "village":
    case "block":
    case "panchayat":
      return a.locality;
    case "rationCard":
      return `UP-KNP-••••${1000 + Math.floor(rand() * 8999)}`;
    case "email":
      return `${a.name.split(" ")[0].toLowerCase()}•••@gmail.com`;
    case "propertyId":
      return `KNN/${pick(rand, ["Z2", "Z4", "Z6"])}/${10000 + Math.floor(rand() * 89999)}`;
    case "khasra":
      return `${100 + Math.floor(rand() * 800)}/${1 + Math.floor(rand() * 9)}`;
    case "fullName":
    case "newOwner":
      return a.name;
    case "dob":
      return `${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}/${String(1 + Math.floor(rand() * 12)).padStart(2, "0")}/${2026 - a.age}`;
    case "mobile":
    case "newMobile":
      return `+91 ••••• •${a.mobileLast4}`;
    case "aadhaar":
      return `XXXX XXXX ${a.aadhaarLast4}`;
    case "address":
    case "newAddress":
      return `${10 + Math.floor(rand() * 180)}, ${a.locality}, Kanpur`;
    case "annualIncome":
      return `₹${(90 + Math.floor(rand() * 160)) * 1000}`.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    case "bankAccount":
      return `•••• •••• ${1000 + Math.floor(rand() * 8999)}`;
    case "vehicleNo":
      return `UP78 ${pick(rand, ["DX", "EK", "FB", "CQ"])} ${1000 + Math.floor(rand() * 8999)}`;
    default:
      return "—";
  }
}

function makeCase(dept: Department, i: number, rand: () => number): ConsoleCase {
  const services = queueServices(dept);
  const serviceId = services.length ? services[i % services.length] : dept.services[0];
  const flow = getApplyFlow(serviceId);
  const gender: "F" | "M" = rand() < 0.5 ? "F" : "M";
  const applicant: Applicant = {
    name: `${pick(rand, gender === "F" ? FIRST_F : FIRST_M)} ${pick(rand, LAST)}`,
    gender,
    age: 19 + Math.floor(rand() * 52),
    locality: pick(rand, LOCALITIES),
    aadhaarLast4: String(1000 + Math.floor(rand() * 8999)),
    mobileLast4: String(1000 + Math.floor(rand() * 8999)),
  };
  const ageDays = Math.floor(rand() * 18);
  const submitted = new Date(PROTOTYPE_TODAY);
  submitted.setDate(submitted.getDate() - ageDays);
  submitted.setHours(9 + Math.floor(rand() * 9), Math.floor(rand() * 60));

  const documents: CaseDocument[] = flow.documents.map((name) => ({ name, source: rand() < 0.72 ? "digilocker" : "upload" }));
  const flags: FlagId[] = [];
  if (documents.some((d) => d.source === "upload")) flags.push("manualDoc");
  if (rand() < 0.16) flags.push("nameMismatch");
  if (rand() < 0.08) flags.push("dobMismatch");
  if (rand() < 0.08) flags.push("photoQuality");
  if (rand() < 0.07) flags.push("addressChanged");
  if (rand() < 0.05) flags.push("duplicate");

  const fields = flow.steps
    .flatMap((s) => s.fields)
    .slice(0, 7)
    .map((f) => ({ label: f.label, value: fieldValue(f.id, applicant, rand, f.options, f.value) }));

  return {
    id: `${dept.id}-${i}`,
    ref: refFor(dept, i * 37 + 11),
    deptId: dept.id,
    serviceId,
    service: serviceName(serviceId),
    kind: flow.kind,
    applicant,
    submittedAt: submitted.toISOString(),
    slaDays: SLA[flow.kind],
    stage: weighted(rand, STAGE_WEIGHTS),
    flags,
    documents,
    fields,
    fee: flow.fee,
    channel: weighted(rand, [["saathi", 0.62], ["csc", 0.26], ["portal", 0.12]]),
  };
}

const cache = new Map<DeptId, ConsoleCase[]>();

/** The department's sample caseload — stable across reloads. */
export function sampleCases(deptId: DeptId, count = 26): ConsoleCase[] {
  const hit = cache.get(deptId);
  if (hit) return hit;
  const dept = DEPARTMENTS.find((d) => d.id === deptId);
  if (!dept || queueServices(dept).length === 0) {
    cache.set(deptId, []);
    return [];
  }
  const rand = mulberry32(deptSeed(deptId));
  const list = Array.from({ length: count }, (_, i) => makeCase(dept, i, rand));
  cache.set(deptId, list);
  return list;
}

/** Prototype status → console stage, and back. */
export const STAGE_FROM_STATUS: Record<AppStatus, CaseStage> = {
  submitted: "new",
  pending: "docCheck",
  inProgress: "verification",
  actionNeeded: "infoRequested",
  approved: "approved",
  ready: "issued",
  rejected: "rejected",
};

export const STATUS_FROM_STAGE: Record<CaseStage, AppStatus> = {
  new: "submitted",
  docCheck: "inProgress",
  verification: "inProgress",
  decision: "inProgress",
  infoRequested: "actionNeeded",
  approved: "approved",
  issued: "ready",
  rejected: "rejected",
};

const LIVE_SEED_FLOW: Record<string, string> = { app_birth: "cert_birth", app_ayushman: "pmjay", app_pmkisan: "pmkisan", app_income: "cert_income" };

export const CITIZEN: Applicant = { name: "Rakesh Verma", gender: "M", age: 34, locality: "Civil Lines", aadhaarLast4: "6721", mobileLast4: "3210" };

/**
 * The citizen's applications from the prototype that this department owns —
 * the four built-in samples plus anything submitted during the demo.
 */
export function liveCases(deptId: DeptId, apps: (SubmittedApplication | (typeof APPLICATIONS)[number])[], user: { name: string; aadhaarLast4: string }): ConsoleCase[] {
  const out: ConsoleCase[] = [];
  apps.forEach((app) => {
    const flowId = ("flowId" in app && app.flowId) || LIVE_SEED_FLOW[app.id];
    if (!flowId || departmentFor(flowId)?.id !== deptId) return;
    const flow = getApplyFlow(flowId);
    if (!["apply", "renew", "register"].includes(flow.kind)) return;
    const applicant: Applicant = { ...CITIZEN, name: user.name || CITIZEN.name, aadhaarLast4: user.aadhaarLast4 || CITIZEN.aadhaarLast4 };
    const rand = mulberry32(deptSeed(app.ref));
    out.push({
      id: `live-${app.id}`,
      ref: app.ref,
      deptId,
      serviceId: flowId,
      service: app.service,
      kind: flow.kind,
      applicant,
      submittedAt: new Date(app.date).toISOString(),
      slaDays: SLA[flow.kind],
      stage: STAGE_FROM_STATUS[app.status],
      flags: flowId === "cert_birth" ? ["addressChanged"] : [],
      documents: flow.documents.map((name) => ({ name, source: "digilocker" as const })),
      fields: flow.steps
        .flatMap((s) => s.fields)
        .slice(0, 7)
        .map((f) => ({ label: f.label, value: fieldValue(f.id, applicant, rand, f.options, f.value) })),
      fee: flow.fee,
      channel: "saathi",
      live: { appId: app.id },
    });
  });
  return out;
}

/** Whole days left before the service time limit (negative = overdue). */
export function slaLeft(c: Pick<ConsoleCase, "submittedAt" | "slaDays">, now = PROTOTYPE_TODAY): number {
  const elapsed = Math.floor((now.getTime() - new Date(c.submittedAt).getTime()) / 86_400_000);
  return c.slaDays - elapsed;
}

export const isOpen = (stage: CaseStage) => OPEN_STAGES.includes(stage);
