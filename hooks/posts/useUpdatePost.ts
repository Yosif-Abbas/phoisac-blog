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
      const initialQueue = newImageBlocks.map((b) => {
        const f = getLocalFile(b)!;
        return { name: f.name, status: "waiting" as const, progress: 0 };
      });
      setUploadQueue(initialQueue);

      let currentUploadIndex = 0;
      const updatedBlocks = [];

      for (const block of post.content.blocks) {
        if (block.type === "image") {
          const file = getLocalFile(block);

          if (file) {
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

            const result = await processAndUploadImageAction(formData);

            if (!result.success) throw new Error(result.error);

            setUploadQueue((prev) =>
              prev.map((item, i) =>
                i === fileIndex
                  ? { ...item, status: "completed", progress: 100 }
                  : item,
              ),
            );

            const bObj = block as unknown as Record<string, unknown>;
            const dataObj = bObj["data"] as Record<string, unknown> | undefined;
            const caption =
              typeof dataObj?.["caption"] === "string"
                ? dataObj["caption"]
                : undefined;

            updatedBlocks.push(
              normalizeBlock({
                type: "image",
                data: {
                  url: result.mainUrl,
                  thumbnail: result.thumbUrl,
                  caption,
                },
              }),
            );
            continue; // Skip to next iteration
          }
        }
        // If not an image or it was already uploaded previously
        updatedBlocks.push(normalizeBlock(block));
      }

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
    },
  });

  return { updatePost, isPending, uploadQueue };
}
