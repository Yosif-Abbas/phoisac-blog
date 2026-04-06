import { Suspense } from "react";
import PostCardSkeleton from "@/components/ui/skeleton/PostCardSkeleton";
import BlogPostsHydration from "@/components/ui/posts/BlogPostsHydration";
import Filter from "@/components/ui/Filter";
import Search from "../../components/ui/Search";

export default function Blog() {
  return (
    <div className="flex flex-col gap-y-6 h-full w-full">
      {/* 1. This part is STATIC and will show INSTANTLY */}
      <div className="flex items-baseline gap-x-2 border-b border-[#1F2937] pb-4">
        <h1 className="text-3xl font-bold text-foreground">المدونة</h1>
      </div>
      <div className="flex items-baseline gap-x-2 border-b border-[#1F2937] pb-4">
        <p className="text-muted-foreground">
          استكشف أحدث المنشورات والمقالات الإبداعية.
        </p>
      </div>

      {/* 2. DISCOVERY BAR (Search + Filter Chips) */}
      <section className="flex flex-col gap-y-6">
        <Search />

        <Filter />
      </section>

      {/* 2. This part is ASYNC. Suspense shows the skeleton while the server fetches */}
      <Suspense
        fallback={
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <BlogPostsHydration />
      </Suspense>
    </div>
  );
}
