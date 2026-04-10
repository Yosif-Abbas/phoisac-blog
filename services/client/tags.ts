import { createClient } from "@/lib/supabase/client";

const supabaseClient = createClient();

export async function getTags() {
  const { data, error, count } = await supabaseClient
    .from("tags")
    .select(
      `
      *,
      post_count: post_tags(count)
    `,
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching tags:", error);
    throw new Error(error.message);
  }

  const formattedData = data.map((tag) => ({
    ...tag,
    count: tag.post_count?.[0]?.count || 0,
  }));

  return { data: formattedData, count };
}

export async function addTag(tagName: string) {
  const { data, error } = await supabaseClient
    .from("tags")
    .insert([{ name: tagName }])
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateTag({
  tagId,
  tagName,
}: {
  tagId: string;
  tagName: string;
}) {

  const { error } = await supabaseClient
    .from("tags")
    .update({ name: tagName })
    .eq("id", tagId)
    .select();

  if (error) throw new Error(error.message);
}

export async function deleteTag({ tagId }: { tagId: string }) {
  const { error } = await supabaseClient.from("tags").delete().eq("id", tagId);

  if (error) throw new Error(error.message);
}
