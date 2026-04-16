import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

// 1. Update the type to wrap params in a Promise
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  // 2. Await the params before destructuring
  const { slug } = await params;

  const supabase = await createClient();

  // 1. Get IP and User Agent
  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
  const ua = req.headers.get("user-agent") || "unknown";

  // 2. Hash the IP+UA
  const viewerHash = createHash("sha256").update(`${ip}-${ua}`).digest("hex");

  // 3. Call the strict RPC
  const { error } = await supabase.rpc("increment_post_view_strict", {
    p_post_slug: slug,
    p_viewer_hash: viewerHash,
  });

  if (error) {
    console.error("View increment error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
