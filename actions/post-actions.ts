"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Notice we only accept clean data here, no raw Files.
export async function createPostAction(payload: {
  title: string;
  slug: string;
  content: any; // Editor.js OutputData
  excerpt?: string;
  created_at: string; // Dates serialize better as strings between Client/Server
  tagIds: string[]; // Only pass the IDs to save payload size
  cover_image_url?: string;
  author_id: number;
}) {
  const supabase = await createClient();

  const firstImageUrl =
    payload.cover_image_url ||
    payload.content?.blocks?.find(
      (block: any) => block.type === "image" && block.data?.file?.url,
    )?.data?.file?.url;

  // 1. Insert the Post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert([
      {
        title: payload.title,
        slug: payload.slug,
        content: payload.content,
        excerpt: payload.excerpt,
        created_at: payload.created_at,
        status: "published",
        cover_image_url: firstImageUrl ?? null,
        author_id: payload.author_id,
      },
    ])
    .select()
    .single();

  if (postError) throw new Error(`Post creation failed: ${postError.message}`);

  // 2. Insert the Tags (if any exist)
  if (payload.tagIds && payload.tagIds.length > 0) {
    const { error: tagsError } = await supabase.from("post_tags").insert(
      payload.tagIds.map((tagId) => ({
        post_id: post.id,
        tag_id: tagId,
      })),
    );

    if (tagsError) throw new Error(`Tag linking failed: ${tagsError.message}`);
  }

  // 3. THE MAGIC: Invalidate the cache so the front-end updates instantly
  revalidatePath("/blog");
  revalidatePath("/dashboard");

  return post;
}

export async function updatePostAction(payload: {
  postId: number;
  slug: string; // Used to clear the specific post's cache
  title: string;
  content: any; // Editor.js OutputData
  excerpt?: string;
  newTagIds: number[];
  updated_at: string;
  cover_image_url?: string;
  author_id: number;
}) {
  const supabase = await createClient();

  const { data: existingPost, error: existingPostError } = await supabase
    .from("posts")
    .select("cover_image_url")
    .eq("id", payload.postId)
    .single();

  if (existingPostError) {
    throw new Error(
      `Failed to load existing post: ${existingPostError.message}`,
    );
  }

  const firstImageUrl =
    payload.cover_image_url ||
    payload.content?.blocks?.find(
      (block: any) => block.type === "image" && block.data?.file?.url,
    )?.data?.file?.url;

  const updateData: any = {
    title: payload.title,
    content: payload.content,
    excerpt: payload.excerpt,
    updated_at: payload.updated_at,
    status: "published",
    author_id: payload.author_id,
  };

  if (!existingPost?.cover_image_url && firstImageUrl) {
    updateData.cover_image_url = firstImageUrl;
  }

  // 1. Update the Post Content
  const { error: postError } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", payload.postId);

  if (postError) throw new Error(`Update failed: ${postError.message}`);

  // 2. Sync Tags (The Diffing Logic)
  const { data: currentTags, error: tagError } = await supabase
    .from("post_tags")
    .select("tag_id")
    .eq("post_id", payload.postId);

  if (tagError)
    throw new Error(`Failed to fetch current tags: ${tagError.message}`);

  const currentTagIds = currentTags.map((t) => t.tag_id);
  const toAdd = payload.newTagIds.filter((id) => !currentTagIds.includes(id));
  const toRemove = currentTagIds.filter(
    (id) => !payload.newTagIds.includes(id),
  );

  // 3. Execute Deletes and Inserts in parallel for maximum speed
  const operations = [];

  if (toRemove.length > 0) {
    operations.push(
      supabase
        .from("post_tags")
        .delete()
        .eq("post_id", payload.postId)
        .in("tag_id", toRemove),
    );
  }

  if (toAdd.length > 0) {
    operations.push(
      supabase
        .from("post_tags")
        .insert(
          toAdd.map((tagId) => ({ post_id: payload.postId, tag_id: tagId })),
        ),
    );
  }

  // Wait for tag syncing to finish
  await Promise.all(operations);

  // 4. THE MAGIC: Clear all caches where this post might appear
  revalidatePath("/blog");
  revalidatePath(`/blog/${payload.slug}`); // Clear the specific post page!
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deletePostAction({ slug }: { slug: string }) {
  const supabase = await createClient();

  const { error } = await supabase.from("posts").delete().eq("slug", slug);

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
}
