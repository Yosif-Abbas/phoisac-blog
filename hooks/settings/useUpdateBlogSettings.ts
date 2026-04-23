import { updateSettingsAction } from "@/actions/settings-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateBlogSettings() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateBlogSettings, isPending } = useMutation({
    mutationFn: async (description: string) => {
      return await updateSettingsAction({
        blog_page_description: description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("تم تحديث وصف المدونة!");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء التحديث");
    },
  });

  return { updateBlogSettings, isPending };
}
