import { Suspense } from "react";
import PostCardSkeleton from "@/components/skeleton/PostCardSkeleton";
import BlogPostsHydration from "@/components/posts/BlogPostsHydration";
import SearchInputSkeleton from "@/components/skeleton/blog/SearchSkeleton";
import TagsFilterSkeleton from "@/components/skeleton/blog/TagsFilterSkeleton";

export default function Blog() {
  return (
    <div className="flex flex-col gap-y-6 h-full w-full">
      <div className="flex items-baseline gap-x-2 border-b border-card-hover pb-4">
        <h1 className="text-3xl font-bold text-foreground">المدونة</h1>
      </div>
      <div className="flex items-baseline gap-x-2 border-b border-card-hover pb-4">
        <p className="text-muted-foreground">
          استكشف أحدث المنشورات والمقالات.
        </p>
      </div>

      <Suspense
        fallback={
          <>
            <SearchInputSkeleton />
            <TagsFilterSkeleton />
            <div className="flex flex-col">
              {[1, 2, 3].map((i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          </>
        }
      >
        <BlogPostsHydration />
      </Suspense>
    </div>
  );
}
