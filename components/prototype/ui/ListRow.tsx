import { CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Grouped-list row: leading visual, title/subtitle, trailing accessory or chevron. */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  chevron,
  className,
}: {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  chevron?: boolean;
  className?: string;
}) {
  const showChevron = chevron ?? !!onClick;
  const body = (
    <>
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] font-semibold leading-snug text-ink">{title}</span>
        {subtitle && <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{subtitle}</span>}
      </span>
      {trailing}
      {showChevron && <CaretRight size={16} weight="bold" className="shrink-0 text-ink-4" />}
    </>
  );
  const classes = cn("flex w-full items-center gap-3 px-4 py-3.5 text-left", className);

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(classes, "transition-colors duration-150 active:bg-surface")}>
        {body}
      </button>
    );
  }
  return <div className={classes}>{body}</div>;
}

/** Inset grouped container for ListRows. */
export function ListGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("divide-y divide-line overflow-hidden rounded-[20px] bg-white ring-1 ring-line", className)}>{children}</div>;
}
