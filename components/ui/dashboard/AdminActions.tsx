"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DeletePostModal from "../Modal/DeletePostModal";

export default function AdminActions() {
  const pathname = usePathname();

  const slug = pathname.split("/").pop();

  const isPostPage = pathname.startsWith("/blog/") && pathname !== "/blog";

  if (!isPostPage) return null;

  return (
    <div className="col-start-1 row-start-1 lg:row-start-1 lg:col-start-3 lg:flex items-start h-fit">
      <div className="flex flex-col gap-y-2 p-2 bg-container backdrop-blur-md lg:rounded-2xl border border-white/5 shadow-md sticky top-24 duration-300">
        {/* Edit Button - Links to your dashboard edit route */}
        <Link
          href={`/dashboard/edit-post/${slug}`}
          title="تعديل المنشور"
          className="p-3 hover:bg-primary/20 text-primary rounded-xl transition-colors flex items-center justify-center gap-x-2"
        >
          <Pencil size={20} />
          <span className="lg:hidden">تعديل المنشور</span>
        </Link>

        <DeletePostModal title="حذف المنشور" />
      </div>
    </div>
  );
}
