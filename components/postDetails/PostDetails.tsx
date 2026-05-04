"use client";

import type { Tag } from "@/types/cms";

import BackToBlog from "./BackToBlog";
import UserBadge from "../ui/UserBadge";
import { usePost } from "@/hooks/posts/usePost";
import PostDetailsSkeleton from "../skeleton/PostDetailsSkeleton";
import { useEffect, useRef } from "react";
import StructuredContent from "./StructuredContent";
import { notFound } from "next/navigation";
import QueryErrorRetry from "../ui/QueryErrorRetry";
import ShareButton from "./ShareButton";

export default function PostDetails({ slug }: { slug: string }) {
  const { post, isLoading, isError, isFetching, refetch } = usePost(slug);

  const isDeleted: boolean =
    post?.status === "deleted" || post?.deleted_at !== null;

  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!slug || isLoading || hasIncremented.current) return;

    hasIncremented.current = true;

    fetch(`/api/views/${slug}`, { method: "POST" }).catch((err) =>
      console.error("Analytics error:", err),
    );
  }, [slug, isLoading]);

  if (isLoading) {
    return <PostDetailsSkeleton />;
  }

  if (isError)
    return <QueryErrorRetry query={{ isError, refetch, isFetching }} />;

  if (!post) notFound();

  return (
    <div className="flex flex-col w-full">
      <header className=" mx-auto w-full pt-8 pb-8 md:px-4 flex flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <BackToBlog />
          <ShareButton title={post.title} />
        </div>

        {isDeleted && (
          <div className="py-4 text-sm text-destructive">
            هذا المقال محذوف، انت فقط يمكنك رؤيته.
          </div>
        )}

        <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-col justify-between gap-y-6 border-y border-[#E5E7EB] dark:border-card-hover py-6">
          <UserBadge
            date={post.created_at}
            updatedAt={post.updated_at}
            view_count={post.view_count}
          />

          {post?.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(
                (Array.isArray(post?.tags) ? post.tags : [post?.tags]).filter(
                  Boolean,
                ) as Tag[]
              ).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 2. The Content Section */}
      <StructuredContent blocks={post.content.blocks} />
    </div>
  );
}
