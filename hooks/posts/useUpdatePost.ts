"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { uploadImage } from "@/services/client/posts";
import { Block, PostContent, Tag } from "@/types/post";
import { updatePostAction } from "@/actions/post-actions";
import { useCurrentUser } from "../auth/useCurrentUser";

type UpdatePostPayload = {
  postId: number;
  slug: string;
  title: string;
  content: PostContent;
  excerpt?: string;
  tags: Tag[];
};

export function useUpdatePost() {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  const { mutate: updatePost, isPending } = useMutation({
    mutationFn: async (post: UpdatePostPayload) => {
      const updateTime = new Date().toISOString();

      // 1. Process blocks (Upload ONLY new images)
      const updatedBlocks = await Promise.all(
        post.content.blocks.map(async (block, index) => {
          if (block.type === "image") {
            const file = block.data?.file?.localFile as
              | globalThis.File
              | undefined;

            if (file) {
              const fileExt = file.name.split(".").pop() ?? "bin";
              const fileName = `image-${index}-${Date.now()}.${fileExt}`;
              const filePath = `post-${post.postId}/${fileName}`;

              const { url, error } = await uploadImage(file, filePath);
              if (error) throw new Error("حدث خطأ أثناء رفع بعض الصور");

              return {
                ...block,
                data: {
                  ...block.data,
                  file: { url },
                },
              } as Block;
            }
            return block as Block;
          }
          return block as Block;
        }),
      );

      // 2. Extract Tag IDs
      const newTagIds = post.tags
        .filter((tag) => typeof tag.id === "number")
        .map((tag) => tag.id as number);
      const coverImageUrl = updatedBlocks.find(
        (block) => block.type === "image" && block.data?.file?.url,
      )?.data?.file?.url;

      // 3. Call the Server Action
      return await updatePostAction({
        postId: post.postId,
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

    onError: (error: any) => {
      console.error(error);
      toast.error(
        error.message || "فشل تحديث المنشور، يرجى المحاولة مرة أخرى.",
      );
    },
  });

  return { updatePost, isPending };
}
