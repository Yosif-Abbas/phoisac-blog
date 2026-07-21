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
      cover_image_url?: string | null;
      cover_image_file?: File | null;
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
      const initialQueue: UploadStatus[] = [];

      if (post.cover_image_file) {
        initialQueue.push({
          name: post.cover_image_file.name,
          status: "waiting",
          progress: 0,
        });
      }

      imageBlocks.forEach((b) => {
        const f = getLocalFile(b)!;
        initialQueue.push({ name: f.name, status: "waiting", progress: 0 });
      });

      setUploadQueue(initialQueue);

      let currentQueueIndex = 0;
      let finalCoverUrl = post.cover_image_url || undefined;

      // Keep track of Editor Blob URLs to swap them out if used as a cover
      const editorUrlMap = new Map<string, string>();

      // 1. Upload DEDICATED Cover Image (if a local file was uploaded directly to cover)
      if (post.cover_image_file) {
        const fileIndex = currentQueueIndex++;
        setUploadQueue((prev) =>
          prev.map((item, i) =>
            i === fileIndex
              ? { ...item, status: "uploading", progress: 10 }
              : item,
          ),
        );

        const formData = new FormData();
        formData.append("file", post.cover_image_file);
        formData.append("intent", "cover"); // Tell the server this is a cover

        const result = await processAndUploadImageAction(formData);
        if (!result.success || !result.url) {
          throw new Error(result.error || "Upload failed");
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

      // 2. Upload Editor Images
      const updatedBlocks = [];
      for (const block of post.content.blocks) {
        if (block.type === "image") {
          const originalFile = getLocalFile(block);
          const bObj = block as any;
          const originalBlobUrl = bObj.data?.file?.url;

          if (originalFile) {
            const fileIndex = currentQueueIndex++;
            setUploadQueue((prev) =>
              prev.map((item, i) =>
                i === fileIndex
                  ? { ...item, status: "uploading", progress: 10 }
                  : item,
              ),
            );

            const formData = new FormData();
            formData.append("file", originalFile);
            formData.append("intent", "editor"); // Tell the server this is an inline image

            const result = await processAndUploadImageAction(formData);
            if (!result.success) throw new Error(result.error);

            setUploadQueue((prev) =>
              prev.map((item, i) =>
                i === fileIndex
                  ? { ...item, status: "completed", progress: 100 }
                  : item,
              ),
            );

            // Save the mapping just in case this image was selected as the cover
            if (originalBlobUrl) {
              editorUrlMap.set(originalBlobUrl, result.url as string);
            }

            updatedBlocks.push(
              normalizeBlock({
                type: "image",
                data: {
                  url: result.url,
                  caption: bObj.data?.caption,
                },
              }),
            );
            continue;
          }
        }
        updatedBlocks.push(normalizeBlock(block));
      }

      // 3. Resolve the Final Cover Image
      // If the user explicitly clicked an editor image to be the cover, finalCoverUrl
      // will be a 'blob:http...' URL. We must swap it for the actual uploaded URL.
      if (finalCoverUrl && finalCoverUrl.startsWith("blob:")) {
        finalCoverUrl = editorUrlMap.get(finalCoverUrl) || undefined;
      }

      // Fallback: If no cover was chosen at all, pick the first editor image automatically
      if (!finalCoverUrl) {
        const foundImage = updatedBlocks.find(
          (b) => (b as any)?.type === "image" && (b as any)?.data?.file?.url,
        ) as any | undefined;
        finalCoverUrl = (foundImage?.data?.file?.url as string) || undefined;
      }

      return await createPostAction({
        title: post.title,
        slug: post.slug,
        content: { blocks: updatedBlocks },
        excerpt: post.excerpt,
        created_at: new Date(postTime).toISOString(),
        tagIds: post.tags
          .filter((t) => typeof t.id === "string")
          .map((t) => String(t.id)),
        cover_image_url: finalCoverUrl,
        author_id: user.id,
        status: isDeveloper ? "test" : "published",
      });
    },
  });

  return { mutate, isPending, uploadQueue };
}
