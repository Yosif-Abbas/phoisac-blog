"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTagAction(tagName: string) {
  const supabase = await createClient();

  const cleanName = tagName.trim().toLowerCase();

  const { data: tag, error } = await supabase
    .from("tags")
    .insert([{ name: cleanName }])
    .select();

  if (error) {
    if (error.code === "23505") throw new Error("هذا الوسم موجود بالفعل!");
    throw new Error(error.message);
  }

  revalidatePath("/dashboard", "layout");

  return tag;
}

export async function updateTagAction({
  tagId,
  tagName,
}: {
  tagId: number;
  tagName: string;
}) {
  const supabase = await createClient();

  const { data: tag, error } = await supabase
    .from("tags")
    .update({ name: tagName })
    .eq("id", tagId)
    .select();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/tags");
  revalidatePath("/blog", "layout");

  return tag;
}

export async function deleteTagAction({ tagId }: { tagId: number }) {
  const supabase = await createClient();

  const { error } = await supabase.from("tags").delete().eq("id", tagId);

  if (error) {
    if (error.code === "23503")
      throw new Error("لا يمكن حذف هذا الوسم لأنه مرتبط بمنشورات.");
    throw new Error(error.message);
  }

  revalidatePath("/dashboard", "layout");
}
