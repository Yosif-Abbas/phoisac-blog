"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { usePosts } from "@/hooks/posts/usePosts"; // Adjust path if needed
import PostItem from "./PostItem";
import type { Post } from "@/types/cms";
import PostCardSkeleton from "../skeleton/PostCardSkeleton";
import EmptyState from "../ui/EmptyState";
import QueryErrorRetry from "../ui/QueryErrorRetry";

export default function PostsList() {
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

  if (isLoading) {
    return (
      <div className="flex flex-col">
        {[1, 2, 3].map((i) => (
          <PostCardSkeleton key={i} />
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
      <ul className="">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.posts.map((post) => (
              <PostItem key={post.slug} post={post as Post} />
            ))}
          </React.Fragment>
        ))}
      </ul>

      <div ref={ref} className="py-4 flex justify-center">
        {isFetchingNextPage ? (
          <div className="flex flex-col w-full">
            <PostCardSkeleton />
          </div>
        ) : (
          <span className="text-muted-foreground text-sm pt-4 w-full text-center">
            وصلت إلى نهاية الفوضى.
          </span>
        )}
      </div>
    </div>
  );
}
