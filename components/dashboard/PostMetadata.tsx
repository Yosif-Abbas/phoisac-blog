import React from "react";
import Tags from "./Tags";
import type { Tag } from "@/types/cms";

interface PostMetadataProps {
  stats: { words: number; time: number };
  totalMB: string;
  existingTags: Tag[];
}

export default function PostMetadata({
  stats,
  totalMB,
  existingTags,
}: PostMetadataProps) {
  return (
    <div className="w-full bg-white/5 dark:bg-[#1F2937]/30 border border-[#E5E7EB] dark:border-card-hover rounded-xl p-4 ">
      <div className="flex flex-col gap-x-4 text-sm text-muted-foreground  pb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground pb-1">
          الاحصائيات (Stats)
        </h3>
        <div className="text-xs">
          <p>{stats.words} كلمة</p>
          <p>{stats.time} دقيقة قراءة</p>
          <p>حجم الملفات: {totalMB} ميجابايت</p>
        </div>
      </div>
      <Tags existingTags={existingTags} />
    </div>
  );
}
