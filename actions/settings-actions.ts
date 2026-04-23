"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(updates: Record<string, any>) {
  const supabase = await createClient();

  const { error } = await supabase.from("settings").update(updates).eq("id", 1);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  return { success: true };
}
