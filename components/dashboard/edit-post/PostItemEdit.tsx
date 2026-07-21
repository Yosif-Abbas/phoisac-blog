"use client";

import { formatDate } from "@/lib/utils/formatDate";
import type { Post } from "@/types/cms";
import { Pencil, Calendar, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PostItemEdit({ post }: { post: Post }) {
  console.log(post);
  const updatedAt = String(post.updated_at);
  const createdAt = String(post.created_at);

  const isModified =
    updatedAt && new Date(updatedAt).getTime() > new Date(createdAt).getTime();

  return (
    <li className="list-none group w-full block">
      <div className="relative p-5 md:p-6 rounded-2xl border border-card-hover/50 hover:border-primary/30 bg-card/30 hover:bg-card/80 transition-all duration-300 shadow-sm hover:shadow-lg w-full">
        {/* The Grid Fix: auto (image) | 1fr (text constraint) | auto (button) */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-6 w-full">
          {/* Left Col: Thumbnail */}
          <div className="relative w-16 h-16 md:w-32 md:h-32 rounded-xl overflow-hidden bg-secondary/30 border border-border/50">
            {post.cover_image_url ? (
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                loading="eager"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 64px, 128px"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-background text-primary/80">
                <ImageIcon size={28} strokeWidth={1.5} />
                <span className="text-[10px] mt-1 font-medium opacity-50">
                  لا توجد صورة
                </span>
              </div>
            )}
          </div>

          {/* Middle Col: Strict Content Containment */}
          <div className="flex flex-col gap-y-2 md:gap-y-3 min-w-0 w-full">
            {/* Title Wrapper locks the truncation to the 1fr column width */}
            <div className="w-full block min-w-0">
              <Link
                href={`/blog/${post.slug}`}
                className="block w-full hover:underline min-w-0"
              >
                <h2
                  className="font-serif text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight truncate"
                  title={post.title}
                >
                  {post.title}
                </h2>
              </Link>
            </div>

            <div className="flex items-center gap-x-2 text-sm text-muted-foreground/80 font-medium">
              <Calendar size={14} className="text-primary/60" />
              <time
                title={
                  isModified
                    ? new Date(String(updatedAt)).toLocaleString("ar-EG")
                    : new Date(String(createdAt)).toLocaleString("ar-EG")
                }
              >
                {isModified ? formatDate(updatedAt) : formatDate(createdAt)}
              </time>
            </div>
          </div>

          {/* Right Col: Action Button */}
          <Link
            href={`/dashboard/edit-post/${post.slug}`}
            className="flex items-center justify-center gap-x-2 bg-primary text-primary-foreground h-12 px-4 md:px-6 rounded-xl font-bold hover:bg-primary/90 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <Pencil size={18} />
            <span className="whitespace-nowrap">تعديل</span>
          </Link>
        </div>
      </div>
    </li>
  );
}
