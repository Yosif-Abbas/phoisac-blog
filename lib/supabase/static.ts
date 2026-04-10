// lib/supabase/static.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createStaticClient() {
  // This client is "dumb"—it doesn't know about users or cookies.
  // It just fetches public data, which is perfect for build-time.
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
