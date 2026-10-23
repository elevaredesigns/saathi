"use client";

import { CheckCircle, CircleDashed, Clock, HourglassMedium, Package, WarningCircle, XCircle, type Icon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

import { Badge, type BadgeTone } from "@/components/system/ui/Badge";
import type { AppStatus } from "@/lib/mockData";

const MAP: Record<AppStatus, { tone: BadgeTone; icon: Icon }> = {
  submitted: { tone: "navy", icon: CircleDashed },
  pending: { tone: "saffron", icon: HourglassMedium },
  inProgress: { tone: "saffron", icon: Clock },
  approved: { tone: "green", icon: CheckCircle },
  ready: { tone: "green", icon: Package },
  actionNeeded: { tone: "saffron", icon: WarningCircle },
  rejected: { tone: "red", icon: XCircle },
};

/** Application status in words + icon + tone (never colour alone). */
export function StatusBadge({ status, className }: { status: AppStatus; className?: string }) {
  const t = useTranslations("status");
  const m = MAP[status];
  return (
    <Badge tone={m.tone} icon={m.icon} className={className}>
      {t(status)}
    </Badge>
  );
}
