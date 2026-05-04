import { useMutation } from "@tanstack/react-query";
import type { StructuredContent, Tag } from "@/types/cms";

import { createPostAction } from "@/actions/post-actions";
import { useState } from "react";
import { useCurrentUser } from "../auth/useCurrentUser";

import { normalizeBlock } from "@/lib/utils/types";
import { processAndUploadImageAction } from "@/actions/upload-actions";

type UploadStatus = {
  name: string;
  status: "waiting" | "uploading" | "completed" | "error";
  progress: number;
};

export function useCreatePost() {
  const [uploadQueue, setUploadQueue] = useState<UploadStatus[]>([]);
  const { user, isDeveloper } = useCurrentUser();

  const { mutate, isPending } = useMutation({
    mutationFn: async (post: {
      title: string;
      content: StructuredContent;
      tags: Tag[];
      excerpt?: string;
      slug: string;
    }) => {
      const postTime = Date.now();

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

      let currentImageIndex = 0;

      const updatedBlocks = [];

      for (const block of post.content.blocks) {
        if (block.type === "image") {
          const originalFile = getLocalFile(block);

          if (originalFile) {
            const fileIndex = currentImageIndex++;

            setUploadQueue((prev) =>
              prev.map((item, i) =>
                i === fileIndex
                  ? { ...item, status: "uploading", progress: 10 }
                  : item,
              ),
            );

            const formData = new FormData();
            formData.append("file", originalFile);

            const result = await processAndUploadImageAction(formData);

            if (!result.success) throw new Error(result.error);

            setUploadQueue((prev) =>
              prev.map((item, i) =>
                i === fileIndex
                  ? { ...item, status: "completed", progress: 100 }
                  : item,
              ),
            );

            const bObj = block as any;
            updatedBlocks.push(
              normalizeBlock({
                type: "image",
                data: {
                  url: result.mainUrl,
                  thumbnail: result.thumbUrl,
                  caption: bObj.data?.caption,
                },
              }),
            );
            continue; // Skip to next iteration
          }
        }
        // If not an image or no file, just push original
        updatedBlocks.push(normalizeBlock(block));
      }

      const foundImage = updatedBlocks.find(
        (b) => (b as any)?.type === "image" && (b as any)?.data?.file?.url,
      ) as any | undefined;

      const coverImageUrl =
        (foundImage?.data?.file?.url as string) || undefined;

      return await createPostAction({
        title: post.title,
        slug: post.slug,
        content: { blocks: updatedBlocks },
        excerpt: post.excerpt,
        created_at: new Date(postTime).toISOString(),
        tagIds: post.tags
          .filter((t) => typeof t.id === "string")
          .map((t) => String(t.id)),
        cover_image_url: coverImageUrl,
        author_id: user.id,
        status: isDeveloper ? "test" : "published",
      });
    },
  });

  return { mutate, isPending, uploadQueue };
}
