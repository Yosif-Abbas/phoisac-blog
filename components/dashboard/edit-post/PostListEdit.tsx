"use client";

import { usePosts } from "@/hooks/posts/usePosts";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCardSkeleton from "../../skeleton/PostCardSkeleton";
import PostItemEdit from "./PostItemEdit";
import type { Post } from "@/types/cms";
import PostCardEditSkeleton from "@/components/skeleton/PostCardEditSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import QueryErrorRetry from "@/components/ui/QueryErrorRetry";

export default function PostListEdit() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isError,
  } = usePosts();

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
        {[1, 2, 3, 4, 5].map((i) => (
          <PostCardEditSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError)
    return (
      <QueryErrorRetry
        query={{ isError, refetch, isFetching: isFetchingNextPage }}
      />
    );

  // 2. The Empty State
  // If the fetch is done, but the first page has 0 posts
  if (!data?.pages[0]?.posts?.length) {
    return (
      <EmptyState
        title="لا توجد نتائج!"
        description="
      لم نتمكن من العثور على أي منشورات تطابق بحثك أو الوسوم المحددة. جرب كلمات مفتاحية أخرى!"
      />
    );
  }

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col gap-y-4">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.posts.map((post) => (
              <PostItemEdit key={post.slug} post={post as Post} />
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
