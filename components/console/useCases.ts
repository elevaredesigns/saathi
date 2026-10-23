"use client";

import { useCallback, useMemo } from "react";

import { usePrototype, type OfficerAction } from "@/lib/context/PrototypeContext";
import { liveCases, sampleCases, STATUS_FROM_STAGE, type CaseStage, type ConsoleCase } from "@/lib/console/cases";
import type { Department } from "@/lib/console/departments";
import { useConsole, type AuditKind } from "@/lib/console/store";
import type { L } from "@/lib/mockData";
import { prototypeNow } from "@/lib/utils/dateUtils";

/** The department's queue: the citizen's live cases first, then samples, with every decision applied. */
export function useDeptCases(dept: Department): ConsoleCase[] {
  const { applications, user } = usePrototype();
  const { stages } = useConsole();
  return useMemo(() => {
    const live = liveCases(dept.id, applications, user);
    const samples = sampleCases(dept.id).map((c) => (stages[c.id] ? { ...c, stage: stages[c.id].stage } : c));
    return [...live, ...samples];
  }, [dept.id, applications, user, stages]);
}

const ACTION_FOR_STAGE: Partial<Record<CaseStage, OfficerAction>> = {
  approved: "approved",
  infoRequested: "infoRequested",
  rejected: "rejected",
  issued: "issued",
  verification: "forwarded",
  decision: "forwarded",
};

/**
 * Officer actions. A live case writes through to the prototype (status +
 * officer event the citizen sees); a sample case updates the console store.
 * Both always leave an audit entry.
 */
export function useCaseActions(dept: Department) {
  const { recordOfficerEvent } = usePrototype();
  const { patch, log } = useConsole();

  const setStage = useCallback(
    (c: ConsoleCase, stage: CaseStage, extra: { reason?: L; note?: string } = {}) => {
      const kind = (ACTION_FOR_STAGE[stage] ?? "forwarded") as AuditKind;
      if (c.live) {
        recordOfficerEvent(
          {
            id: `ev-${Date.now()}`,
            appId: c.live.appId,
            ref: c.ref,
            service: c.service,
            action: ACTION_FOR_STAGE[stage] ?? "forwarded",
            officer: dept.officer.name,
            office: dept.office,
            reason: extra.reason,
            note: extra.note,
            at: prototypeNow().toISOString(),
          },
          STATUS_FROM_STAGE[stage],
        );
        log({ deptId: dept.id, kind, subject: c.ref, officer: dept.officer.name, note: extra.note });
      } else {
        patch((s) => ({ stages: { ...s.stages, [c.id]: { stage, at: prototypeNow().toISOString(), note: extra.note, reason: extra.reason?.en } } }), {
          deptId: dept.id,
          kind,
          subject: c.ref,
          officer: dept.officer.name,
          note: extra.note,
        });
      }
    },
    [dept, recordOfficerEvent, patch, log],
  );

  /** Record a look at personal data — visible to the citizen when it's their case. */
  const recordAccess = useCallback(
    (c: ConsoleCase, what: "viewedKyc" | "viewedDocument", purpose: L) => {
      if (c.live) {
        recordOfficerEvent({
          id: `ac-${what}-${Date.now()}`,
          appId: c.live.appId,
          ref: c.ref,
          service: c.service,
          action: what,
          officer: dept.officer.name,
          office: dept.office,
          purpose,
          at: prototypeNow().toISOString(),
        });
      }
      log({ deptId: dept.id, kind: what, subject: c.ref, officer: dept.officer.name, purpose });
    },
    [dept, recordOfficerEvent, log],
  );

  return { setStage, recordAccess };
}
