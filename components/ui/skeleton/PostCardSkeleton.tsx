import { Skeleton } from "@/components/ui/skeleton/skeleton";

export default function PostCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-8">
      <div className="flex justify-between items-start">
        <div className="space-y-3 w-full">
          {/* Date Skeleton */}
          <Skeleton className="h-4 w-24 bg-foreground/5" />
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-3/4 bg-foreground/10" />
          {/* Subtitle/Excerpt Skeleton */}
          <Skeleton className="h-5 w-1/2 bg-foreground/5" />
        </div>
      </div>
    </div>
  );
}
