import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type TileTone = "navy" | "saffron" | "green" | "violet" | "teal" | "neutral";

const TONES: Record<TileTone, string> = {
  navy: "from-navy-50 to-navy-100 text-navy-600",
  saffron: "from-saffron-50 to-saffron-100 text-saffron-700",
  green: "from-green-50 to-green-100 text-green-600",
  violet: "from-violet-50 to-violet-100 text-violet-600",
  teal: "from-teal-50 to-teal-100 text-teal-600",
  neutral: "from-surface to-surface2 text-ink-2",
};

const SIZES = {
  sm: { box: 36, icon: 20, radius: 11 },
  md: { box: 44, icon: 24, radius: 13 },
  lg: { box: 56, icon: 30, radius: 17 },
  xl: { box: 72, icon: 38, radius: 22 },
} as const;

/** A duotone Phosphor icon on a tinted squircle — the category language of Saathi. */
export function IconTile({
  icon: Glyph,
  tone = "navy",
  size = "md",
  className,
}: {
  icon: Icon;
  tone?: TileTone;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center bg-gradient-to-br shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-black/[0.04]",
        TONES[tone],
        className,
      )}
      style={{ width: s.box, height: s.box, borderRadius: s.radius }}
    >
      <Glyph size={s.icon} weight="duotone" />
    </span>
  );
}
