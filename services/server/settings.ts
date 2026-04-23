import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getSiteSettings = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error("Settings fetch error:", error);
    return null;
  }
  return data;
});
