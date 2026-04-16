import { createClient } from "@/lib/supabase/server";

export async function getMediaLibrary() {
  const supabase = await createClient();

  // 1. Fetch everything from your 'media' table
  const { data: media, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching media library:", error.message);
    return [];
  }

  // 2. Attach usage counts via your RPC
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
