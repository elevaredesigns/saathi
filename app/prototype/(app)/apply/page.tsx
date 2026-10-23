"use client";

import { useEffect, useState } from "react";

import { getApplyFlow } from "@/lib/applyFlows";
import { ApplyFlow } from "@/components/prototype/apply/ApplyFlow";
import { ChallanFlow } from "@/components/prototype/apply/ChallanFlow";
import { DetailSkeleton } from "@/components/prototype/ui/DetailSkeleton";

export default function ApplyPage() {
  const [id, setId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  // Brief hold until we've read the query (avoids a flash of the wrong flow).
  if (id === undefined) return <DetailSkeleton />;

  if (id === "transport_challan") return <ChallanFlow />;
  return <ApplyFlow flow={getApplyFlow(id)} />;
}
