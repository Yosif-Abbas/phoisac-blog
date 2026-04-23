import { Suspense } from "react";
import PostCardSkeleton from "@/components/skeleton/PostCardSkeleton";
import BlogPostsHydration from "@/components/posts/BlogPostsHydration";
import SearchInputSkeleton from "@/components/skeleton/blog/SearchSkeleton";
import TagsFilterSkeleton from "@/components/skeleton/blog/TagsFilterSkeleton";
import { Metadata } from "next";
import { getSiteSettings } from "@/services/server/settings";

export const metadata: Metadata = {
  title: "مدونة أدبية",
};

export default async function Blog() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-y-6 h-full w-full">
      <div className="flex items-baseline gap-x-2 border-b border-card-hover pb-4">
        <h1 className="text-3xl font-bold text-foreground">المدونة</h1>
      </div>
      {settings.blog_page_description && (
        <div className="flex items-baseline gap-x-2 border-b border-card-hover pb-4">
          <p className="text-muted-foreground">
            {settings.blog_page_description}
          </p>
        </div>
      )}

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
