"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

import type { L } from "@/lib/mockData";
import { prototypeNow } from "@/lib/utils/dateUtils";
import type { CaseStage } from "./cases";
import type { DeptId } from "./departments";

export type AuditKind = "approved" | "infoRequested" | "rejected" | "issued" | "forwarded" | "viewedKyc" | "viewedDocument" | "docVerified" | "docRejected" | "kycResolved" | "challanIssued" | "courtDecision" | "refund" | "dbtApproved" | "admitReleased" | "resultsPublished" | "deadlineExtended" | "photoAccepted" | "photoReupload" | "grievanceResolved" | "grievanceEscalated";

export interface AuditEntry {
  id: string;
  deptId: DeptId;
  kind: AuditKind;
  subject: string; // ref / challan no / batch id
  officer: string;
  purpose?: L;
  note?: string;
  at: string;
}

export interface IssuedChallan {
  no: string;
  vehicle: string;
  violationId: string;
  place: string;
  at: string;
}

export interface ConsoleState {
  hydrated: boolean;
  /** Stage decisions on sample cases (live cases write to the prototype instead). */
  stages: Record<string, { stage: CaseStage; at: string; note?: string; reason?: string }>;
  /** `${caseId}:${docIndex}` → verified (true) / rejected (false). */
  docChecks: Record<string, boolean>;
  /** Case ids whose e-KYC was opened this session, with the purpose id. */
  kycOpen: Record<string, string>;
  kycResolved: Record<string, "accepted" | "askUpdate">;
  challansIssued: IssuedChallan[];
  court: Record<string, "upheld" | "dismissed">;
  refunds: string[];
  dbt: Record<string, "sent">;
  exams: Record<string, { admitReleased?: boolean; resultsPublished?: boolean; deadlineExtended?: boolean }>;
  photoChecks: Record<string, "accepted" | "reupload">;
  grievances: Record<string, "resolved" | "escalated">;
  audit: AuditEntry[];
}

const INITIAL: ConsoleState = {
  hydrated: false,
  stages: {},
  docChecks: {},
  kycOpen: {},
  kycResolved: {},
  challansIssued: [],
  court: {},
  refunds: [],
  dbt: {},
  exams: {},
  photoChecks: {},
  grievances: {},
  audit: [],
};

type Patch = Partial<Omit<ConsoleState, "hydrated" | "audit">>;

type Action =
  | { type: "HYDRATE"; payload: Partial<ConsoleState> }
  | { type: "PATCH"; patch: (s: ConsoleState) => Patch; audit?: Omit<AuditEntry, "id" | "at"> }
  | { type: "RESET" };

export function consoleReducer(state: ConsoleState, action: Action): ConsoleState {
  switch (action.type) {
    case "HYDRATE":
      return { ...INITIAL, ...action.payload, hydrated: true };
    case "PATCH": {
      const next = { ...state, ...action.patch(state) };
      if (action.audit) {
        const at = prototypeNow().toISOString();
        next.audit = [{ ...action.audit, id: `${Date.now()}-${state.audit.length}`, at }, ...state.audit].slice(0, 200);
      }
      return next;
    }
    case "RESET":
      return { ...INITIAL, hydrated: true };
    default:
      return state;
  }
}

const KEY = "saathi.console";

interface ConsoleContextValue extends ConsoleState {
  patch: (patch: (s: ConsoleState) => Patch, audit?: Omit<AuditEntry, "id" | "at">) => void;
  log: (audit: Omit<AuditEntry, "id" | "at">) => void;
  reset: () => void;
}

const Ctx = createContext<ConsoleContextValue | null>(null);

export function useConsole() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useConsole must be used within <ConsoleProvider>");
  return ctx;
}

export function ConsoleProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(consoleReducer, INITIAL);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      dispatch({ type: "HYDRATE", payload: raw ? (JSON.parse(raw) as Partial<ConsoleState>) : {} });
    } catch {
      dispatch({ type: "HYDRATE", payload: {} });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      // e-KYC unlocks are deliberately session-only: never persisted.
      const persist: Partial<ConsoleState> = { ...state };
      delete persist.hydrated;
      delete persist.kycOpen;
      window.localStorage.setItem(KEY, JSON.stringify(persist));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const patch = useCallback((p: (s: ConsoleState) => Patch, audit?: Omit<AuditEntry, "id" | "at">) => dispatch({ type: "PATCH", patch: p, audit }), []);
  const log = useCallback((audit: Omit<AuditEntry, "id" | "at">) => dispatch({ type: "PATCH", patch: () => ({}), audit }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const value = useMemo(() => ({ ...state, patch, log, reset }), [state, patch, log, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
