// services/server/auth.ts
import { createClient } from "@/lib/supabase/server";

export async function getServerUser() {
  const supabase = await createClient();

  // 1. Get the Auth User
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !authUser) return null;

  // 2. Get the Profile (No "Check and Create" needed anymore!)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return null;
  }

  // 3. Merge them and return
  return {
    ...profile,
    user_metadata: authUser.user_metadata,
    identities: authUser.identities,
  };
}

export async function getQueryClientUser() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", authUser.id)
    .single();

  if (!profile) return null;

  return {
    ...profile,
    role: profile.role || "user",
    email: authUser.email,
    avatar_url: authUser.user_metadata.avatar_url,
    full_name: authUser.user_metadata.full_name,
  };
}
