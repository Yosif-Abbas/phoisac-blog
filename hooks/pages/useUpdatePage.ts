import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OutputData } from "@editorjs/editorjs";
import { updatePageAction } from "@/actions/page-actions";
import toast from "react-hot-toast";

export function useUpdatePage() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { page_name: string; content: OutputData }) => {
      const updateDate = new Date().toISOString();
      return await updatePageAction({ ...data, updateDate });
    },
    onSuccess: (_, { page_name }) => {
      // Invalidate the query to refetch the page data
      queryClient.invalidateQueries({
        queryKey: ["pages", page_name],
      });

      toast.success("تم تحديث الصفحة!");
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ اثناء تحديث الصفحة!");
    },
  });

  return { mutate, isPending };
}
