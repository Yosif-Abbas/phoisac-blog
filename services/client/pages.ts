import { createClient } from "@/lib/supabase/client";

export async function getPages() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("title, created_at, updated_at, page_name, description");

  if (error) throw new Error(error.message);

  return data;
}

export async function getPage({ page_name }: { page_name: string }) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("title, content")
    .eq("page_name", page_name)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
