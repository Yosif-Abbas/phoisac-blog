import { createClient } from "@/lib/supabase/client";
import { Post } from "@/types/post";

const supabaseClient = createClient();

export async function createPost({ title, slug, content, created_at }: Post) {
  const { error } = await supabaseClient
    .from("posts")
    .insert([{ title, slug, content, created_at }]);

  if (error) throw new Error(error.message);
}

export async function uploadImage(file: File, filePath: string) {
  const { error } = await supabaseClient.storage
    .from("post-images")
    .upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("post-images").getPublicUrl(filePath);

  return {
    path: filePath,
    url: publicUrl,
    error,
  };
}
