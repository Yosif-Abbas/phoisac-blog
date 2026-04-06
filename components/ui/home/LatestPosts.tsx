"use client";

import PostPreview from "./PostPreview";
import PostCardSkeleton from "@/components/ui/skeleton/PostCardSkeleton";
import { useLatestPosts } from "@/hooks/posts/useLatestPosts";

const limit = Number(process.env.NEXT_PUBLIC_LATEST_POSTS_LIMIT) || 2;

export default function LatestPosts() {
  const { posts, isLoading } = useLatestPosts({ limit });

  return (
    <div className="grid grid-cols-1 gap-y-8">
      {isLoading
        ? [1, 2].map((i) => <PostCardSkeleton key={i} />)
        : posts?.map((post) => (
            <PostPreview
              key={post.slug}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              date={post.updated_at ?? post.created_at}
              tags={post.tags}
            />
          ))}
    </div>
  );
}
