"use client";

import { formatDate } from "@/lib/utils/formatDate";
import type { Post } from "@/types/cms";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ImageIcon } from "lucide-react";
import Image from "next/image";

export default function PostItem({ post }: { post: Post }) {
  const searchParams = useSearchParams();
  const selectedTagNames = searchParams.getAll("tag");
  const selectedTagSet = new Set(selectedTagNames);

  const updatedAt = String(post.updated_at);
  const createdAt = String(post.created_at);

  const isModified = Boolean(post.updated_at);
  const hasImage = !!post.cover_image_url;

  return (
    <li className="list-none group w-full block">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block p-4 sm:p-6 rounded-2xl border border-transparent hover:border-card-hover hover:bg-container/50 transition-all duration-300 shadow-sm hover:shadow-md w-full"
      >
        {/* CRITICAL FIX 1: Explicit max-width container using a grid or table simulation row to isolate parent overflow bugs */}
        <div className="grid grid-cols-[auto_1fr] gap-4 sm:gap-6 w-full items-start">
          {/* Cover Image: Left Col */}
          <div className="shrink-0 relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-card-hover bg-secondary/10">
            {hasImage ? (
              <Image
                src={post.cover_image_url as string}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 640px) 80px, 112px"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-background text-primary/80">
                <ImageIcon size={24} strokeWidth={1.5} />
                <span className="text-[10px] mt-1 font-medium opacity-50">
                  لا توجد صورة
                </span>
              </div>
            )}
          </div>

          {/* CRITICAL FIX 2: The right column gets forced containment via grid child mechanics or w-0 */}
          <div className="flex flex-col gap-y-3 min-w-0 w-full">
            {/* Top Row: Meta info */}
            <div className="flex items-center justify-between text-[11px] tracking-wider font-medium w-full gap-x-4">
              <div className="flex flex-wrap gap-2 min-w-0">
                {post.tags?.map((tag: any) => {
                  const isSelected = selectedTagSet.has(tag.name);

                  return (
                    <span
                      key={tag.id}
                      className={`px-2 py-0.5 rounded-md text-nowrap transition-colors text-xs ${
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
                className="text-muted-foreground opacity-80 text-nowrap shrink-0"
                title={
                  isModified
                    ? new Date(String(updatedAt)).toLocaleString("ar-EG")
                    : new Date(String(createdAt)).toLocaleString("ar-EG")
                }
                suppressHydrationWarning
              >
                {isModified ? formatDate(updatedAt) : formatDate(createdAt)}
              </time>
            </div>

            {/* Title: The Hero - Enforced overflow tracking */}
            <div className="w-full block min-w-0">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                {post.title}
              </h2>
            </div>

            {/* Preview Text */}
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2 max-w-3xl w-full">
              {post.excerpt || "إقرأ المزيد عن هذا المنشور..."}
            </p>

            {/* Bottom Row: Interaction Hint */}
            <div className="flex items-center gap-x-1 text-primary text-xs font-bold pt-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 self-start">
              <span>إقرأ المقال</span>
              <ChevronLeft size={14} />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
