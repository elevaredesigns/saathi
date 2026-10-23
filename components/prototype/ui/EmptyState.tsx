import type { Icon } from "@phosphor-icons/react";

import { KolamField } from "@/components/system/imagery/KolamField";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Glyph,
  title,
  subtitle,
  action,
  className,
}: {
  icon?: Icon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-8 py-14 text-center", className)}>
      <div className="relative mb-5 flex h-24 w-24 items-center justify-center">
        <KolamField cols={3} rows={3} cell={30} seed={9} density={0.6} diamond className="absolute inset-0 h-full w-full text-navy-200" />
        {Glyph && (
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-600 shadow-soft ring-1 ring-line">
            <Glyph size={24} weight="duotone" />
          </span>
        )}
      </div>
      <p className="text-[17px] font-semibold text-ink">{title}</p>
      {subtitle && <p className="mt-1 max-w-[260px] text-[14.5px] leading-relaxed text-ink-3">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
