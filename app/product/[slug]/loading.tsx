import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-start gap-4">
        <Skeleton className="size-14 rounded-[11px]" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-9 w-28 rounded-control" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="mt-4 h-40 w-full rounded-card" />
          <Skeleton className="h-4 w-9/12" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-card" />
          <Skeleton className="h-28 w-full rounded-card" />
        </div>
      </div>
    </div>
  );
}
