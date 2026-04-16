// actions/media-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export type MediaItem = {
  name: string;
  url: string;
  created_at: string | null;
  usage_count: number;
};

export async function getMediaLibrary(): Promise<MediaItem[]> {
  const supabase = await createClient();

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
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/post-images/blog/${file.name}`;

        const { data: usageCount } = await supabase.rpc(
          "get_image_usage_count",
          { image_url: publicUrl },
        );

        return {
          name: file.name,
          url: publicUrl,
          created_at: file.created_at,
          usage_count: usageCount || 0,
        };
      }),
  );

  return mediaItems;
}

export async function deleteMediaAction(fileName: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("post-images")
    .remove([`blog/${fileName}`]);

  if (error) {
    throw new Error("Failed to delete image from storage");
  }

  return { success: true };
}
