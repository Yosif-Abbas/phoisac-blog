import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getMediaLibrary() {
  const { data: media, error } = await supabase
    .from("media")
    .select("*")
    .order("file_size", { ascending: false });

  if (error) {
    console.error("❌ Error fetching media library:", error.message);
    return [];
  }

  const mediaItems = await Promise.all(
    media.map(async (item) => {
      const { data: usageCount } = await supabase.rpc("get_image_usage_count", {
        image_url: item.public_url,
      });

      return {
        id: item.id,
        file_name: item.file_name,
        public_url: item.public_url,
        file_path: item.file_path,
        created_at: item.created_at,
        file_size: item.file_size,
        width: item.width,
        height: item.height,
        usage_count: usageCount || 0,
      };
    }),
  );

  return mediaItems;
}
