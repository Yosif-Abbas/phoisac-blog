"use client";

import TagCard from "./TagCard";
import { useTags } from "@/hooks/tags/useTags";

export default function TagsList() {
  const { tags } = useTags();

  if (tags && tags?.length === 0) {
    return (
      <div className="p-10 border-2 border-dashed border-[#1F2937] rounded-3xl text-center">
        <p className="text-muted-foreground italic text-sm">
          لا توجد أوسمة حالياً.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 3. The Tags Grid */}
      <section className="flex flex-col gap-y-6">
        <h2 className="text-xl font-bold">جميع الأوسمة ({tags.length})</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Now tags is definitely an array, so .map() works! */}
          {tags.map((tag) => (
            <TagCard key={tag.id} tag={tag} />
          ))}
        </div>
      </section>
    </>
  );
}
