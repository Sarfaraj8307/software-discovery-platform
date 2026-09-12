import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="h-7 w-1/3" />
      <Skeleton className="mt-2 h-4 w-1/4" />
      <div className="mt-8 space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-card border border-border bg-card p-4">
              <Skeleton className="size-10 rounded-[7px]" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-card border border-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0">
              <Skeleton className="h-3 w-28 shrink-0" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
