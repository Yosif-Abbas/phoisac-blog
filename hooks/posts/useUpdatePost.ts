"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadImage } from "@/services/client/posts";
import type { Block, StructuredContent, Tag } from "@/types/cms";
import { normalizeBlock } from "@/lib/utils/types";
import { updatePostAction } from "@/actions/post-actions";
import { useCurrentUser } from "../auth/useCurrentUser";
import {
  generateSquareThumbnail,
  generateStoragePath,
  optimizeImageBeforeUpload,
} from "@/lib/utils/media";

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
};

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();
  const [uploadQueue, setUploadQueue] = useState<UploadStatus[]>([]);

  const { mutate: updatePost, isPending } = useMutation({
    mutationFn: async (post: UpdatePostPayload) => {
      const updateTime = new Date().toISOString();

      // Helper to extract browser File from block safely
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

      // 1. Initialize Queue only for NEW images
      const newImageBlocks = post.content.blocks.filter((b) => getLocalFile(b));
      const initialQueue = newImageBlocks.map((b) => {
        const f = getLocalFile(b)!;
        return { name: f.name, status: "waiting" as const, progress: 0 };
      });
      setUploadQueue(initialQueue);

      let currentUploadIndex = 0;

      // 2. Process blocks
      const updatedBlocks = await Promise.all(
        post.content.blocks.map(async (block: Block) => {
          if (block.type === "image") {
            const file = getLocalFile(block);

            // If it's a new file (not yet in Supabase)
            if (file) {
              const fileIndex = currentUploadIndex++;

              const filePath = generateStoragePath(file.name, "blog");
              const thumbFilePath = filePath.replace(
                /\.[^/.]+$/,
                "_thumb.webp",
              );

              setUploadQueue((prev) =>
                prev.map((item, i) =>
                  i === fileIndex ? { ...item, status: "uploading" } : item,
                ),
              );

              try {
                // Generate optimized versions in parallel
                const [optimizedImageFile, thumbnailFile] = await Promise.all([
                  optimizeImageBeforeUpload(file),
                  generateSquareThumbnail(file),
                ]);

                // Upload both main and thumbnail concurrently
                const [mainUpload, thumbUpload] = await Promise.all([
                  uploadImage(optimizedImageFile, filePath, "post-images"),
                  uploadImage(thumbnailFile, thumbFilePath, "post-images"),
                ]);

                if (mainUpload.error || thumbUpload.error) throw new Error();

                setUploadQueue((prev) =>
                  prev.map((item, i) =>
                    i === fileIndex
                      ? { ...item, status: "completed", progress: 100 }
                      : item,
                  ),
                );

                // Re-extract caption if it exists
                const bObj = block as unknown as Record<string, unknown>;
                const dataObj = bObj["data"] as
                  | Record<string, unknown>
                  | undefined;
                const caption =
                  typeof dataObj?.["caption"] === "string"
                    ? dataObj["caption"]
                    : undefined;

                return normalizeBlock({
                  type: "image",
                  data: { url: mainUpload.url, caption },
                });
              } catch (err) {
                setUploadQueue((prev) =>
                  prev.map((item, i) =>
                    i === fileIndex ? { ...item, status: "error" } : item,
                  ),
                );
                throw new Error("حدث خطأ أثناء رفع بعض الصور");
              }
            }
            // If it was already an uploaded image, just return it normalized
            return normalizeBlock(block);
          }
          return normalizeBlock(block);
        }),
      );

      // 3. Extract Tag IDs and Cover Image
      const newTagIds = (post.tags || [])
        .filter((tag) => typeof tag.id === "string")
        .map((tag) => tag.id as string);

      const foundImage = updatedBlocks.find(
        (b) => (b as any)?.type === "image" && (b as any)?.data?.file?.url,
      ) as any | undefined;

      const coverImageUrl = foundImage?.data?.file?.url || undefined;

      // 4. Call Server Action
      return await updatePostAction({
        postId: post.id,
        slug: post.slug,
        title: post.title,
        content: { blocks: updatedBlocks },
        excerpt: post.excerpt,
        newTagIds,
        updated_at: updateTime,
        cover_image_url: coverImageUrl,
        author_id: user.id,
      });
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("تم تحديث المنشور بنجاح!");
      setUploadQueue([]); // Clear queue on success
    },

    onError: (error: unknown) => {
      console.error(error);
      const msg = error instanceof Error ? error.message : "فشل تحديث المنشور.";
      toast.error(msg);
    },
  });

  return { updatePost, isPending, uploadQueue };
}
