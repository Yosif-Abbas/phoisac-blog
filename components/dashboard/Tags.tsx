"use client";

import { Tags as TagsIcon } from "lucide-react";
import EmptyState from "../ui/EmptyState";
import TagAdd from "./TagAdd";
import { usePostFormTags } from "./context/TagsContext";
import type { Tag } from "@/types/cms";

interface Props {
  existingTags: Tag[];
}

export default function Tags({ existingTags }: Props) {
  const { tags: markedTags, toggleTag } = usePostFormTags();

  return (
    <div className="flex flex-col gap-y-4 w-full border-t border-card-hover pt-4 ">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          الوسوم (Tags)
        </h3>
        <TagAdd />
      </div>

      {/* Tag Cloud Container */}
      <div className="flex gap-2 flex-wrap    p-1">
        {!existingTags || existingTags.length === 0 ? (
          <EmptyState
            icon={TagsIcon}
            title="لا توجد أي وسوم!"
            description="قم بإضافة اول وسم!"
          />
        ) : (
          existingTags?.map((tag) => {
            const isMarked = markedTags.some((t) => t.id === tag.id);
            return (
              <button
                key={tag.id}
                type="button" // Important so it doesn't submit the form
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 border ${
                  isMarked
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]"
                    : "bg-container border-card-hover text-muted-foreground hover:border-gray-500"
                }`}
              >
                {tag.name}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
