import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTagAction } from "@/actions/tag-actions";
import toast from "react-hot-toast";

export function useCreateTag() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (tagName: string) => {
      return await createTagAction(tagName);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || "حدث خطأ أثناء اضافة الوسم");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });

      toast.success("تمت اضافة سم جديد!");
    },
  });

  return { mutate, isPending };
}
