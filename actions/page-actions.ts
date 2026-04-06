"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePageAction({ page_name, content, updateDate }) {
  const supabase = await createClient();

  const { data: tag, error } = await supabase
    .from("pages")
    .update({ content, updated_at: updateDate })
    .eq("page_name", page_name)
    .select();

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/pages/${page_name}`);

  return tag;
}
