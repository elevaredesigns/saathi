import { cn } from "@/lib/utils";

/** The iOS home indicator pill. */
export function HomeIndicator({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "proto-chrome pointer-events-none absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full",
        tone === "dark" ? "bg-ink/80" : "bg-white/85",
      )}
    />
  );
}
