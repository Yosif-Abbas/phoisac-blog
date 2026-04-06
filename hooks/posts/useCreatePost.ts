import { useMutation } from "@tanstack/react-query";
import { OutputData } from "@editorjs/editorjs";
import { Block, Tag } from "@/types/post";
import { uploadImage } from "@/services/client/posts"; // Keep your existing uploadImage function!
import { slugify } from "transliteration";
import { createPostAction } from "@/actions/post-actions";
import { useState } from "react";
import { useCurrentUser } from "../auth/useCurrentUser";

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
      content: OutputData;
      tags: Tag[];
      excerpt?: string;
    }) => {
      const postTime = Date.now();

      // --- NEW: Initialize the Queue ---
      const imageBlocks = post.content.blocks.filter(
        (b) => b.type === "image" && b.data.file.localFile,
      );

      const initialQueue = imageBlocks.map((b) => ({
        name: b.data.file.localFile.name,
        status: "waiting" as const,
        progress: 0,
      }));
      setUploadQueue(initialQueue);
      // ---------------------------------

      const slug = `${slugify(post.title)}-${postTime}`;

      let currentImageIndex = 0;

      const updatedBlocks = await Promise.all(
        post.content.blocks.map(async (block) => {
          if (block.type === "image" && block.data.file.localFile) {
            const file = block.data.file.localFile;
            const fileIndex = currentImageIndex++; // Track which queue item this is

            // Update status to "uploading"
            setUploadQueue((prev) =>
              prev.map((item, i) =>
                i === fileIndex ? { ...item, status: "uploading" } : item,
              ),
            );

            const { url, error } = await uploadImage(
              file,
              `post-${postTime}/image-${fileIndex}.${file.name.split(".").pop()}`,
              (percent) => {
                // --- Update Progress in State ---
                setUploadQueue((prev) =>
                  prev.map((item, i) =>
                    i === fileIndex ? { ...item, progress: percent } : item,
                  ),
                );
              },
            );

            if (error) throw new Error("Image upload failed");

            // Update status to "completed"
            setUploadQueue((prev) =>
              prev.map((item, i) =>
                i === fileIndex
                  ? { ...item, status: "completed", progress: 100 }
                  : item,
              ),
            );

            return {
              type: block.type,
              data: { caption: block.data.caption, file: { url } },
            } as Block;
          }
          return block;
        }),
      );

      const coverImageUrl = updatedBlocks.find(
        (block) => block.type === "image" && block.data?.file?.url,
      )?.data.file.url;

      // 2. Call the Server Action with clean, serializable JSON
      return await createPostAction({
        title: post.title,
        slug: `${slugify(post.title)}-${postTime}`,
        content: { blocks: updatedBlocks },
        excerpt: post.excerpt,
        created_at: new Date(postTime).toISOString(),
        tagIds: post.tags
          .filter((t) => typeof t.id === "number")
          .map((t) => String(t.id)),
        cover_image_url: coverImageUrl,
        author_id: user.id,
      });
    },
  });

  return { mutate, isPending, uploadQueue };
}
