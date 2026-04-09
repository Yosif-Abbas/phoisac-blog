"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logoutServerAction() {
  const supabase = await createClient();

  // 1. Sign out on the server (clears Supabase cookies)
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);

  // 2. Clear server cache so the Next.js layouts know the user is gone
  revalidatePath("/", "layout");

  // Return a simple success flag instead of redirecting
  return { success: true };
}
