"use client";

import PostContent from "./PostContent";
import { Tag } from "@/types/post";

import UserBadge from "../UserBadge";
import BackToBlog from "./BackToBlog";
import { getPostBySlug } from "@/services/client/posts";
import { useQuery } from "@tanstack/react-query";

export default function PostDetails({ slug }: { slug: string }) {
  const { data: post } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    staleTime: 1000 * 60 * 5, // Trust this for 5 minutes
  });

  if (!post) return null;

  return (
    <div className="flex flex-col w-full ">
      {/* 1. The Header Section */}
      <header className=" mx-auto w-full pt-12 pb-10 px-4 flex flex-col gap-y-8">
        {/* Title: Using leading-tight for large Arabic text looks much better */}
        <BackToBlog />

        <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-col justify-between gap-y-6 border-y border-[#E5E7EB] dark:border-[#1F2937] py-6">
          <UserBadge date={post.created_at} />

          <div className="flex flex-wrap gap-2">
            {post?.tags?.map((tag: Tag) => (
              <span
                key={tag.id}
                className="text-xs font-medium px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* 2. The Content Section */}
      <PostContent blocks={post.content.blocks} />
    </div>
  );
}
