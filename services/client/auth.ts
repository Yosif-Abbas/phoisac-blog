// services/client/auth.ts
import { createClient } from "@/lib/supabase/client";

export async function getClientUser() {
  const supabase = createClient();

  // 1. Get the current Auth user (safe, server-verified on the client)
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  // If no one is logged in, return null immediately
  if (authError || !authUser) return null;

  // 2. Fetch the corresponding profile from your 'users' table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (profileError) {
    console.error("Error fetching client profile:", profileError.message);
    return null;
  }

  // 3. Return a clean, merged object for your UI
  return {
    ...profile,
    email: authUser.email,
    user_metadata: authUser.user_metadata,
  };
}

export async function loginWithGoogle() {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) throw error;
}

export async function logout() {
  const supabase = createClient(); // Your client-side Supabase client

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
