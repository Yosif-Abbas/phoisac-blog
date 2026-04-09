import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePageAction } from "@/actions/page-actions";
import { uploadImage } from "@/services/client/posts";

import toast from "react-hot-toast";
import {
  generateStoragePath,
  optimizeImageBeforeUpload,
} from "@/lib/utils/media";
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
      // 1. Process all blocks to find images that need uploading
      const updatedBlocks = await Promise.all(
        content.blocks.map(async (block) => {
          // Check if it's an image block AND has a local file (blob)
          // Editor.js usually stores the file in block.data.file.localFile if you set it up that way
          if (block.type === "image" && block.data.file?.localFile) {
            const file = block.data.file.localFile;

            // 2. Optimize (Compress + WebP)
            const optimizedFile = await optimizeImageBeforeUpload(file);

            // 3. Generate a professional path
            const filePath = generateStoragePath(
              optimizedFile.name,
              `pages/${page_name}`,
            );

            // 4. Upload to Supabase
            const { url, error } = await uploadImage(
              optimizedFile,
              filePath,
              "post-images",
            );

            if (error) throw new Error(`Image upload failed: ${error}`);

            // 5. Return the block with the NEW permanent URL
            return {
              ...block,
              data: {
                ...block.data,
                file: { url }, // Replace local blob with remote URL
              },
            };
          }

          // If it's text or an already uploaded image, return as is
          return block;
        }),
      );

      // 6. Send the cleaned content to the Server Action
      const updateDate = new Date().toISOString();
      const cleanContent = { ...content, blocks: updatedBlocks };

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
