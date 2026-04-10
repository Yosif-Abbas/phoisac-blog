// services/server/posts.ts
import { createStaticClient } from "@/lib/supabase/static";

export async function getPosts() {
  const supabase = createStaticClient(); // Safe for build time!
  const { data: posts, error } = await supabase.from("posts").select("slug");

  if (error) {
    throw new Error("Error fetching posts:", error);
  }

  return posts || [];
}

export async function getPostBySlug(slug: string) {
  const supabase = createStaticClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image_url")
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error("Error fetching post:", error);
  }

  return post;
}
