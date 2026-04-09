import StructuredContentSkeleton from "./StructuredContentSkeleton";
import { Skeleton } from "./skeleton";

export default function PostDetailsSkeleton() {
  return (
    <div className="flex flex-col w-full pb-20 animate-pulse">
      <header className="mx-auto w-full pt-12 pb-10 px-4 flex flex-col gap-y-8">
        <Skeleton className="h-4 w-24 bg-foreground/5 rounded-full" />

        <div className="space-y-4">
          <Skeleton className="h-12 md:h-16 w-full bg-foreground/10 rounded-lg" />
          <Skeleton className="h-12 md:h-16 w-2/3 bg-foreground/10 rounded-lg" />
        </div>

        <div className="flex flex-col justify-between gap-y-6 border-y border-[#E5E7EB] dark:border-card-hover py-6">
          <div className="flex items-center gap-3">
            <div className=" flex items-center gap-x-2">
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

      <StructuredContentSkeleton />
    </div>
  );
}
