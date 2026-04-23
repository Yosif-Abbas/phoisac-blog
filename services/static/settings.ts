import { createStaticClient } from "@/lib/supabase/static";

export const getSiteSettings = async () => {
  const supabase = createStaticClient();
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error("Settings fetch error:", error);
    return null;
  }
  return data;
};
