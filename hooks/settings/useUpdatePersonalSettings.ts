import { updateSettingsAction } from "@/actions/settings-actions";
import { generateStoragePath, optimizeAvatarClient } from "@/lib/utils/media";
import { uploadImage } from "@/services/client/posts";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface PersonalSettingsInput {
  full_name: string;
  icon_image_file?: File | null;
  current_icon_url: string;
}

export function useUpdatePersonalSettings() {
  const queryClient = useQueryClient();

  const { mutateAsync: updatePersonalSettings, isPending } = useMutation({
    mutationFn: async (data: PersonalSettingsInput) => {
      let finalIconUrl = data.current_icon_url;

      if (data.icon_image_file) {
        // 1. Safely compress to 300x300 webp using Web Workers (no Canvas!)
        const optimizedIcon = await optimizeAvatarClient(data.icon_image_file);

        // 2. Generate path and upload directly via client
        const path = generateStoragePath(optimizedIcon.name, "settings");
        const uploadResult = await uploadImage(
          optimizedIcon,
          path,
          "post-images",
        );

        if (uploadResult.error) throw new Error(uploadResult.error);
        finalIconUrl = uploadResult.url!;
      }

      const payload = {
        full_name: data.full_name,
        icon_image_url: finalIconUrl,
      };

      return await updateSettingsAction(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("تم تحديث المعلومات الشخصية!");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء التحديث");
    },
  });

  return { updatePersonalSettings, isPending };
}
