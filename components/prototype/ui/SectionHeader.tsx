import { CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  action,
  onAction,
  className,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 className="text-[19px] font-semibold tracking-[-0.012em] text-ink">{title}</h2>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="-mr-1 flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-1 text-[14px] font-semibold text-navy-600 transition-opacity active:opacity-60"
        >
          {action}
          <CaretRight size={13} weight="bold" />
        </button>
      )}
    </div>
  );
}
