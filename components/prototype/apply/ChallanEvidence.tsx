import type { EvidenceKind } from "@/lib/data/challans";

/**
 * Illustrated camera frame for a challan — drawn, never a photograph. A
 * perspective road, the vehicle from behind with its plate, and the camera's
 * overlay (time, device, reading) so the citizen can see what was recorded.
 */
export function ChallanEvidence({ kind, plate, stamp, reading, className }: { kind: EvidenceKind; plate: string; stamp: string; reading?: string; className?: string }) {
  const night = kind === "speed";
  return (
    <svg viewBox="0 0 320 180" className={className} role="img" aria-label={`${plate} · ${stamp}`}>
      <defs>
        <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? "#0E1733" : "#9FB3C8"} />
          <stop offset="1" stopColor={night ? "#27324F" : "#D9E1EA"} />
        </linearGradient>
        <linearGradient id={`road-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? "#2B2F3A" : "#6B7280"} />
          <stop offset="1" stopColor={night ? "#12141A" : "#3F444E"} />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#sky-${kind})`} />
      {/* road in perspective */}
      <path d="M0 180 L128 74 L192 74 L320 180 Z" fill={`url(#road-${kind})`} />
      <path d="M160 76 L160 92 M160 102 L160 122 M160 134 L160 164" stroke="#F4F4F4" strokeOpacity="0.7" strokeWidth="3" />
      {kind === "redLight" && (
        <>
          <path d="M40 142 L280 142" stroke="#F4F4F4" strokeWidth="4" />
          <rect x="248" y="24" width="18" height="46" rx="4" fill="#15171C" />
          <circle cx="257" cy="35" r="5.5" fill="#FF3B30" />
          <circle cx="257" cy="47" r="5.5" fill="#3A3D44" />
          <circle cx="257" cy="59" r="5.5" fill="#3A3D44" />
          <rect x="255" y="70" width="4" height="40" fill="#15171C" />
        </>
      )}
      {kind === "parking" && (
        <g transform="translate(252 28)">
          <rect x="7" y="34" width="4" height="46" fill="#4B5563" />
          <circle cx="9" cy="18" r="17" fill="#fff" stroke="#D92D20" strokeWidth="4" />
          <text x="9" y="25" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1F43B8" fontFamily="system-ui, sans-serif">P</text>
          <path d="M-3 6 L21 30" stroke="#D92D20" strokeWidth="4" />
        </g>
      )}
      {/* car from behind */}
      <g transform={kind === "redLight" ? "translate(0 8)" : ""}>
        <path d="M112 132 Q116 102 134 98 L186 98 Q204 102 208 132 Z" fill={night ? "#C9CED9" : "#E7EAF0"} />
        <rect x="104" y="126" width="112" height="34" rx="9" fill={night ? "#DCE0E8" : "#F7F8FA"} />
        <path d="M124 104 L196 104 L202 124 L118 124 Z" fill={night ? "#1B2233" : "#51607A"} opacity="0.85" />
        <rect x="108" y="134" width="20" height="8" rx="3" fill="#E5484D" />
        <rect x="192" y="134" width="20" height="8" rx="3" fill="#E5484D" />
        <rect x="126" y="145" width="68" height="13" rx="2" fill="#fff" stroke="#111" strokeWidth="1.2" />
        <text x="160" y="155" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#111" fontFamily="ui-monospace, monospace" letterSpacing="0.6">
          {plate}
        </text>
        <rect x="106" y="160" width="16" height="10" rx="2" fill="#0B0D14" />
        <rect x="198" y="160" width="16" height="10" rx="2" fill="#0B0D14" />
        {kind === "seatbelt" && <path d="M150 106 L176 122" stroke="#FACC15" strokeWidth="2" strokeDasharray="3 2" />}
      </g>
      {/* plate recognition box */}
      <rect x="120" y={kind === "redLight" ? 147 : 139} width="80" height="25" fill="none" stroke="#34D399" strokeWidth="1.5" />
      {/* HUD */}
      <rect x="0" y="0" width="320" height="18" fill="#000" opacity="0.55" />
      <text x="8" y="12.5" fontSize="8.5" fill="#fff" fontFamily="ui-monospace, monospace">
        {stamp}
      </text>
      <circle cx="306" cy="9" r="3.5" fill="#FF3B30" />
      {reading && (
        <g>
          <rect x="8" y="24" width={reading.length * 5.6 + 14} height="22" rx="5" fill="#000" opacity="0.62" />
          <text x="15" y="39" fontSize="10" fontWeight="700" fill="#FACC15" fontFamily="ui-monospace, monospace">
            {reading}
          </text>
        </g>
      )}
    </svg>
  );
}
