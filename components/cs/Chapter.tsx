import { Reveal } from "@/components/system/motion/Reveal";
import { TextReveal } from "@/components/system/motion/TextReveal";
import { cn } from "@/lib/utils";

export const CHAPTERS = [
  "overview",
  "problem",
  "umang",
  "research",
  "personas",
  "frame",
  "principles",
  "structure",
  "ai",
  "languages",
  "accessibility",
  "system",
  "flows",
  "success",
  "reflection",
] as const;

export type ChapterId = (typeof CHAPTERS)[number];

/** A numbered chapter of the case study. */
export function Chapter({
  id,
  label,
  heading,
  children,
  className,
}: {
  id: ChapterId;
  label: string;
  heading?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const n = CHAPTERS.indexOf(id) + 1;
  return (
    <section id={id} data-chapter={id} className={cn("scroll-mt-28 border-t border-line py-20 first:border-t-0 first:pt-4 md:py-24", className)}>
      <Reveal>
        <p className="flex items-center gap-3 text-[15px] font-medium text-ink-3">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-surface2 px-2 text-[12.5px] font-semibold tabular-nums text-ink-2">{n}</span>
          {label}
        </p>
      </Reveal>
      {heading && <TextReveal as="h2" text={heading} className="mt-5 max-w-[22ch] text-h1 text-ink" />}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Body paragraphs at a comfortable measure. */
export function Prose({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  return (
    <Reveal className={cn("max-w-[64ch] space-y-5", className)}>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 32)} className="text-[18px] leading-[var(--lh-body-x)] text-ink-2">
          {p}
        </p>
      ))}
    </Reveal>
  );
}
