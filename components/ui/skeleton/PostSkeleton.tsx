import { Skeleton } from "./skeleton";

export default function PostDetailsSkeleton() {
  return (
    <div className="flex flex-col w-full pb-20 animate-pulse">
      {/* 1. Header Section Skeleton */}
      <header className="mx-auto w-full pt-12 pb-10 px-4 flex flex-col gap-y-8">
        {/* Back Button Skeleton */}
        <Skeleton className="h-4 w-24 bg-foreground/5 rounded-full" />

        {/* Title Skeleton - Big and Bold */}
        <div className="space-y-4">
          <Skeleton className="h-12 md:h-16 w-full bg-foreground/10 rounded-lg" />
          <Skeleton className="h-12 md:h-16 w-2/3 bg-foreground/10 rounded-lg" />
        </div>

        {/* Meta Section Skeleton (UserBadge + Tags) */}
        <div className="flex flex-col justify-between gap-y-6 border-y border-[#E5E7EB] dark:border-[#1F2937] py-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-foreground/5" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-foreground/5" />
              <Skeleton className="h-3 w-24 bg-foreground/5" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-6 w-16 rounded-full bg-primary/5"
              />
            ))}
          </div>
        </div>
      </header>

      {/* 2. Content Blocks Skeleton */}
      <div className="w-full flex flex-col gap-y-8 md:gap-y-12 py-10 px-4">
        {/* Paragraph Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-foreground/5" />
          <Skeleton className="h-4 w-full bg-foreground/5" />
          <Skeleton className="h-4 w-[90%] bg-foreground/5" />
        </div>

        {/* Image Skeleton */}
        <Skeleton className="aspect-video w-full rounded-2xl bg-foreground/10" />

        {/* Quote Skeleton */}
        <div className="border-r-4 border-[#E5E7EB]/20 pr-4 py-2">
          <Skeleton className="h-6 w-3/4 bg-foreground/5 italic" />
        </div>

        {/* Another Paragraph */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full bg-foreground/5" />
          <Skeleton className="h-4 w-[85%] bg-foreground/5" />
        </div>
      </div>
    </div>
  );
}
