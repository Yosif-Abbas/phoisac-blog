"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTags } from "@/hooks/tags/useTags";
import TagsFilterSkeleton from "../skeleton/blog/TagsFilterSkeleton";

export default function Filter() {
  const { tags, isLoading } = useTags();
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticTags, setOptimisticTags] = useState<string[] | null>(null);

  const selectedTagNames = searchParams.getAll("tag");
  const currentTags =
    optimisticTags !== null ? optimisticTags : selectedTagNames;
  const selectedTagSet = new Set(currentTags);

  const sortedTags = tags
    ? tags
        .filter((tag) => tag.published_post_count > 0)
        .sort((a, b) => {
          const aSelected = selectedTagSet.has(a.name);
          const bSelected = selectedTagSet.has(b.name);
          return Number(bSelected) - Number(aSelected);
        })
    : [];

  const visibleTags = isOpen ? sortedTags : sortedTags.slice(0, 5);

  const handleTagToggle = (tagName: string) => {
    const nextTags = currentTags.includes(tagName)
      ? currentTags.filter((t) => t !== tagName)
      : [...currentTags, tagName];

    setOptimisticTags(nextTags);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    nextTags.forEach((t) => params.append("tag", t));

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  if (isLoading) return <TagsFilterSkeleton />;

  if (sortedTags.length === 0) return null;

  return (
    <div
      className={`flex items-center flex-wrap gap-x-3 gap-y-2  transition-opacity ${isPending ? "opacity-70" : "opacity-100"}`}
    >
      {/* <button className="flex items-center gap-x-2 px-4 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] rounded-full text-sm font-bold whitespace-nowrap">
        الكل
      </button> */}
      {visibleTags.map((tag) => {
        const selected = selectedTagSet.has(tag.name);

        return (
          <button
            key={tag.name}
            type="button"
            onClick={() => handleTagToggle(tag.name)}
            className={`inline-flex items-center gap-x-2 px-2 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap min-w-16 border  ${
              selected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-tag text-tag-foreground border-tag-border hover:bg-tag-hover"
            }`}
          >
            <span className="w-full">{tag?.name}</span>
            {selected ? <X size={18} /> : null}
          </button>
        );
      })}

      {sortedTags && sortedTags.length > 5 && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
          flex items-center gap-x-2 p-2 px-4 rounded-full border transition-all
          ${
            isOpen
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-container text-muted-foreground border-card-hover hover:border-muted"
          }
            `}
        >
          <span className="text-sm font-bold">
            {isOpen ? "إغلاق" : "كل الوسوم"}
          </span>
          <SlidersHorizontal
            size={18}
            className={isOpen ? "rotate-90 transition-transform" : ""}
          />
        </button>
      )}
    </div>
  );
}
