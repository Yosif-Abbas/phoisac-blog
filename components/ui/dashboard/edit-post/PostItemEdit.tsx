"use client";

import { formatDate } from "@/lib/utils/formatDate";
import { Post } from "@/types/post";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default function PostItemEdit({ post }: { post: Post }) {
  return (
    <li className="list-none group">
      <div className="relative block p-6 rounded-2xl border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#1F2937] hover:bg-container/50 transition-all duration-300 shadow-sm hover:shadow-md">
        <div className="flex items-start justify-between">
          {/* Title: The Hero */}

          <div className="flex flex-col gap-y-3 ">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h2>
            </Link>

            <div className="flex items-center justify-between  uppercase tracking-wider font-medium">
              <time
                className="text-muted-foreground opacity-80 text-nowrap self-start "
                title={new Date(post.created_at).toLocaleString("ar-EG")}
                suppressHydrationWarning
              >
                {formatDate(post.created_at)}
              </time>
            </div>
          </div>

          {/* Bottom Row: Interaction Hint */}
          <Link
            href={`/dashboard/edit-post/${post.slug}`}
            className="flex lg:hidden group-hover:flex bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:bg-primary/90 transition-all items-center gap-x-2"
          >
            <Pencil size={18} />
            <span className="text-nowrap">تعديل المنشور</span>
          </Link>
        </div>
      </div>
    </li>
  );
}
