"use client";

import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import Modal from "./Modal";
import { Loader2, Pencil } from "lucide-react";
import { useUpdateTag } from "../../hooks/tags/useUpdateTag";
import type { Tag } from "@/types/cms";

type ModalTriggerProps = {
  tag: Tag;
  title: string;
};

export default function EditTagModal({ title, tag }: ModalTriggerProps) {
  const { count, name, id } = tag;
  const countNum = count ?? 0;

  const [isOpen, setIsOpen] = useState(false);
  const [newTag, setNewTag] = useState(name);

  const { updateTag, isPending } = useUpdateTag();

  function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (newTag === name) return;
    updateTag({ tagId: id, tagName: newTag });
    setIsOpen(false);
  }

  return (
    <>
      <button
        className={`p-2 hover:bg-white/5 text-muted-foreground hover:text-foreground rounded-lg transition-colors ${isPending ? "bg-white/5" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title={title}
      >
        {isPending ? (
          <Loader2 className="text-foreground animate-spin " size={20} />
        ) : (
          <Pencil
            size={16}
            className="lg:opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          سوف يتم تعديل اسم هذا الوسم على {countNum}{" "}
          {(countNum > 1 && countNum < 11) || countNum === 0
            ? "منشورات"
            : "منشور"}
          .
        </p>
        <form onSubmit={handleUpdate} className="flex flex-col gap-y-2">
          <input
            type="text"
            placeholder="مثلاً: أدب رحلات..."
            value={newTag}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewTag(e.target.value)
            }
            className="w-full bg-background border border-card-hover rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          <div className="flex gap-x-2">
            <button
              type="submit"
              className="mt-2 w-fit px-3 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-xl font-bold  transition-transform flex items-center"
              disabled={!id || isPending}
            >
              <span>تعديل</span>
            </button>
            <button
              className="mt-2 w-fit px-3 py-2 bg-ghost text-muted-foreground hover:text-foreground  rounded-xl font-bold  transition-transform flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <span>إلغاء</span>
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
