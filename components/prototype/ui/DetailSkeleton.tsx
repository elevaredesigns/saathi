import { Skeleton } from "./Skeleton";

/** Loading placeholder for detail screens. */
export function DetailSkeleton() {
  return (
    <div className="px-5 pt-14" aria-busy="true">
      <Skeleton className="h-14 w-14 rounded-[17px]" />
      <Skeleton className="mt-5 h-8 w-2/3" />
      <Skeleton className="mt-3 h-4 w-1/2" />
      <Skeleton className="mt-7 h-28 w-full rounded-[22px]" />
      <Skeleton className="mt-4 h-16 w-full rounded-[18px]" />
      <Skeleton className="mt-3 h-16 w-full rounded-[18px]" />
    </div>
  );
}
