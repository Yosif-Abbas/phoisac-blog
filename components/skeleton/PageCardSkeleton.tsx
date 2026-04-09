import { Skeleton } from "./skeleton";

export default function PageCardSkeleton() {
  return (
    <div
      dir="rtl"
      className="block rounded-2xl border border-card-hover bg-container p-5 shadow-sm animate-pulse"
    >
      <div className="flex items-start gap-4">
        {/* Icon Box Skeleton */}
        <Skeleton className="h-12 w-12 shrink-0 rounded-2xl bg-card-hover" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 w-full">
              {/* Title Skeleton */}
              <Skeleton className="h-5 w-1/3 rounded-lg bg-card-hover" />

              {/* Date Skeleton */}
              <Skeleton className="mt-2 h-3 w-20 rounded-lg bg-card-hover" />
            </div>
          </div>

          {/* Description Skeleton (Two lines) */}
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-2/3 rounded-lg bg-card-hover" />
          </div>

          <div className="mt-6 flex items-center justify-between">
            {/* "Edit" text skeleton */}
            <Skeleton className="h-4 w-20 rounded-lg bg-card-hover" />

            {/* Arrow icon skeleton */}
            <Skeleton className="h-5 w-5 rounded-full bg-card-hover" />
          </div>
        </div>
      </div>
    </div>
  );
}
