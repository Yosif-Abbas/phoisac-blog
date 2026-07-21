"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { StructuredContent, Tag } from "@/types/cms";
import { normalizeBlock } from "@/lib/utils/types";
import { updatePostAction } from "@/actions/post-actions";
import { useCurrentUser } from "../auth/useCurrentUser";
import { processAndUploadImageAction } from "@/actions/upload-actions";

type UploadStatus = {
  name: string;
  status: "waiting" | "uploading" | "completed" | "error";
  progress: number;
};

type UpdatePostPayload = {
  id: string;
  slug: string;
  title: string;
  content: StructuredContent;
  excerpt?: string;
  tags?: Tag[];
  cover_image_url?: string | null;
  cover_image_file?: File | null;
};

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { user, isDeveloper } = useCurrentUser();
  const [uploadQueue, setUploadQueue] = useState<UploadStatus[]>([]);

  const { mutate: updatePost, isPending } = useMutation({
    mutationFn: async (post: UpdatePostPayload) => {
      const updateTime = new Date().toISOString();

      const getLocalFile = (block: unknown): File | undefined => {
        const b = (block as Record<string, unknown>) || {};
        if (b["type"] !== "image") return undefined;
        const data =
          (b["data"] as Record<string, unknown> | undefined) || undefined;
        if (!data) return undefined;
        const fileObj = data["file"] as Record<string, unknown> | undefined;
        if (fileObj && fileObj["localFile"] instanceof globalThis.File)
          return fileObj["localFile"] as File;
        const uploadObj = data["upload"] as Record<string, unknown> | undefined;
        if (uploadObj && uploadObj["localFile"] instanceof globalThis.File)
          return uploadObj["localFile"] as File;
        return undefined;
      };

      const newImageBlocks = post.content.blocks.filter((b) => getLocalFile(b));
      const initialQueue: UploadStatus[] = [];

      // 1. Add cover image to the start of the queue if it's a local file
      if (post.cover_image_file) {
        initialQueue.push({
          name: post.cover_image_file.name,
          status: "waiting",
          progress: 0,
        });
      }

      // 2. Add editor images to the queue
      newImageBlocks.forEach((b) => {
        const f = getLocalFile(b)!;
        initialQueue.push({ name: f.name, status: "waiting", progress: 0 });
      });

      setUploadQueue(initialQueue);

      let currentUploadIndex = 0;

      // Start with the URL provided (which might be a blob:, a real URL, or null)
      let finalCoverUrl: string | undefined = post.cover_image_url || undefined;

      const updatedBlocks = [];
      const editorUrlMap = new Map<string, string>(); // To swap blob URLs to real URLs later

      // 3. Upload DEDICATED Cover Image (if a new manual local file upload)
      if (post.cover_image_file) {
        const fileIndex = currentUploadIndex++;
        setUploadQueue((prev) =>
          prev.map((item, i) =>
            i === fileIndex
              ? { ...item, status: "uploading", progress: 10 }
              : item,
          ),
        );

        const formData = new FormData();
        formData.append("file", post.cover_image_file);
        formData.append("intent", "cover"); // Tell server to make a lightweight cover

        const result = await processAndUploadImageAction(formData);

        if (!result.success || !result.url) {
          throw new Error(result.error || "Failed to upload cover image");
        }

        finalCoverUrl = result.url;

        setUploadQueue((prev) =>
          prev.map((item, i) =>
            i === fileIndex
              ? { ...item, status: "completed", progress: 100 }
              : item,
          ),
        );
      }

      // 4. Upload Editor.js Images
      for (const block of post.content.blocks) {
        if (block.type === "image") {
          const file = getLocalFile(block);

          if (file) {
            const bObj = block as unknown as Record<string, unknown>;
            const dataObj = bObj["data"] as Record<string, unknown> | undefined;
            const originalLocalUrl = (
              dataObj?.["file"] as Record<string, unknown>
            )?.["url"] as string | undefined;

            const fileIndex = currentUploadIndex++;

            setUploadQueue((prev) =>
              prev.map((item, i) =>
                i === fileIndex
                  ? { ...item, status: "uploading", progress: 10 }
                  : item,
              ),
            );

            const formData = new FormData();
            formData.append("file", file);
            formData.append("intent", "editor"); // Tell server this is an inline image

            const result = await processAndUploadImageAction(formData);

            if (!result.success || !result.url) {
              throw new Error(result.error || "Failed to upload editor image");
            }

            setUploadQueue((prev) =>
              prev.map((item, i) =>
                i === fileIndex
                  ? { ...item, status: "completed", progress: 100 }
                  : item,
              ),
            );

            // Store mapping from local blob to the new uploaded URL
            if (originalLocalUrl) {
              editorUrlMap.set(originalLocalUrl, result.url);
            }

            const caption =
              typeof dataObj?.["caption"] === "string"
                ? dataObj["caption"]
                : undefined;

            updatedBlocks.push(
              normalizeBlock({
                type: "image",
                data: {
                  url: result.url,
                  caption,
                },
              }),
            );
            continue;
          }
        }
        // If not an image or it was already uploaded previously
        updatedBlocks.push(normalizeBlock(block));
      }

      // 5. Swap local Cover blob for actual URL if the user picked an editor image
      if (finalCoverUrl && finalCoverUrl.startsWith("blob:")) {
        const mappedUrl = editorUrlMap.get(finalCoverUrl);
        if (mappedUrl) {
          finalCoverUrl = mappedUrl;
        }
      }

      // 6. Fallback logic: If no cover explicitly assigned, pull from first uploaded block
      if (!finalCoverUrl) {
        const foundImage = updatedBlocks.find(
          (b) => (b as any)?.type === "image" && (b as any)?.data?.file?.url,
        ) as any | undefined;
        finalCoverUrl = (foundImage?.data?.file?.url as string) || undefined;
      }

      // 7. Extract Tag IDs
      const newTagIds = (post.tags || [])
        .filter((tag) => typeof tag.id === "string")
        .map((tag) => tag.id as string);

      // 8. Call Server Action
      return await updatePostAction({
        postId: post.id,
        slug: post.slug,
        title: post.title,
        content: { blocks: updatedBlocks },
        excerpt: post.excerpt,
        newTagIds,
        updated_at: updateTime,
        cover_image_url: finalCoverUrl,
        author_id: user.id,
        status: isDeveloper ? "test" : "published",
      });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("تم تحديث المنشور بنجاح!");
      setUploadQueue([]);
    },

    onError: (error: unknown) => {
      console.error(error);
      const msg = error instanceof Error ? error.message : "فشل تحديث المنشور.";
      toast.error(msg);
      setUploadQueue([]);
    },
  });

  return { updatePost, isPending, uploadQueue };
}
