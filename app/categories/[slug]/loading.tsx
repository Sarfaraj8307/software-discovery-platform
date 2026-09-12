import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Skeleton className="h-7 w-1/4" />
      <Skeleton className="mt-2 h-4 w-1/3" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-card border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-[7px]" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
