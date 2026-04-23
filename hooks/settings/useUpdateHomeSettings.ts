import { updateSettingsAction } from "@/actions/settings-actions";
import { generateStoragePath } from "@/lib/utils/media";
import { uploadImage } from "@/services/client/posts";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface HomeSettingsInput {
  home_quote: string;
  home_image_file?: File | null;
  current_image_url: string;
}

export function useUpdateHomeSettings() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateHomeSettings, isPending } = useMutation({
    mutationFn: async (data: HomeSettingsInput) => {
      let finalImageUrl = data.current_image_url;

      // 1. Handle Image Upload if a new file is provided
      if (data.home_image_file) {
        const path = generateStoragePath(data.home_image_file.name, "settings");

        const uploadResult = await uploadImage(
          data.home_image_file,
          path,
          "post-images",
        );

        if (uploadResult.error) throw new Error(uploadResult.error);
        finalImageUrl = uploadResult.url!;
      }

      // 2. Prepare the specific payload for the generic action
      // Note: mapping 'home_quote' to 'home_quote' for your DB
      const payload = {
        home_quote: data.home_quote,
        home_image_url: finalImageUrl,
      };

      // 3. Call the generic Server Action
      return await updateSettingsAction(payload);
    },
    onSuccess: () => {
      // Refresh the cache for the 'settings' query
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("تم تحديث إعدادات الصفحة الرئيسية!");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء التحديث");
    },
  });

  return { updateHomeSettings, isPending };
}
