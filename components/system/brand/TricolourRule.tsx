import { cn } from "@/lib/utils";

/**
 * The tricolour as a precise 2px signal: saffron · (chakra-navy point) · green.
 * The white band is left to the page itself, so it never reads as a gap.
 */
export function TricolourRule({ className, dot = true }: { className?: string; dot?: boolean }) {
  return (
    <div aria-hidden className={cn("relative h-[2px] w-full", className)}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #FF8A1F 0%, #FF8A1F 33.33%, #EEF0F4 33.33%, #EEF0F4 66.66%, #12803C 66.66%, #12803C 100%)",
        }}
      />
      {dot && (
        <span className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-600 ring-2 ring-white" />
      )}
    </div>
  );
}

/** Three-bar tricolour glyph for small labels (never a flag rendering). */
export function TricolourGlyph({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex h-3 w-[14px] flex-col overflow-hidden rounded-[2px] ring-1 ring-black/5", className)}>
      <span className="flex-1 bg-saffron-500" />
      <span className="relative flex-1 bg-white">
        <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-600" />
      </span>
      <span className="flex-1 bg-green-600" />
    </span>
  );
}
