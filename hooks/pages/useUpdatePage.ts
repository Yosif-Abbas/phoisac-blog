import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePageAction } from "@/actions/page-actions";
import { uploadImage } from "@/services/client/posts";

import toast from "react-hot-toast";
import { generateStoragePath } from "@/lib/utils/media";
import { normalizeBlock } from "@/lib/utils/types";
import type { StructuredContent } from "@/types/cms";

export function useUpdatePage() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      page_name,
      content,
    }: {
      page_name: string;
      content: StructuredContent;
    }) => {
      const updatedBlocks = await Promise.all(
        content.blocks.map(async (block) => {
          if (block.type === "image" && block.data.file?.localFile) {
            const file = block.data.file.localFile;

            const filePath = generateStoragePath(
              file.name,
              `pages/${page_name}`,
            );

            const { url, error } = await uploadImage(
              file,
              filePath,
              "post-images",
            );

            if (error) throw new Error(`Image upload failed: ${error}`);

            return {
              ...block,
              data: {
                ...block.data,
                file: { url },
              },
            };
          }

          return block;
        }),
      );

      // 6. Normalize blocks and send the cleaned content to the Server Action
      const normalizedBlocks = updatedBlocks.map((b) => normalizeBlock(b));
      const updateDate = new Date().toISOString();
      const cleanContent = { ...content, blocks: normalizedBlocks };

      return await updatePageAction({
        page_name,
        content: cleanContent,
        updateDate,
      });
    },
    onSuccess: (_, { page_name }) => {
      queryClient.invalidateQueries({ queryKey: ["page", page_name] });
      toast.success("تم تحديث الصفحة بنجاح!");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ اثناء تحديث الصفحة!");
    },
  });

  return { mutate, isPending };
}
