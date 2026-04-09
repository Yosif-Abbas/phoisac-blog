import PostCardSkeleton from "../PostCardSkeleton";
import { Skeleton } from "../skeleton";
import SearchInputSkeleton from "./SearchSkeleton";
import TagsFilterSkeleton from "./TagsFilterSkeleton";

export default function BlogPageSkeleton() {
  return (
    <div className="flex flex-col w-full pb-20 animate-pulse">
      {/* 1. Header Section Skeleton */}
      <header className="mx-auto w-full pb-6  flex flex-col gap-y-8">
        {/* Back Button Skeleton */}
        <Skeleton className="h-12 md:h-16 w-40 bg-foreground/10 rounded-lg " />

        {/* Title Skeleton - Big and Bold */}

        <div className="flex flex-col justify-between gap-y-6 border-y border-[#E5E7EB] dark:border-card-hover py-6">
          <div className="space-y-4">
            <Skeleton className="h-4 md:h-4 w-full bg-foreground/10 rounded-lg" />
            <Skeleton className="h-4 md:h-4 w-2/3 bg-foreground/10 rounded-lg" />
          </div>
        </div>
        <SearchInputSkeleton />
      </header>

      {/* 2. Content Blocks Skeleton */}
      <section className="flex flex-col gap-y-6">
        <TagsFilterSkeleton />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="">
            <PostCardSkeleton />
          </div>
        ))}
      </section>
    </div>
  );
}
