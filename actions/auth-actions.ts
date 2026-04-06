"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logoutServerAction() {
  const supabase = await createClient();

  // 1. Sign out on the server (this clears the cookies)
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);

  // 2. Clear all cached server data
  revalidatePath("/", "layout");

  // 3. Force a redirect to the home page (clean slate)
  redirect("/");
}
