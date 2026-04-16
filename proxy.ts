// proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Initialize Response
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  // 2. Setup Supabase
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // 1. Get the Auth User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Define Protected Routes
  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (isProtectedRoute) {
    // If not even logged in, send to 404 (as you requested)
    if (!user) {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    // 3. Fetch the Profile to check the role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id) // Use "user_id" if that's your column name
      .single();

    // 4. Role Check: Redirect to 404 if they aren't an admin
    if (
      !profile ||
      !(profile.role === "admin" || profile.role === "developer")
    ) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  return response;
}

// Next.js 16+ expects the config to be exported from the proxy file
export const config = {
  matcher: [
    /*
     * Match all request paths except static assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
