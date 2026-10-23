import { useMemo } from "react";

import { sampleQrMatrix } from "@/lib/design/qr";
import { cn } from "@/lib/utils";

/** Illustrative QR (encodes nothing). Always pair with a visible "Sample" label. */
export function SampleQr({ seed = 2047, size = 132, className }: { seed?: number; size?: number; className?: string }) {
  const m = useMemo(() => sampleQrMatrix(seed), [seed]);
  const n = m.length;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} shapeRendering="crispEdges" aria-hidden className={cn("rounded-[6px]", className)}>
      <rect width={n} height={n} fill="#fff" />
      {m.flatMap((row, r) => row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0B0D14" /> : null)))}
    </svg>
  );
}
