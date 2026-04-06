// @/components/ui/skeleton/EditorSkeleton.tsx
export default function EditorSkeleton() {
  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-y-10 animate-pulse mt-4">
      {/* Title Skeleton */}
      <div className="h-16 w-3/4 bg-muted/20 rounded-xl" />

      {/* Writing Canvas Skeleton */}
      <div className="space-y-6">
        <div className="h-4 w-full bg-muted/10 rounded" />
        <div className="h-4 w-full bg-muted/10 rounded" />
        <div className="h-4 w-5/6 bg-muted/10 rounded" />
        <div className="h-32 w-full bg-muted/5 rounded-2xl" />{" "}
        {/* Image/Block placeholder */}
        <div className="h-4 w-full bg-muted/10 rounded" />
        <div className="h-4 w-4/6 bg-muted/10 rounded" />
      </div>
    </div>
  );
}
