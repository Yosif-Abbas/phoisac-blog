// useCreatePost.ts
import { useMutation } from "@tanstack/react-query";
import { OutputData } from "@editorjs/editorjs";
import { Block, Post } from "@/types/post";
import { createPost, uploadImage } from "@/services/posts";

export function useCreatePost() {
  const { mutate, isPending } = useMutation({
    mutationFn: async (post: { title: string; content: OutputData }) => {
      const slug = post.title.trim().toLowerCase().replace(/\s+/g, "-");

      // 1. Upload images
      const postTime = Date.now();
      const updatedBlocks = await Promise.all(
        post.content.blocks.map(async (block) => {
          let imageCount = 0;
          if (block.type === "image") {
            imageCount++;
            const file = block.data.file.localFile;
            const fileExt = file.name.split(".").pop();
            const fileName = `image-${imageCount}.${fileExt}`;
            const filePath = `post-${postTime}/${fileName}`;

            const { url, error } = await uploadImage(file, filePath);

            return {
              type: block.type,
              data: {
                caption: block.data.caption,
                url,
              },
            } as Block;
          }
          return {
            type: block.type,
            data: { text: block.data.text },
          } as Block;
        }),
      );

      // 2. Build final payload
      const postPayload: Post = {
        title: post.title,
        slug,
        content: { blocks: updatedBlocks },
        created_at: new Date(postTime),
      };

      createPost(postPayload);
    },
  });

  return { mutate, isPending };
}
