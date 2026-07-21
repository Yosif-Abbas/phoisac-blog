"use client";

import PostPreview from "./PostPreview";
import PostCardSkeleton from "@/components/skeleton/PostCardSkeleton";
import { useLatestPosts } from "@/hooks/posts/useLatestPosts";
import QueryErrorRetry from "../ui/QueryErrorRetry";
import EmptyState from "../ui/EmptyState";

const limit = Number(process.env.NEXT_PUBLIC_LATEST_POSTS_LIMIT) || 2;

export default function LatestPosts() {
  const { posts, isLoading, isError, refetch, isFetching } = useLatestPosts({
    limit,
  });

  if (isError)
    return <QueryErrorRetry query={{ isError, refetch, isFetching }} />;

  if (!isLoading && (!posts || posts.length === 0))
    return (
      <EmptyState
        title="لا يوجد منشورات"
        description="لم يتم ينشر اي محتوى مؤخراً!"
      />
    );

  return (
    <div className="grid grid-cols-1 gap-y-8">
      {isLoading
        ? [1, 2, 3].map((i) => <PostCardSkeleton key={i} />)
        : posts?.map((post) => (
            <PostPreview
              key={post.slug}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              date={post.last_activity}
              tags={post.tags}
              cover_image_url={post.cover_image_url}
            />
          ))}
    </div>
  );
}
