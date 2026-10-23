import { Reveal } from "@/components/system/motion/Reveal";
import { cn } from "@/lib/utils";

/** Numbered chapter wrapper for the living style guide. */
export function ShowcaseSection({
  id,
  index,
  title,
  lede,
  children,
  className,
}: {
  id: string;
  index: string;
  title: string;
  lede: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 border-t border-line py-20 md:py-28", className)}>
      <div className="mx-auto max-w-page px-5 sm:px-8">
        <Reveal className="grid gap-6 md:grid-cols-[180px_1fr] md:gap-10">
          <p className="font-mono text-mono text-ink-3">{index}</p>
          <div className="max-w-2xl">
            <h2 className="text-h2 text-ink">{title}</h2>
            <p className="mt-3 text-body-l text-ink-2">{lede}</p>
          </div>
        </Reveal>
        <div className="mt-12 md:ml-[220px]">{children}</div>
      </div>
    </section>
  );
}

/** Small uppercase label used above specimens. */
export function SpecLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-caption font-medium uppercase tracking-[0.14em] text-ink-3", className)}>{children}</p>;
}
