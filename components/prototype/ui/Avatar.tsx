import { cn } from "@/lib/utils";

const TONES = [
  "from-navy-100 to-navy-200 text-navy-800",
  "from-saffron-100 to-saffron-300 text-saffron-700",
  "from-green-50 to-green-100 text-green-800",
  "from-violet-50 to-violet-100 text-violet-600",
  "from-teal-50 to-teal-100 text-teal-600",
];

function initialsFrom(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Monogram avatar on a tone picked from the name (stable across renders). */
export function Avatar({ name, size = 40, className }: { name: string; src?: string; size?: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br font-semibold ring-1 ring-black/[0.04]",
        TONES[hash(name) % TONES.length],
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initialsFrom(name)}
    </span>
  );
}
