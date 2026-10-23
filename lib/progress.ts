import type { AppStatus } from "@/lib/mockData";

/** Which of the five processing stages an application status sits in. */
export const STATUS_STAGE: Record<AppStatus, number> = {
  submitted: 1,
  pending: 1,
  inProgress: 2,
  approved: 4,
  ready: 5,
  actionNeeded: 2,
  rejected: 2,
};

export function stageProgress(status: AppStatus): { index: number; total: 5; fraction: number } {
  const index = STATUS_STAGE[status];
  return { index, total: 5, fraction: index / 5 };
}
