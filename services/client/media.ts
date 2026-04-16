import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getMediaLibrary() {
  const { data: files, error } = await supabase.storage
    .from("post-images")
    .list("blog", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error || !files) return [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const mediaItems = await Promise.all(
    files
      .filter((file) => file.name !== ".emptyFolderPlaceholder")
      .map(async (file) => {
        const url = `${supabaseUrl}/storage/v1/object/public/post-images/blog/${file.name}`;

        // Your RPC for usage count
        const { data: usageCount } = await supabase.rpc(
          "get_image_usage_count",
          {
            image_url: url,
          },
        );

        return {
          name: file.name,
          url,
          created_at: file.created_at,
          usage_count: usageCount || 0,
        };
      }),
  );

  return mediaItems;
}
