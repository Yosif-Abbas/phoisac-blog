import { updateTagAction } from "@/actions/tag-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateTag() {
  const queryClient = useQueryClient();

  const { mutate: updateTag, isPending } = useMutation({
    mutationFn: async ({
      tagId,
      tagName,
    }: {
      tagId: number;
      tagName: string;
    }) => {
      updateTagAction({ tagId, tagName });
    },
    onSuccess: () => {
      toast.success("تم تحديث الوسم!");

      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ اثناء تحديث الوسم!");
    },
  });

  return { updateTag, isPending };
}
