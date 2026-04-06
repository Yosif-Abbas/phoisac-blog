"use client";

import { useRef, useState } from "react";
import Editor, { EditorHandle } from "../Editor";
import { OutputData } from "@editorjs/editorjs";
import { useQuery } from "@tanstack/react-query";
import { getPage } from "@/services/client/pages";
import EditorSkeleton from "../../skeleton/EditorSkeleton";
import { useUpdatePage } from "@/hooks/pages/useUpdatePage";

export default function PageForm({ page_name }: { page_name: string }) {
  const { data: initialData } = useQuery({
    queryKey: ["pages", page_name],
    queryFn: () => getPage({ page_name }),
  });

  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  const editorRef = useRef<EditorHandle>(null);

  const [editorData, setEditorData] = useState<OutputData | undefined>(
    initialData?.content,
  );

  const { mutate: updatePage, isPending } = useUpdatePage();

  function handleSubmit(e) {
    e.preventDefault();
    updatePage({ page_name, content: editorData });
  }

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={isPending}
        className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "جاري الحفظ..." : "حفظ"}
      </button>

      {!isEditorLoaded && (
        <div className="bg-container">
          <EditorSkeleton />
        </div>
      )}

      <div className="max-w-none w-full mt-6">
        <Editor
          ref={editorRef}
          onReady={() => setIsEditorLoaded(true)}
          onChange={setEditorData}
          data={initialData?.content}
          placeholder="ابدأ في الكتابة..."
        />
      </div>
    </form>
  );
}
