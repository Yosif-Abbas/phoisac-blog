import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // 'next' is where you want to send the user after login
  // (e.g., /blog or /dashboard)
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    // This is the "Magic" line. It exchanges the code from Google
    // for an actual session and saves it in your COOKIES.
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something goes wrong, send them to an error page
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
