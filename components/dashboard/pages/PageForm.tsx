"use client";

import { useRef, useState } from "react";
import Editor, { EditorHandle } from "../Editor";
import EditorSkeleton from "../../skeleton/EditorSkeleton";
import { useUpdatePage } from "@/hooks/pages/useUpdatePage";
import { usePage } from "@/hooks/pages/usePage";
import EditorFormSkeleton from "@/components/skeleton/EditorFormSkeleton";
import QueryErrorRetry from "@/components/ui/QueryErrorRetry";
import type { StructuredContent } from "@/types/cms";

export default function PageForm({ page_name }: { page_name: string }) {
  const {
    page: initialData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = usePage({ page_name });

  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const editorRef = useRef<EditorHandle>(null);
  const { mutate: updatePage, isPending } = useUpdatePage();

  // We made this async so we can use your ref!
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const content = await editorRef.current?.save();

    const contentToSave = content as unknown as StructuredContent;

    if (contentToSave) {
      console.log(contentToSave);
      updatePage({ page_name, content: contentToSave });
    }
  }

  if (isError)
    return <QueryErrorRetry query={{ isFetching, refetch, isError }} />;

  return (
    <div className="relative min-h-[60vh] flex flex-col gap-6">
      {isLoading && (
        <div className="w-full">
          <EditorFormSkeleton />
        </div>
      )}

      {!isLoading && !isError && initialData && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex border-b border-card-hover pb-4">
            <button
              type="submit"
              suppressHydrationWarning
              disabled={Boolean(isPending || !isEditorLoaded)}
              className="bg-primary text-primary-foreground px-10 py-3 rounded-xl font-bold transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>
          </div>

          <div className="relative max-w-none w-full">
            {!isEditorLoaded && (
              <div className="">
                <EditorSkeleton />
              </div>
            )}

            <div
              className={`transition-opacity duration-500 ${isEditorLoaded ? "opacity-100" : "opacity-0 invisible"}`}
            >
              <Editor
                ref={editorRef}
                onReady={() => setIsEditorLoaded(true)}
                data={initialData.content}
                placeholder="ابدأ في كتابة الصفحة..."
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
