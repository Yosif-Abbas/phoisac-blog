"use client";

import { useCreateTag } from "@/hooks/tags/useCreateTag";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function TagsForm() {
  const [tagInput, setTagInput] = useState("");
  const { mutate: addTag, isPending } = useCreateTag();

  function handleAdd(e) {
    e.preventDefault();
    const newTag = tagInput.trim().toLowerCase();
    if (!newTag) return;

    addTag(newTag, {
      onSuccess: () => {
        setTagInput("");
      },
    });
  }

  return (
    <section className="bg-white/5 border border-[#1F2937] p-6 rounded-2xl flex flex-col gap-y-4">
      <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-widest">
        إضافة وسم جديد
      </h2>
      <form onSubmit={handleAdd} className="flex gap-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="أضف وسماً..."
            className="w-full bg-background border border-[#1F2937] rounded-xl px-4 py-3 focus:ring-1 focus:ring-[#1F2937] outline-none transition-all"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            {isPending ? (
              <Loader2 className="text-primary animate-spin" size={16} />
            ) : (
              ""
            )}
          </div>
        </div>
        <button
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
          type="submit"
          disabled={isPending}
        >
          إضافة
        </button>
      </form>
    </section>
  );
}
