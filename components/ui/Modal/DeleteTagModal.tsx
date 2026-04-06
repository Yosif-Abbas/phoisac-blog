"use client";

import { useState } from "react";

import Modal from "./Modal";
import { Loader2, Trash2 } from "lucide-react";
import { Tag } from "@/types/post";
import { useDeleteTag } from "@/hooks/tags/useDeleteTag";

type ModalTriggerProps = {
  title: string;
  tag: Tag;
};

export default function DeleteTagModal({ title, tag }: ModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteTag, isPending } = useDeleteTag();

  function handleDelete() {
    //delete tag
    deleteTag({ tagId: tag.id });
    setIsOpen(false);
  }

  return (
    <>
      <button
        className={`p-2 hover:bg-destructive/20 text-destructive rounded-lg transition-colors ${isPending ? "bg-destructive/20" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title="حذف المنشور"
      >
        {isPending ? (
          <Loader2 className="text-destructive animate-spin" size={20} />
        ) : (
          <Trash2
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            size={16}
          />
        )}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          هل انت متأكد من انك تريد حذف الوسم &quot;
          <span className="font-bold">{tag.name}</span>&quot;؟ سيتم حذف هذا
          الوسم من {tag.count} منشورات
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {" "}
          هذه العملية لا يمكن الرجوع فيها.
        </p>
        <div className="flex gap-x-2">
          <button
            className="mt-2 w-fit px-3 py-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-xl font-bold  transition-transform flex items-center"
            disabled={!tag.id || isPending}
            onClick={() => handleDelete()}
          >
            <span>حذف</span>
          </button>
          <button
            className="mt-2 w-fit px-3 py-2 bg-ghost text-muted-foreground hover:text-foreground  rounded-xl font-bold  transition-transform flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <span>إلغاء</span>
          </button>
        </div>
      </Modal>
    </>
  );
}
