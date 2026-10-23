import { cn } from "@/lib/utils";

/** Calm shimmer placeholder (used instead of spinners). */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[12px] bg-surface2", className)}>
      <span className="absolute inset-0 -translate-x-full animate-shimmer-x bg-gradient-to-r from-transparent via-white/70 to-transparent motion-reduce:hidden" />
    </div>
  );
}
