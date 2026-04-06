// services/server/posts.ts
import { createClient } from "@/lib/supabase/server";
import { Tag, PostContent } from "@/types/post";

type PostWithTagsRaw = {
  id?: number;
  content: PostContent;
  title: string;
  slug?: string;
  created_at?: string;
  updated_at?: string | null;
  post_tags: Array<{
    tags: Tag;
  }>;
};

export async function getServerPosts({
  pageParam = 0,
  searchTerm = "", // New parameter
}) {
  const supabase = await createClient();
  const pageSize = 5;

  let query = supabase
    .from("posts")
    .select(`*, "post_tags"(*, tags(*))`)
    .order("created_at", { ascending: false });

  // 🔍 THE SEARCH LOGIC
  if (searchTerm) {
    // ilike is case-insensitive search.
    // %${searchTerm}% means "contains this string anywhere"
    query = query.ilike("title", `%${searchTerm}%`);
  }

  const { data, error } = await query.range(
    pageParam,
    pageParam + pageSize - 1,
  );

  if (error) throw new Error(error.message);

  const posts = data?.map((post: PostWithTagsRaw) => ({
    ...post,
    tags: post["post_tags"]?.map((pt) => pt.tags),
  }));

  return {
    posts,
    nextCursor: data.length === pageSize ? pageParam + pageSize : null,
  };
}

export async function getServerPostBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(`*, "post_tags"(*, tags(*))`)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Error fetching post:", error);
    return null;
  }

  // Clean up the nesting from the join
  const tags = data["post_tags"]?.map((pt: { tags: Tag }) => pt.tags) || [];

  return {
    ...data,
    tags,
    post_tags: undefined,
  };
}

export async function getLatestPosts({ limit }: { limit: number }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(`*, "post_tags"(*, tags(*))`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const posts = data?.map((post: PostWithTagsRaw) => ({
    ...post,

    tags: post["post_tags"]?.map((pt) => pt.tags),
  }));

  return posts;
}
