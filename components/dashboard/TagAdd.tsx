"use client";

import { useCreateTag } from "@/hooks/tags/useCreateTag";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

export default function TagAdd() {
  const [tagInput, setTagInput] = useState("");
  const { mutate: addTag, isPending } = useCreateTag();

  function handleAdd() {
    const newTag = tagInput.trim().toLowerCase();
    if (!newTag) return;

    addTag(newTag, {
      onSuccess: () => {
        setTagInput("");
      },
    });
  }

  return (
    <div className="flex items-center bg-container border border-card-hover rounded-lg px-2 py-1 focus-within:border-primary/50 transition-colors">
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && (e.preventDefault(), handleAdd())
        }
        placeholder="أضف وسماً..."
        className="bg-transparent outline-none text-xs w-24 md:w-32 py-1 placeholder:text-muted-foreground/50"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="text-primary hover:scale-105 transition-transform p-1"
      >
        {isPending ? (
          <Loader2 className="text-primary animate-spin" size={16} />
        ) : (
          <Plus size={16} />
        )}
      </button>
    </div>
  );
}
