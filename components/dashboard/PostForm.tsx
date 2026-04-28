"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  useCallback,
} from "react";
import { OutputData } from "@editorjs/editorjs";

import Editor, { EditorHandle } from "@/components/dashboard/Editor";
import Tags from "./Tags";
import PublishConfirmationModal from "./PublishConfirmationModal";
import { usePostFormTags } from "./context/TagsContext";
import type { StructuredContent, Tag } from "@/types/cms";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { useTags } from "@/hooks/tags/useTags";
import QueryErrorRetry from "../ui/QueryErrorRetry";
import EditorFormSkeleton from "../skeleton/EditorFormSkeleton";
import { generateSlug } from "@/lib/utils/media";

// Define what the form expects
type UploadStatus = {
  name: string;
  status: "waiting" | "uploading" | "completed" | "error";
  progress: number;
};

type PostFormData = {
  title: string;
  content: StructuredContent;
  tags: Tag[];
  excerpt?: string;
  slug: string;
};

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  uploadQueue?: UploadStatus[];
}

export type PostFormHandle = {
  reset: () => void;
};

const PostForm = React.forwardRef<PostFormHandle, PostFormProps>(
  function PostForm(
    {
      initialData,
      onSubmit,
      isSubmitting,
      submitLabel = "نشر المقال",
      uploadQueue,
    }: PostFormProps,
    ref,
  ) {
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);
    const editorRef = useRef<EditorHandle>(null);

    // Key used to force remounting the Editor when we need to clear it
    const [editorKey, setEditorKey] = useState(0);

    // Initialize state with initialData if it exists
    const [title, setTitle] = useState(initialData?.title || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [editorData, setEditorData] = useState<OutputData | undefined>(
      initialData?.content,
    );

    const {
      tags: existingTags,
      isLoading,
      isFetching,
      isError,
      refetch,
    } = useTags();

    const { tags, setTags } = usePostFormTags();
    const [isConfirmingLargeUpload, setIsConfirmingLargeUpload] =
      useState(false);
    const [pendingSubmitData, setPendingSubmitData] =
      useState<PostFormData | null>(null);

    const reset = useCallback(() => {
      setTitle("");
      setExcerpt("");
      setEditorData(undefined);
      setTags([]);
      setPendingSubmitData(null);
      setIsConfirmingLargeUpload(false);
      setEditorKey((k) => k + 1);
    }, [setTags]);

    useImperativeHandle(ref, () => ({
      reset,
    }));

    const getPostStats = () => {
      if (!editorData || !editorData.blocks) return { words: 0, time: 0 };

      let text = "";
      editorData.blocks.forEach((block) => {
        // Extract text from paragraphs and headers
        if (block.type === "paragraph" || block.type === "header") {
          // Remove HTML tags that Editor.js might include (like <b> or <i>)
          text += (block.data.text || "").replace(/<[^>]*>?/gm, "") + " ";
        }
      });

      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const time = Math.ceil(words / 125);

      return { words, time };
    };

    const stats = getPostStats();

    const getExcerptFromEditor = (content: OutputData | undefined) => {
      if (!content?.blocks || content.blocks.length === 0) return "";

      for (const block of content.blocks) {
        let text = block.data?.text;
        if (block.type === "poem") {
          const sadr = block.data?.cols[0].sadr;
          const ajuuz = block.data?.cols[0].ajuuz;
          text = `${sadr} ${ajuuz ? "✦ " + ajuuz : ""}`;
        }

        if (!text) continue;

        const plainText = text
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim();

        if (plainText) {
          return `${plainText.length > 120 ? plainText.slice(0, 120).trim() + "..." : plainText.slice(0, 120).trim()}`;
        }
      }

      return "";
    };

    const getUploadStats = (
      blocks:
        | Array<{
            type?: string;
            data?: { file?: { localFile?: File } };
          }>
        | undefined,
    ) => {
      if (!blocks) return;
      const images = blocks
        .filter((b) => b.type === "image" && b.data?.file?.localFile)
        .map((b) => b.data!.file!.localFile as File);

      const totalBytes = images.reduce((acc, file) => acc + file.size, 0);
      const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

      return { images, totalMB };
    };

    const imagesSize = getUploadStats(editorData?.blocks);
    const largeUploadSize = parseFloat(imagesSize?.totalMB ?? "0");

    const handleCloseConfirmation = () => {
      if (isSubmitting) return;
      setIsConfirmingLargeUpload(false);
      setPendingSubmitData(null);
    };

    const submitForm = (data: PostFormData) => {
      if (largeUploadSize > 1) {
        setPendingSubmitData(data);
        setIsConfirmingLargeUpload(true);
        return;
      }

      onSubmit(data);
    };

    useEffect(() => {
      if (
        !isSubmitting &&
        isConfirmingLargeUpload &&
        pendingSubmitData === null
      ) {
        setIsConfirmingLargeUpload(false);
      }
    }, [isSubmitting, isConfirmingLargeUpload, pendingSubmitData]);

    // Populate tags context when editing
    useEffect(() => {
      if (initialData?.tags) {
        setTags(initialData.tags);
      }
    }, [initialData, setTags]);

    const handleSubmit = (
      e: React.FormEvent<HTMLFormElement>,
      skipTagCheck: boolean = false,
    ) => {
      e.preventDefault();

      // 1. Validate Title
      if (!title.trim()) {
        toast.error("يرجى كتابة عنوان للمنشور قبل النشر.");
        return;
      }

      // 2. Validate Content (Editor.js blocks)
      if (!editorData || editorData.blocks.length === 0) {
        toast.error("المنشور فارغ. يرجى كتابة بعض المحتوى.");
        return;
      }

      const formData: PostFormData = {
        title: title.trim(),
        content: editorData,
        tags,
        excerpt: excerpt.trim() || getExcerptFromEditor(editorData),
        slug: generateSlug(title.trim()),
      };

      // 3. Validate Tags (Optional, but good practice)
      if (!skipTagCheck && tags.length === 0) {
        const TOAST_ID = "publish-confirmation";

        toast(
          (t) => (
            <div dir="rtl" className="flex flex-col gap-3 text-right w-full">
              <div className="flex flex-col gap-1.5">
                <p className="text-foreground font-medium leading-relaxed">
                  لا يوجد أي وسوم{" "}
                  <span className="text-xs font-bold text-tag-foreground bg-tag px-1.5 py-0.5 rounded-md mx-1 border border-tag-border shadow-sm">
                    Tags
                  </span>{" "}
                  على المنشور.
                </p>
                <p className="text-muted-foreground text-sm">
                  هل أنت متأكد من النشر بدونها؟
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Button
                  onClick={() => {
                    toast.dismiss(t.id);
                    submitForm(formData);
                  }}
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
                >
                  {isSubmitting ? "جاري الحفظ..." : submitLabel}
                </Button>

                <button onClick={() => toast.dismiss(t.id)} className="">
                  إلغاء
                </button>
              </div>
            </div>
          ),
          { id: TOAST_ID, duration: Infinity },
        );

        return;
      }

      submitForm(formData);
    };

    if (isError)
      return <QueryErrorRetry query={{ isFetching, isError, refetch }} />;

    return (
      <>
        <div className="relative min-h-[60vh]">
          {(!isEditorLoaded || isLoading) && (
            <div className="absolute inset-0 z-10 bg-container">
              <EditorFormSkeleton />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col h-full gap-y-2 animate-in fade-in duration-500"
          >
            {/* 1. Thin, Sticky Action Bar */}
            <div className="flex items-center py-3 bg-container/90 backdrop-blur-xl border-b border-card-hover  ">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "جاري الحفظ..." : submitLabel}
              </button>
            </div>

            {/* 2. The Writing Canvas */}
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-y-4 px-4 md:px-0 mt-4">
              {/* Title Container */}
              <div className="group relative bg-white/5 dark:bg-[#1F2937]/20 border border-[#E5E7EB] dark:border-card-hover rounded-2xl md:rounded-3xl p-5 md:p-8 transition-all duration-300 focus-within:border-primary/40 focus-within:bg-white/10 dark:focus-within:bg-[#1F2937]/40 shadow-sm focus-within:shadow-md">
                {/* Label: Hidden or smaller on mobile to keep the header clean */}
                <span className="absolute -top-2.5 right-4 md:right-8 bg-background px-2 text-[10px] md:text-xs font-medium text-muted-foreground/60 tracking-widest uppercase">
                  العنوان الرئيسي
                </span>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان المنشور..."
                  // Responsive font sizes: text-3xl on mobile, 5xl/6xl on desktop
                  className="w-full font-serif text-3xl md:text-5xl lg:text-6xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/20 focus:ring-0 px-0 text-start leading-tight"
                />
              </div>

              {/* Excerpt Container */}
              <div className="group relative bg-white/5 dark:bg-[#1F2937]/20 border border-[#E5E7EB] dark:border-card-hover rounded-xl md:rounded-2xl p-4 transition-all duration-300 focus-within:border-primary/40 focus-within:bg-white/10 dark:focus-within:bg-[#1F2937]/40 shadow-sm focus-within:shadow-md">
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="ملخص قصير..."
                  className="w-full text-base md:text-lg bg-transparent border-none outline-none placeholder:text-muted-foreground/20 focus:ring-0 px-0 text-start leading-relaxed resize-none"
                />
              </div>

              {/* Editor Wrapper */}
              <div className="prose prose-stone dark:prose-invert max-w-none w-full mt-4 md:mt-6 px-1 md:px-0">
                <Editor
                  key={editorKey}
                  ref={editorRef}
                  onReady={() => setIsEditorLoaded(true)}
                  onChange={setEditorData}
                  data={editorData}
                  placeholder="ابدأ بكتابة قصيدتك أو مقالك هنا..."
                />
              </div>
            </div>

            <div className="w-full bg-white/5 dark:bg-[#1F2937]/30 border border-[#E5E7EB] dark:border-card-hover rounded-xl p-4">
              <div className="flex flex-col  gap-x-4 text-sm text-muted-foreground pr-4 pb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground pb-1">
                  الاحصائيات (Stats)
                </h3>
                <div className="text-xs">
                  <p>{stats.words} كلمة</p>
                  <p>{stats.time} دقيقة قراءة</p>
                  <p>حجم الملفات: {imagesSize?.totalMB} ميجابايت</p>
                </div>
              </div>

              <Tags existingTags={existingTags ?? []} />
            </div>
          </form>
        </div>

        <PublishConfirmationModal
          isOpen={isConfirmingLargeUpload}
          totalMB={imagesSize?.totalMB ?? "0"}
          imageCount={imagesSize?.images?.length ?? 0}
          uploadQueue={uploadQueue}
          isUploading={isSubmitting}
          onClose={handleCloseConfirmation}
          onConfirm={() => {
            if (!pendingSubmitData) return;
            onSubmit(pendingSubmitData);
            setPendingSubmitData(null);
          }}
        />
      </>
    );
  },
);

export default PostForm;
