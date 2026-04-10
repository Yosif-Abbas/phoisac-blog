"use server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils/media";
import type { StructuredContent } from "@/types/cms";
import { revalidatePath } from "next/cache";

// Notice we only accept clean data here, no raw Files.
export async function createPostAction(payload: {
  title: string;
  slug: string;
  content: StructuredContent; // Editor.js OutputData
  excerpt?: string;
  created_at: string; // Dates serialize better as strings between Client/Server
  tagIds: string[]; // Only pass the IDs to save payload size
  cover_image_url?: string;
  author_id: string;
}) {
  const supabase = await createClient();

  const firstImageUrl =
    payload.cover_image_url ||
    payload.content?.blocks?.find(
      (block: any) => block.type === "image" && block.data?.file?.url,
    )?.data?.file?.url;

  const finalTitle = await getUniqueTitle(supabase, payload.title);

  const finalSlug = payload.slug.includes(payload.title)
    ? payload.slug
    : generateSlug(finalTitle);

  // 1. Insert the Post
  const { data: post, error: postError } = await supabase
    .from("posts")
    .insert([
      {
        title: finalTitle,
        slug: finalSlug,
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
  postId: string;
  author_id: string;
  updated_at: string;
  slug: string; // Used to clear the specific post's cache
  title: string;
  excerpt?: string;
  content: StructuredContent; // Editor.js OutputData
  cover_image_url?: string;
  newTagIds: string[];
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

  const finalTitle = await getUniqueTitle(
    supabase,
    payload.title,
    payload.postId,
  );

  const updateData: any = {
    title: finalTitle,
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

// Helper to escape regex characters in case a title has brackets or stars
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getUniqueTitle(
  supabase: any,
  baseTitle: string,
  excludePostId?: string,
): Promise<string> {
  // 1. Ask Supabase for any titles that start with our base title
  let query: any = supabase
    .from("posts")
    .select("title")
    .ilike("title", `${baseTitle}%`); // Fetch only potential matches to save memory

  // If we're updating an existing post, exclude that post from the results
  if (excludePostId != null) {
    query = query.neq("id", excludePostId);
  }

  const { data, error } = await query;

  if (error) throw new Error("Failed to check for unique titles.");

  // If no matches at all, the base title is safe!
  if (!data || data.length === 0) return baseTitle;

  let maxNumber = 0;
  let exactMatchFound = false;

  // 2. Set up our pattern to look exactly for "Title" or "Title 2", "Title 3"
  const titleRegex = new RegExp(
    `^${escapeRegExp(baseTitle)}(?: (\\d+))?$`,
    "i",
  );

  for (const row of data) {
    const match = row.title.match(titleRegex);
    if (match) {
      if (match[1]) {
        // We found a number at the end (e.g., "2" from "Title 2")
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      } else {
        // We found the exact base title with no numbers
        exactMatchFound = true;
      }
    }
  }

  // If we only found things like "My Title is cool" but not exact matches, we are good.
  if (!exactMatchFound && maxNumber === 0) return baseTitle;

  // If we found an exact match, but no numbers yet, our next number is 2.
  // Otherwise, it's the highest number we found + 1.
  const nextNumber = Math.max(2, maxNumber + 1);

  return `${baseTitle} ${nextNumber}`;
}
