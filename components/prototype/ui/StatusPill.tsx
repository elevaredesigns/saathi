import { cn } from "@/lib/utils";

export type Status = "active" | "success" | "pending" | "info";

const statusClasses: Record<Status, string> = {
  active: "bg-saffron-50 text-saffron-700 ring-saffron-100",
  success: "bg-green-50 text-green-800 ring-green-100",
  pending: "bg-saffron-50 text-saffron-700 ring-saffron-100",
  info: "bg-navy-50 text-navy-700 ring-navy-100",
};

/** Legacy status pill (2.0 styling). Prefer StatusBadge for applications. */
export function StatusPill({
  status = "info",
  children,
  dot = true,
  className,
}: {
  status?: Status;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12px] font-semibold ring-1 ring-inset",
        statusClasses[status],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
