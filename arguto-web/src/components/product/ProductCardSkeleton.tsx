import { Skeleton } from "@/components/ui/Skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex w-[200px] shrink-0 flex-col overflow-hidden rounded-md border border-border bg-white sm:w-[220px]">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 border-t border-border p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-1 h-9 w-full" />
      </div>
    </div>
  );
}
