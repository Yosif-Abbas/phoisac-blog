import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.phoisac.online";

  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, excerpt, created_at, cover_image_url")
    .eq("status", "test")
    .order("created_at", { ascending: false });

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>The Novelist's Blog</title>
        <link>${siteUrl}</link>
        <description>Thoughts on writing, poetry, and philosophy.</description>
        <language>ar</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
        ${posts
          ?.map((post) => {
            const imageUrl =
              post.cover_image_url || `${siteUrl}/default-social-card.jpg`; // Always have a fallback!

            // 2. Format the description to include the image for older readers
            const descriptionWithImage = `
              <img src="${imageUrl}" alt="Cover image for ${post.title}" />
              <p>${post.excerpt || ""}</p>
            `;

            return `
              <item>
                <title><![CDATA[${post.title}]]></title>
                <link>${siteUrl}/blog/${post.slug}</link>
                <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
                <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
                <enclosure url="${imageUrl}" length="0" type="image/webp" />
                <description><![CDATA[${descriptionWithImage}]]></description>
              </item>
            `;
          })
          .join("")}
      </channel>
    </rss>`;

  return new NextResponse(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
