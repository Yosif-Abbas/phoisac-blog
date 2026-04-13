// services/server/posts.ts
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types/cms";

const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE || "10", 10);

export async function getServerPosts({
  pageParam = 0,
  searchTerm = "",
  tags = [],
}: {
  pageParam?: number;
  searchTerm?: string;
  tags?: string[];
}) {
  // 1. Initialize the Server Client
  const supabase = await createClient();

  const hiddenAuthorId = "93b90a78-1d9d-43a3-b680-2732953c592c";

  let query: any;

  // 2. The Search Logic
  if (searchTerm) {
    query = supabase
      .rpc("search_posts_pro", { search_term: searchTerm })
      .select(
        `id,created_at,updated_at,last_activity,title,slug,excerpt,post_tags(tags(id,name))`,
      );
  } else {
    query = supabase
      .from("posts")
      .select(
        `id,created_at,updated_at,last_activity,title,slug,excerpt,post_tags(tags(id,name))`,
      );
  }

  query = query.neq("author_id", hiddenAuthorId);

  // 3. The Tag Filtering Logic
  if (tags.length > 0) {
    const { data: tagData } = await supabase
      .from("tags")
      .select("id")
      .in("name", tags);

    const tagIds = tagData?.map((t) => t.id) || [];

    if (tagIds.length > 0) {
      const { data: relations } = await supabase
        .from("post_tags")
        .select("post_id")
        .in("tag_id", tagIds);

      const postIds = relations?.map((r) => r.post_id) || [];
      if (postIds.length === 0) return { posts: [], nextCursor: null };

      query = query.in("id", postIds);
    } else {
      return { posts: [], nextCursor: null };
    }
  }

  // 4. Execute the Final Query
  const { data, error } = await query
    .order("last_activity", { ascending: false })
    .range(pageParam, pageParam + pageSize - 1);

  if (error || !data) {
    console.error("Server Fetch Error:", error);
    return { posts: [], nextCursor: null };
  }

  // 5. Format and Return
  const posts = (data as Post[]).map((post) => ({
    ...post,
    tags:
      post["post_tags"]
        ?.map((pt: any) => pt.tags)
        .filter(Boolean)
        .flat?.() || [],
    post_tags: undefined,
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
    .select(
      `id,created_at,updated_at,title,slug,excerpt,content,view_count,cover_image_url,post_tags(tags(id,name))`,
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Error fetching post:", error);
    return null;
  }

  const tags =
    data["post_tags"]
      ?.map((pt: any) => pt.tags)
      ?.filter(Boolean)
      .flat() || [];

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
    .select(
      `id,created_at,updated_at,title,slug,excerpt,post_tags(tags(id,name))`,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const posts = data?.map((post) => ({
    ...post,

    tags: post["post_tags"]?.map((pt) => pt.tags).flat?.(),
  }));

  return posts;
}

export async function getPosts() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase.from("posts").select("slug"); // We only need the slug for the params

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return posts;
}
