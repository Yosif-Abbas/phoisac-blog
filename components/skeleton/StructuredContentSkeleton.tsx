import { Skeleton } from "./skeleton";

export default function StructuredContentSkeleton() {
  return (
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
  );
}
