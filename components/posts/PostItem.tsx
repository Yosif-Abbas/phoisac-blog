"use client";

import { formatDate } from "@/lib/utils/formatDate";
import type { Post } from "@/types/cms";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react"; // Or ChevronRight for RTL

export default function PostItem({ post }: { post: Post }) {
  const searchParams = useSearchParams();
  const selectedTagNames = searchParams.getAll("tag");
  const selectedTagSet = new Set(selectedTagNames);

  return (
    <li className="list-none group">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block p-6 rounded-2xl border border-transparent hover:border-[#E5E7EB] dark:hover:border-card-hover hover:bg-container/50 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <div className="flex flex-col gap-y-3">
          {/* Top Row: Meta info */}
          <div className="flex items-center justify-between text-[11px] tracking-wider font-medium">
            <div className="flex flex-wrap gap-2">
              {post.tags?.map((tag) => {
                const isSelected = selectedTagSet.has(tag.name);

                return (
                  <span
                    key={tag.id}
                    className={`px-2 py-0.5 rounded-md text-nowrap transition-colors ${
                      isSelected
                        ? "text-primary-foreground bg-primary border border-primary"
                        : "text-primary bg-primary/10"
                    }`}
                  >
                    {tag.name}
                  </span>
                );
              })}
            </div>
            <time
              className="text-muted-foreground opacity-80 text-nowrap self-start "
              title={
                post.created_at
                  ? new Date(post.created_at).toLocaleString("ar-EG")
                  : ""
              }
              suppressHydrationWarning
            >
              {formatDate(post.created_at)}
            </time>
          </div>

          {/* Title: The Hero */}
          <h2 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h2>

          {/* Preview Text */}
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 max-w-3xl">
            {post.excerpt || "إقرأ المزيد عن هذا المنشور..."}
          </p>

          {/* Bottom Row: Interaction Hint */}
          <div className="flex items-center gap-x-1 text-primary text-xs font-bold pt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <span>إقرأ المقال</span>
            <ChevronLeft size={14} /> {/* Reversed for Arabic flow */}
          </div>
        </div>
      </Link>
    </li>
  );
}
