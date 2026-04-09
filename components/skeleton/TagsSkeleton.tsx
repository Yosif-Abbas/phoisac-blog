import TagSkeleton from "./TagSkeleton";
import { Skeleton } from "@/components/skeleton/skeleton";

export default function TagsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-40 bg-foreground/10 p-4 rounded " />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 7 }, (_, index) => index + 1).map((i) => (
          <TagSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
