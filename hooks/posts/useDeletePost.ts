import { deletePostAction } from "@/actions/post-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeletePost() {
  const queryClient = useQueryClient();
  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: ({ slug }: { slug: string }) => deletePostAction({ slug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("تم حذف المنشور!");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ اثناء الحذف!");
    },
  });

  return { deletePost, isPending };
}
