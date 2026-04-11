"use client";

import { formatDate } from "@/lib/utils/formatDate";
import type { Post } from "@/types/cms";
import { Pencil, Calendar } from "lucide-react";
import Link from "next/link";

export default function PostItemEdit({ post }: { post: Post }) {
  return (
    <li className="list-none group ">
      <div className="relative p-5 md:p-6 rounded-2xl border border-card-hover/50 hover:border-primary/30 bg-card/30 hover:bg-card/80 transition-all duration-300 shadow-sm hover:shadow-lg">
        {/* Layout: Vertical stack on mobile, Row on Large */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Side: Content */}
          <div className="flex-1 space-y-3">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-block hover:underline"
            >
              <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight ">
                {post.title}
              </h2>
            </Link>

            <div className="flex items-center gap-x-2 text-sm text-muted-foreground/80 font-medium">
              <Calendar size={14} className="text-primary/60" />
              <time
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
          </div>

          {/* Right Side: The Action Button */}
          <Link
            href={`/dashboard/edit-post/${post.slug}`}
            className="
              flex items-center justify-center gap-x-2 
              bg-primary text-primary-foreground 
              h-12 md:h-11 px-6 
              rounded-xl font-bold 
              hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] 
              transition-all duration-200
              opacity-100 md:opacity-0 md:group-hover:opacity-100
            "
          >
            <Pencil size={18} />
            <span className="text-sm md:text-base">تعديل المنشور</span>
          </Link>
        </div>
      </div>
    </li>
  );
}
