import { cn } from "@/lib/utils";

/** iOS status bar — fixed Latin glyphs regardless of app locale. */
export function StatusBar({ time = "9:41", tone = "dark" }: { time?: string; tone?: "dark" | "light" }) {
  return (
    <div
      className={cn(
        "flex h-[44px] w-full select-none items-end justify-between px-[30px] pb-[10px]",
        tone === "dark" ? "text-ink" : "text-white",
      )}
    >
      <span className="text-[16px] font-semibold tabular-nums tracking-[-0.01em]" style={{ fontFamily: "var(--font-geist)" }}>
        {time}
      </span>
      <div className="flex items-center gap-[7px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
          <path d="M1.2 4.1C3.3 2.2 5.8 1.2 8.5 1.2s5.2 1 7.3 2.9" />
          <path d="M3.6 6.7C4.9 5.4 6.6 4.7 8.5 4.7s3.6.7 4.9 2" />
          <circle cx="8.5" cy="9.4" r="1.1" fill="currentColor" stroke="none" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
          <rect x="0.6" y="0.6" width="22" height="11.8" rx="3.4" stroke="currentColor" strokeOpacity="0.35" />
          <rect x="2" y="2" width="17.5" height="9" rx="2" fill="currentColor" />
          <path d="M24.4 4.4c1 .3 1 3.9 0 4.2" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
