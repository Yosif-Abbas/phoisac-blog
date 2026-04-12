import { createClient } from "@/lib/supabase/client";
import type { Post, PostTag } from "@/types/cms";

const supabaseClient = createClient();
const pageSize = parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE || "10", 10);

// services/client/posts.ts
export async function getPosts({
  pageParam = 0,
  searchTerm = "",
  tags = [],
}: {
  pageParam: number;
  searchTerm?: string;
  tags?: string[];
}) {
  let query: any;

  if (searchTerm) {
    query = supabaseClient
      .rpc("search_posts_pro", { search_term: searchTerm })
      .select(
        `id,created_at,updated_at,last_activity,title,slug,excerpt,post_tags(tags(id,name))`,
      );
  } else {
    query = supabaseClient
      .from("posts")
      .select(
        `id,created_at,updated_at,last_activity,title,slug,excerpt,post_tags(tags(id,name))`,
      );
  }

  if (tags.length > 0) {
    const { data: tagData } = await supabaseClient
      .from("tags")
      .select("id")
      .in("name", tags);

    const tagIds = tagData?.map((t) => t.id) || [];

    if (tagIds.length > 0) {
      const { data: relations } = await supabaseClient
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

  // Execute the final query
  const { data, error } = await query
    .order("last_activity", { ascending: false })
    .range(pageParam, pageParam + pageSize - 1);

  if (error || !data) {
    console.error(error);
    return { posts: [], nextCursor: null };
  }

  const posts = (data as Post[]).map((post) => ({
    ...post,
    tags:
      post["post_tags"]
        ?.map((pt: PostTag) => pt.tags)
        .filter(Boolean)
        .flat?.() || [],
    post_tags: undefined,
  }));

  return {
    posts,
    nextCursor: data.length === pageSize ? pageParam + pageSize : null,
  };
}

export async function createPost({
  title,
  slug,
  content,
  created_at,
  tags,
}: Post) {
  const { data: post, error } = await supabaseClient
    .from("posts")
    .insert([{ title, slug, content, created_at }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (tags && tags.length > 0) {
    if (tags) {
      const { error: postTagsError } = await supabaseClient
        .from("post_tags")
        .insert(
          tags.map((tag) => ({
            post_id: post.id,
            tag_id: tag.id,
          })),
        );
      postTagsError;

      if (postTagsError) throw new Error(postTagsError.message);
    }
  }

  return post;
}

export interface UploadImageResult {
  url: string | null;
  path: string | null;
  error: string | null;
}

export type UploadBucket = "post-images" | "pages-images";

export async function uploadImage(
  file: File,
  filePath: string,
  bucketName: UploadBucket,
): Promise<UploadImageResult> {
  try {
    // 2. Use the official SDK to handle the upload, auth, and headers automatically
    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type, // Explicitly pass the file type
      });

    if (error) {
      return { url: null, path: null, error: error.message };
    }

    // 3. Let Supabase construct the public URL for you securely
    const { data: publicUrlData } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    // 4. Try to persist a media record for analytics and management
    try {
      const fileName = data.path.split("/").pop() || file.name;
      const fileSize = file.size || 0;
      const mimeType = file.type || "application/octet-stream";

      // Get the currently signed-in user (if any)
      const {
        data: { user: authUser },
      } = await supabaseClient.auth.getUser();

      await supabaseClient.from("media").insert([
        {
          file_name: fileName,
          file_path: data.path,
          public_url: publicUrlData.publicUrl,
          file_size: fileSize,
          mime_type: mimeType,
          alt_text: null,
          uploader_id: authUser?.id || null,
        },
      ]);
    } catch (err) {
      console.error("Failed to insert media row:", err);
    }

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
      error: null,
    };
  } catch (err: unknown) {
    // 4. Catch unexpected network drops or execution crashes safely
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An unexpected network error occurred.";
    return { url: null, path: null, error: errorMessage };
  }
}

// lib/posts.ts
export async function getPostBySlug(slug: string) {
  const { data, error } = await supabaseClient
    .from("posts")
    .select(
      `id,created_at,updated_at,title,slug,excerpt,content,view_count,post_tags(tags(id,name))`,
    )
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);

  const tags = data["post_tags"]?.map((postTag) => postTag.tags);

  const post = {
    ...data,
    tags: tags?.filter(Boolean).flat?.() || [],
    post_tags: undefined,
  };

  return post;
}

export async function deletePost({ slug }: { slug: string }) {
  const { error } = await supabaseClient
    .from("posts")
    .delete()
    .eq("slug", slug);

  if (error) throw new Error(error.message);
}

export async function updatePostWithTags({
  postId,
  data,
  newTagIds,
  updated_at,
}: {
  postId: number;
  slug: string;
  data: {
    title?: string;
    content?: string;
    slug?: string;
  };
  newTagIds: number[];
  updated_at: string;
}) {
  // 1. update post
  const { error } = await supabaseClient
    .from("posts")
    .update({ ...data, updated_at })
    .eq("id", postId);

  if (error) throw new Error(error.message);

  // 2. sync tags
  const { data: currentTags, error: tagError } = await supabaseClient
    .from("post_tags")
    .select("tag_id")
    .eq("post_id", postId);

  if (tagError) throw new Error(tagError.message);

  const currentTagIds = currentTags.map((t) => t.tag_id);

  const toAdd = newTagIds.filter((id) => !currentTagIds.includes(id));
  const toRemove = currentTagIds.filter((id) => !newTagIds.includes(id));

  if (toRemove.length > 0) {
    const { error } = await supabaseClient
      .from("post_tags")
      .delete()
      .eq("post_id", postId)
      .in("tag_id", toRemove);

    if (error) throw new Error(error.message);
  }

  if (toAdd.length > 0) {
    const { error } = await supabaseClient.from("post_tags").insert(
      toAdd.map((tagId) => ({
        post_id: postId,
        tag_id: tagId,
      })),
    );

    if (error) throw new Error(error.message);
  }
}

export async function getLatestPosts({ limit }: { limit: number }) {
  const { data, error } = await supabaseClient
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
