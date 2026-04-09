"use client";

import TagCard from "./TagCard";
import { useTags } from "@/hooks/tags/useTags";
import QueryErrorRetry from "@/components/ui/QueryErrorRetry";
import TagsSkeleton from "@/components/skeleton/TagsSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { Tags as TagsIcon } from "lucide-react";

export default function TagsList() {
  const { tags, isLoading, isFetching, isError, refetch } = useTags();

  if (isLoading) return <TagsSkeleton />;

  if (isError)
    return <QueryErrorRetry query={{ isFetching, isError, refetch }} />;

  if (!tags || tags?.length === 0) {
    return (
      <EmptyState
        icon={TagsIcon}
        title="لا توجد أي وسوم!"
        description="قم بإضافة اول وسم!"
      />
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
