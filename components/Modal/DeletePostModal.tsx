"use client";

import { useState } from "react";

import Modal from "./Modal";
import { Loader2, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useDeletePost } from "@/hooks/posts/useDeletePost";

import { useRouter } from "next/navigation";

type ModalTriggerProps = {
  title: string;
};

export default function DeletePostModal({ title }: ModalTriggerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : undefined;
  const { deletePost, isPending } = useDeletePost();

  function handleDelete() {
    if (!slug) return;
    deletePost({ slug });

    setIsOpen(false);
    router.push("/blog");
  }

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="حذف المنشور"
        className="p-3 hover:bg-destructive/20 text-destructive rounded-xl transition-colors flex items-center justify-center gap-x-2"
      >
        {isPending ? (
          <Loader2 className="text-destructive animate-spin" size={20} />
        ) : (
          <Trash2 size={20} />
        )}
        <span className="lg:hidden">حذف المنشور</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          هل انت متأكد من انك تريد حذف المنشور؟ هذه العملية لا يمكن الرجوع فيها.
        </p>
        <div className="flex gap-x-2">
          <button
            className="mt-2 w-fit px-3 py-2 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-xl font-bold  transition-transform flex items-center"
            disabled={!slug || isPending}
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
