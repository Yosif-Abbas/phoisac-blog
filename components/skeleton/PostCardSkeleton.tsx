import { Skeleton } from "@/components/skeleton/skeleton";

export default function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4 px-6">
      <div className="flex justify-between items-start">
        <div className="space-y-3 w-full">
          {/* Date Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Skeleton className="h-4 w-10 bg-foreground/5" />
              <Skeleton className="h-4 w-10 bg-foreground/5" />
              <Skeleton className="h-4 w-10 bg-foreground/5" />
            </div>
            <Skeleton className="h-4 w-20 bg-foreground/5" />
          </div>
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-3/4 bg-foreground/10" />
          {/* Subtitle/Excerpt Skeleton */}
          <Skeleton className="h-5 w-1/2 bg-foreground/5" />
        </div>
      </div>
    </div>
  );
}
