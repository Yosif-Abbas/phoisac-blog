"use client";

import { usePosts } from "@/hooks/posts/usePosts";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCardSkeleton from "../../skeleton/PostCardSkeleton";
import PostItem from "../../posts/PostItem";
import PostItemEdit from "./PostItemEdit";

export default function PostListEdit() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // 1. The Search / Filter Loading State
  // This triggers when the queryKey changes and we have no cached data
  if (isLoading) {
    return (
      <div className="flex flex-col">
        {[1, 2, 3].map((i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 2. The Empty State
  // If the fetch is done, but the first page has 0 posts
  if (!data?.pages[0]?.posts?.length) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <span className="text-4xl mb-4">📭</span>
        <h3 className="text-xl font-bold text-foreground mb-2">
          لا توجد نتائج
        </h3>
        <p className="text-muted-foreground max-w-sm">
          لم نتمكن من العثور على أي منشورات تطابق بحثك أو الوسوم المحددة. جرب
          كلمات مفتاحية أخرى!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ul className="">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.posts.map((post) => (
              <PostItemEdit key={post.slug} post={post} />
            ))}
          </React.Fragment>
        ))}
      </ul>

      {/* The Trigger Element for Infinite Scroll */}
      <div ref={ref} className="py-4 flex justify-center">
        {isFetchingNextPage ? (
          <div className="flex flex-col w-full">
            <PostCardSkeleton />
          </div>
        ) : hasNextPage ? (
          <span className="text-muted-foreground text-sm italic">
            جاري تحميل المزيد...
          </span>
        ) : (
          <span className="text-muted-foreground text-sm pt-4 w-full text-center">
            وصلت إلى نهاية الفوضى.
          </span>
        )}
      </div>
    </div>
  );
}
