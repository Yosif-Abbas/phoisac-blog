import { createClient } from "@/lib/supabase/client";
import { PostType } from "@/types/post-content";

const supabaseClient = createClient();

export async function createPost({ title, slug, content }: PostType) {
  const { error } = await supabaseClient
    .from("posts")
    .insert([{ title, slug, content }]);

  if (error) throw new Error(error.message);
}

export async function uploadImage(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabaseClient.storage
    .from("post-images")
    .upload(fileName, file);

  console.log(data);

  if (error) throw new Error(error.message);

  return data;

  //   function uploadImage(file: File): Promise<{
  //     id: string;
  //     path: string;
  //     fullPath: string;
  // }>
}
