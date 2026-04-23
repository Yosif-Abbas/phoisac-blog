import { createClient } from "@/lib/supabase/client";
import { cache } from "react";

const supabase = createClient();

export const getSiteSettings = cache(async () => {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error("Settings fetch error:", error);
    return null;
  }
  return data;
});
