import { createClient } from "@/lib/supabase/client";
import { Post, PostContent, Tag } from "@/types/post";

const supabaseClient = createClient();

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
  const pageSize = 5;

  // By using 'any', we stop VS Code from throwing the giant red TypeScript error
  let query: any;

  if (searchTerm) {
    query = supabaseClient
      .rpc("search_posts_pro", { search_term: searchTerm })
      .select(`*, "post_tags"(*, tags(*))`);
  } else {
    query = supabaseClient.from("posts").select(`*, "post_tags"(*, tags(*))`);
  }

  // Handle Tags gracefully
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
    .order("created_at", { ascending: false })
    .range(pageParam, pageParam + pageSize - 1);

  if (error || !data) {
    console.error(error);
    return { posts: [], nextCursor: null };
  }

  const posts = (data as any[]).map((post) => ({
    ...post,
    tags: post["post_tags"]?.map((pt: any) => pt.tags).filter(Boolean) || [],
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

  console.log(error);
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
      console.log(postTagsError);

      if (postTagsError) throw new Error(postTagsError.message);
    }
  }

  return post;
}

// utils/supabase/posts.ts

export interface UploadImageResult {
  url: string | null;
  path: string | null;
  error: string | null;
}

export async function uploadImage(
  file: File,
  filePath: string,
  onProgress?: (percent: number) => void,
): Promise<UploadImageResult> {
  return new Promise((resolve) => {
    // 1. Pull environment variables (no hardcoded project IDs)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const bucketName = "post-images"; // Consider passing this as a parameter if it changes

    if (!supabaseUrl || !anonKey) {
      return resolve({
        url: null,
        path: null,
        error: "Missing Supabase environment variables.",
      });
    }

    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;
    const xhr = new XMLHttpRequest();

    xhr.open("POST", uploadUrl, true);

    // 2. Set necessary headers
    xhr.setRequestHeader("Authorization", `Bearer ${anonKey}`);
    xhr.setRequestHeader("apikey", anonKey);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("Content-Type", file.type); // Important for storage file types

    // 3. Handle Progress
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    // 4. Handle Completion
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Construct the public URL dynamically to avoid needing the supabase-js client
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
        resolve({ url: publicUrl, path: filePath, error: null });
      } else {
        // Attempt to parse Supabase's specific error message
        let errorMessage = `Upload failed with status ${xhr.status}`;
        try {
          const response = JSON.parse(xhr.responseText);
          errorMessage = response.message || response.error || errorMessage;
        } catch {
          // Fallback to the generic error message if parsing fails
        }
        resolve({ url: null, path: null, error: errorMessage });
      }
    };

    // 5. Handle Network Errors
    xhr.onerror = () => {
      resolve({
        url: null,
        path: null,
        error: "A network error occurred during the upload.",
      });
    };

    // 6. Execute Upload
    xhr.send(file);
  });
}

// lib/posts.ts
export async function getPostBySlug(slug: string) {
  const { data, error } = await supabaseClient
    .from("posts")
    .select(`*,post_tags(*, tags(*))`)
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);

  console.log(data);

  const tags = data["post_tags"]?.map((postTag) => postTag.tags);

  const post = {
    ...data,
    tags,
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
  slug,
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

// type PostWithTagsRaw = {
//   id?: number;
//   content: PostContent;
//   title: string;
//   slug?: string;
//   created_at?: string;
//   updated_at?: string | null;
//   post_tags: Array<{
//     tags: Tag;
//   }>;
// };

export async function getLatestPosts({ limit }: { limit: number }) {
  const { data, error } = await supabaseClient
    .from("posts")
    .select(`*, "post_tags"(*, tags(*))`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const posts = data?.map((post: Post) => ({
    ...post,
    tags: post["post_tags"]?.map((pt) => pt.tags),
  }));

  console.log(posts);

  return posts;
}
