import { createClient } from "@/lib/supabase/server";

export async function getServerTags() {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("tags")
    .select(`*, post_count: "post_tags"(count)`, { count: "exact" }) // Get the count too
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const formattedData = data.map((tag: any) => ({
    ...tag,
    count: tag.post_count?.[0]?.count || 0,
  }));

  // MATCH THE CLIENT SHAPE EXACTLY
  return { data: formattedData, count };
}
