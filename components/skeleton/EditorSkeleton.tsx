import { Skeleton } from "./skeleton";

// @/components/skeleton/EditorSkeleton.tsx
export default function EditorSkeleton() {
  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-y-10 animate-pulse mt-4">
      {/* Title Skeleton */}
      <Skeleton className="h-32 w-full bg-foreground/10 rounded-2xl" />
      <Skeleton className="h-16 w-full bg-foreground/10 rounded-2xl" />

      {/* Writing Canvas Skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-4 w-full bg-foreground/10 rounded" />
        <Skeleton className="h-4 w-full bg-foreground/10 rounded" />
        <Skeleton className="h-4 w-5/6 bg-foreground/10 rounded" />
        <Skeleton className="h-16 w-full bg-foreground/5 rounded-2xl" />
        {/* Image/Block placeholder */}
        <Skeleton className="h-4 w-full bg-foreground/10 rounded" />
        <Skeleton className="h-4 w-4/6 bg-foreground/10 rounded" />
      </div>
    </div>
  );
}
