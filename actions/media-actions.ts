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

  const storagePath = `blog/${fileName}`;

  const { error } = await supabase.storage
    .from("post-images")
    .remove([storagePath]);

  if (error) {
    throw new Error("Failed to delete image from storage");
  }

  // Also remove the row from the `media` table so it disappears from the library.
  // This is best-effort: even if the table schema differs, the storage deletion should still succeed.
  try {
    const { error: mediaError } = await supabase
      .from("media")
      .delete()
      .eq("file_path", storagePath);

    if (mediaError) {
      console.warn("Failed to delete media row by file_path:", mediaError);
    }
  } catch (err) {
    console.warn("Failed to delete media row:", err);
  }

  // Fallback: some schemas may store only `file_name`
  try {
    const { error: mediaErrorByName } = await supabase
      .from("media")
      .delete()
      .eq("file_name", fileName);

    if (mediaErrorByName) {
      console.warn(
        "Failed to delete media row by file_name:",
        mediaErrorByName,
      );
    }
  } catch (err) {
    console.warn("Failed to delete media row by file_name:", err);
  }

  return { success: true };
}
