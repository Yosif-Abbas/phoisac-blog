"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import { OutputData } from "@editorjs/editorjs";
import Editor, { EditorHandle } from "@/components/dashboard/Editor";
import PublishConfirmationModal from "./PublishConfirmationModal";
import PostMetadata from "./PostMetadata";
import CoverImageSelector from "./CoverImageSelector";
import { usePostFormTags } from "./context/TagsContext";
import { useTags } from "@/hooks/tags/useTags";
import QueryErrorRetry from "../ui/QueryErrorRetry";
import EditorFormSkeleton from "../skeleton/EditorFormSkeleton";
import { Button } from "../ui/Button";
import toast from "react-hot-toast";
import { generateSlug } from "@/lib/utils/media";
import {
  getPostStats,
  getExcerptFromEditor,
  getUploadStats,
  getEditorImages,
} from "@/lib/utils/postHelpers";
import type { StructuredContent, Tag } from "@/types/cms";
import ImageCropperModal from "./ImageCropperModal";
import { rejectEditorCrop, resolveEditorCrop } from "@/lib/utils/cropBridge";

// --- Types ---
type UploadStatus = {
  name: string;
  status: "waiting" | "uploading" | "completed" | "error";
  progress: number;
};

export type PostFormData = {
  title: string;
  content: StructuredContent;
  tags: Tag[];
  excerpt?: string;
  slug: string;
  cover_image_url?: string | null;
  cover_image_file?: File | null;
};

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => void;
  isSubmitting: boolean;
  submitLabel?: string;
  uploadQueue?: UploadStatus[];
}
export type PostFormHandle = { reset: () => void };

const PostForm = React.forwardRef<PostFormHandle, PostFormProps>(
  function PostForm(
    {
      initialData,
      onSubmit,
      isSubmitting,
      submitLabel = "نشر المقال",
      uploadQueue,
    },
    ref,
  ) {
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);
    const editorRef = useRef<EditorHandle>(null);
    const [editorKey, setEditorKey] = useState(0);

    // Form State
    const [title, setTitle] = useState(initialData?.title || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [editorData, setEditorData] = useState<OutputData | undefined>(
      initialData?.content,
    );

    // Cover Image State
    const [coverUrl, setCoverUrl] = useState<string | null>(
      initialData?.cover_image_url || null,
    );
    // FIX: Safely initialize coverFile in case initialData provides it
    const [coverFile, setCoverFile] = useState<File | null>(
      initialData?.cover_image_file || null,
    );
    const [userDidManuallySelect, setUserDidManuallySelect] = useState(
      !!initialData?.cover_image_url,
    );

    // Modals & Hooks
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

    const [editorCropData, setEditorCropData] = useState<{
      file: File;
      url: string;
    } | null>(null);

    // Derived Data (Memoized for performance)
    const stats = useMemo(() => getPostStats(editorData), [editorData]);
    const uploadStats = useMemo(
      () => getUploadStats(editorData?.blocks),
      [editorData],
    );
    const editorImages = useMemo(
      () => getEditorImages(editorData?.blocks),
      [editorData],
    );
    const largeUploadSize = parseFloat(uploadStats.totalMB);

    useEffect(() => {
      const handleOpenCrop = (e: Event) => {
        const customEvent = e as CustomEvent<{ file: File }>;
        const file = customEvent.detail.file;
        setEditorCropData({ file, url: URL.createObjectURL(file) });
      };

      window.addEventListener("open-editor-crop", handleOpenCrop);
      return () =>
        window.removeEventListener("open-editor-crop", handleOpenCrop);
    }, []);

    // Auto-sync cover image if user hasn't manually chosen one
    useEffect(() => {
      if (!userDidManuallySelect && editorImages.length > 0) {
        setCoverUrl(editorImages[0]);
      } else if (!userDidManuallySelect && editorImages.length === 0) {
        setCoverUrl(null);
      }
    }, [editorImages, userDidManuallySelect]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setTitle("");
        setExcerpt("");
        setEditorData(undefined);
        setTags([]);
        setCoverUrl(null);
        setCoverFile(null); // Ensure file is cleared on reset
        setUserDidManuallySelect(false);
        setPendingSubmitData(null);
        setIsConfirmingLargeUpload(false);
        setEditorKey((k) => k + 1);
      },
    }));

    useEffect(() => {
      if (initialData?.tags) setTags(initialData.tags);
    }, [initialData, setTags]);

    const handleCoverChange = (
      data: { url: string; file?: File } | null,
      isManual: boolean,
    ) => {
      if (!data) {
        setCoverUrl(null);
        setCoverFile(null);
      } else {
        setCoverUrl(data.url);
        // FIX: Ensure it correctly falls back to null if no file is provided
        setCoverFile(data.file || null);
      }
      setUserDidManuallySelect(isManual);
    };

    const submitForm = (data: PostFormData) => {
      if (largeUploadSize > 1) {
        setPendingSubmitData(data);
        setIsConfirmingLargeUpload(true);
        return;
      }
      onSubmit(data);
    };

    const handleSubmit = (
      e: React.FormEvent<HTMLFormElement>,
      skipTagCheck: boolean = false,
    ) => {
      e.preventDefault();
      if (!title.trim())
        return toast.error("يرجى كتابة عنوان للمنشور قبل النشر.");
      if (!editorData || editorData.blocks.length === 0)
        return toast.error("المنشور فارغ. يرجى كتابة بعض المحتوى.");

      const formData: PostFormData = {
        title: title.trim(),
        content: editorData,
        tags,
        excerpt: excerpt.trim() || getExcerptFromEditor(editorData),
        slug: generateSlug(title.trim()),
        // FIX: Always pass the URL (even if it's a blob). The hook safely overwrites it after uploading the file.
        cover_image_url: coverUrl,
        cover_image_file: coverFile,
      };

      if (!skipTagCheck && tags.length === 0) {
        toast(
          (t) => (
            <div dir="rtl" className="flex flex-col gap-3 text-right w-full">
              <p className="font-medium">
                لا يوجد أي وسوم. هل أنت متأكد من النشر بدونها؟
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    toast.dismiss(t.id);
                    submitForm(formData);
                  }}
                  disabled={isSubmitting}
                >
                  نشر بدون وسوم
                </Button>
                <button onClick={() => toast.dismiss(t.id)}>إلغاء</button>
              </div>
            </div>
          ),
          { duration: Infinity },
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
            className="relative flex flex-col h-full gap-y-2"
          >
            {/* Action Bar */}
            <div className="flex items-center py-3 bg-container/90 backdrop-blur-xl border-b border-card-hover">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "جاري الحفظ..." : submitLabel}
              </button>
            </div>

            {/* Canvas */}
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-y-4 px-4 md:px-0 mt-4">
              <div className="group relative bg-white/5 border border-[#E5E7EB] dark:border-card-hover rounded-2xl p-5 md:p-8">
                <span className="absolute -top-2.5 right-4 bg-background px-2 text-[10px] font-medium text-muted-foreground/60">
                  العنوان الرئيسي
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان المنشور..."
                  className="w-full font-serif text-3xl md:text-5xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/20"
                />
              </div>

              <div className="group relative bg-white/5 border border-[#E5E7EB] dark:border-card-hover rounded-xl p-4">
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="ملخص قصير... (اختياري)"
                  className="w-full text-base bg-transparent border-none outline-none placeholder:text-muted-foreground/20 resize-none"
                />
              </div>

              <div className="prose prose-stone dark:prose-invert max-w-none w-full mt-4">
                <Editor
                  key={editorKey}
                  ref={editorRef}
                  onReady={() => setIsEditorLoaded(true)}
                  onChange={setEditorData}
                  data={editorData}
                  placeholder="ابدأ بالكتابة..."
                />
              </div>
            </div>

            {/* --- BOTTOM GRID (Cover Image & Metadata) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto w-full px-4 md:px-0 mt-4 mb-12">
              <div className="order-1 lg:order-1">
                <CoverImageSelector
                  coverUrl={coverUrl}
                  onCoverChange={handleCoverChange}
                  editorImages={editorImages}
                />
              </div>
              <div className="order-2 lg:order-2 h-full">
                <PostMetadata
                  stats={stats}
                  totalMB={uploadStats.totalMB}
                  existingTags={existingTags ?? []}
                />
              </div>
            </div>
            {/* ----------------------------------------------- */}
          </form>
        </div>

        {/* Publish Confirmation Modal */}
        <PublishConfirmationModal
          isOpen={isConfirmingLargeUpload}
          totalMB={uploadStats.totalMB}
          imageCount={uploadStats.images.length}
          uploadQueue={uploadQueue}
          isUploading={isSubmitting}
          onClose={() => setIsConfirmingLargeUpload(false)}
          onConfirm={() => {
            if (pendingSubmitData) {
              onSubmit(pendingSubmitData);
              setPendingSubmitData(null);
            }
          }}
        />

        {/* --- NEW: Editor Image Crop Modal (Free-form / No aspect ratio) --- */}
        <ImageCropperModal
          isOpen={!!editorCropData}
          imageUrl={editorCropData?.url || null}
          onClose={() => {
            rejectEditorCrop();
            setEditorCropData(null);
          }}
          onCropComplete={(croppedFile, croppedUrl) => {
            resolveEditorCrop(croppedFile, croppedUrl);
            setEditorCropData(null);
          }}
        />
      </>
    );
  },
);

export default PostForm;
