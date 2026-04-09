import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { deleteTagAction } from "@/actions/tag-actions";

export function useDeleteTag() {
  const queryClient = useQueryClient();

  const { mutate: deleteTag, isPending } = useMutation({
    mutationFn: async ({ tagId }: { tagId: string }) => {
      await deleteTagAction({ tagId });
    },
    onSuccess: () => {
      toast.success("تم حذف الوسم!");

      // Refresh the specific post in the cache
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ اثناء حذف الوسم!");
    },
  });

  return { deleteTag, isPending };
}
