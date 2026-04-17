import { createClient } from "@/lib/supabase/client";

const supabaseClient = createClient();

export async function getTags() {
  const { data, error, count } = await supabaseClient
    .from("tags_with_published_counts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching tags:", error);
    throw new Error(error.message);
  }

  return { data, count };
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
