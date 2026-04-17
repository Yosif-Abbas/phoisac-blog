import { createClient } from "@/lib/supabase/server";

export async function getServerTags() {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("tags_with_published_counts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching tags:", error);
    throw new Error(error.message);
  }

  return { data, count };
}
