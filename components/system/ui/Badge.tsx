import type { Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type BadgeTone = "navy" | "green" | "saffron" | "neutral" | "red" | "violet";

const TONES: Record<BadgeTone, string> = {
  navy: "bg-navy-50 text-navy-700 ring-navy-100",
  green: "bg-green-50 text-green-800 ring-green-100",
  saffron: "bg-saffron-50 text-saffron-700 ring-saffron-100",
  neutral: "bg-surface2 text-ink-2 ring-line",
  red: "bg-red-50 text-red-600 ring-red-50",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
};

/**
 * Status + trust labels. Tone is always paired with text (and optionally an
 * icon) so meaning never depends on colour alone.
 */
export function Badge({
  tone = "neutral",
  dot = false,
  icon: Glyph,
  className,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  icon?: Icon;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-caption font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {dot && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />}
      {Glyph && <Glyph aria-hidden size={13} weight="bold" />}
      {children}
    </span>
  );
}
