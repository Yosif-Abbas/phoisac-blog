"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadImage } from "@/services/client/posts";
import type { Block } from "@/types/cms";
import { updatePostAction } from "@/actions/post-actions";
import { useCurrentUser } from "../auth/useCurrentUser";
import {
  generateStoragePath,
  optimizeImageBeforeUpload,
} from "@/lib/utils/media";

// type UpdatePostPayload = {
//   postId: number;
//   slug: string;
//   title: string;
//   content: StructuredContent;
//   excerpt?: string;
//   tags: Tag[];
// };

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  type UpdatePostPayload = {
    id: string;
    slug: string;
    title: string;
    content: any;
    excerpt?: string;
    tags?: any[];
  };

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

      // 1. Process blocks (Upload ONLY new images)
      const updatedBlocks = await Promise.all(
        post.content.blocks.map(async (block: Block) => {
          if (block.type === "image") {
            const file = getLocalFile(block);

            if (file) {
              const filePath = generateStoragePath(file.name, "blog");

              const optimizedImageFile = await optimizeImageBeforeUpload(file);

              const { url, error } = await uploadImage(
                optimizedImageFile,
                filePath,
                "post-images",
              );

              if (error) throw new Error("حدث خطأ أثناء رفع بعض الصور");

              const bObj = block as unknown as Record<string, unknown>;
              const dataObj =
                (bObj["data"] as Record<string, unknown> | undefined) ||
                undefined;
              const caption =
                dataObj && typeof dataObj["caption"] === "string"
                  ? (dataObj["caption"] as string)
                  : undefined;

              return {
                ...block,
                data: {
                  ...(((block as unknown as Record<string, unknown>)["data"] as Record<string, unknown>) || {}),
                  url,
                  caption,
                },
              } as Block;
            }
            return block as Block;
          }
          return block as Block;
        }),
      );

      // 2. Extract Tag IDs
      const newTagIds = (post.tags || [])
        .filter((tag) => typeof tag.id === "string")
        .map((tag) => tag.id as string);
      const coverImageUrl =
        updatedBlocks.find((block) => block.type === "image")?.data &&
        ((
          (
            updatedBlocks.find((b) => b.type === "image") as unknown as Record<
              string,
              unknown
            >
          ).data as Record<string, unknown>
        )["url"] as string | undefined);

      // 3. Call the Server Action
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
      // Refresh the client-side TanStack cache
      queryClient.invalidateQueries({ queryKey: ["post", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("تم تحديث المنشور بنجاح!");
    },

    onError: (error: unknown) => {
      console.error(error);
      const msg =
        error instanceof Error
          ? error.message
          : "فشل تحديث المنشور، يرجى المحاولة مرة أخرى.";
      toast.error(msg);
    },
  });

  return { updatePost, isPending };
}
