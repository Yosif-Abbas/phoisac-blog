import { useMutation } from "@tanstack/react-query";
import type { Block, StructuredContent, Tag } from "@/types/cms";
import { uploadImage } from "@/services/client/posts";
import { createPostAction } from "@/actions/post-actions";
import { useState } from "react";
import { useCurrentUser } from "../auth/useCurrentUser";
import {
  generateSlug,
  generateSquareThumbnail,
  generateStoragePath,
  optimizeImageBeforeUpload,
} from "@/lib/utils/media";
import { normalizeBlock } from "@/lib/utils/types";

type UploadStatus = {
  name: string;
  status: "waiting" | "uploading" | "completed" | "error";
  progress: number;
};

export function useCreatePost() {
  const [uploadQueue, setUploadQueue] = useState<UploadStatus[]>([]);
  const { user } = useCurrentUser();

  const { mutate, isPending } = useMutation({
    mutationFn: async (post: {
      title: string;
      content: StructuredContent;
      tags: Tag[];
      excerpt?: string;
    }) => {
      const postTime = Date.now();

      // Helper to safely extract a browser File from either the legacy
      // `data.file.localFile` shape or `data.upload.localFile` shape.
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

      const imageBlocks = post.content.blocks.filter((b) => getLocalFile(b));

      const initialQueue = imageBlocks.map((b) => {
        const f = getLocalFile(b)!;
        return { name: f.name, status: "waiting" as const, progress: 0 };
      });
      setUploadQueue(initialQueue);

      const slug = generateSlug(post.title);

      let currentImageIndex = 0;

      const updatedBlocks = await Promise.all(
        post.content.blocks.map(async (block) => {
          if (block.type === "image") {
            const file = getLocalFile(block);
            if (file) {
              const fileIndex = currentImageIndex++;

              // Base path for the main image
              const filePath = generateStoragePath(file.name, "blog");
              // Path for the thumbnail (replace .webp with _thumb.webp)
              const thumbFilePath = filePath.replace(
                /\.[^/.]+$/,
                "_thumb.webp",
              );

              setUploadQueue((prev) =>
                prev.map((item, i) =>
                  i === fileIndex ? { ...item, status: "uploading" } : item,
                ),
              );

              // 1. Process both images in parallel
              const [optimizedImageFile, thumbnailFile] = await Promise.all([
                optimizeImageBeforeUpload(file),
                generateSquareThumbnail(file),
              ]);

              // 2. Upload both images to Supabase concurrently
              const [mainUpload, thumbUpload] = await Promise.all([
                uploadImage(optimizedImageFile, filePath, "post-images"),
                uploadImage(thumbnailFile, thumbFilePath, "post-images"),
              ]);

              if (mainUpload.error || thumbUpload.error) {
                setUploadQueue((prev) =>
                  prev.map((item, i) =>
                    i === fileIndex ? { ...item, status: "error" } : item,
                  ),
                );
                throw new Error(`Image upload failed`);
              }

              setUploadQueue((prev) =>
                prev.map((item, i) =>
                  i === fileIndex
                    ? { ...item, status: "completed", progress: 100 }
                    : item,
                ),
              );

              // ... (keep the rest of the block normalization exactly the same)
              const bObj = block as unknown as Record<string, unknown>;
              const dataObj =
                (bObj["data"] as Record<string, unknown> | undefined) ||
                undefined;
              const caption =
                dataObj && typeof dataObj["caption"] === "string"
                  ? (dataObj["caption"] as string)
                  : undefined;
              return normalizeBlock({
                type: "image",
                data: { url: mainUpload.url, caption },
              });
            }
            return normalizeBlock(block);
          }
          return normalizeBlock(block);
        }),
      );

      const foundImage = updatedBlocks.find(
        (b) => (b as any)?.type === "image" && (b as any)?.data?.file?.url,
      ) as any | undefined;

      const coverImageUrl =
        (foundImage?.data?.file?.url as string) || undefined;

      return await createPostAction({
        title: post.title,
        slug,
        content: { blocks: updatedBlocks },
        excerpt: post.excerpt,
        created_at: new Date(postTime).toISOString(),
        tagIds: post.tags
          .filter((t) => typeof t.id === "string")
          .map((t) => String(t.id)),
        cover_image_url: coverImageUrl,
        author_id: user.id,
      });
    },
  });

  return { mutate, isPending, uploadQueue };
}
