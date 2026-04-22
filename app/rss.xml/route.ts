import { createClient } from "@/lib/supabase/server";

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
    <rss version="2.0" 
      xmlns:atom="http://www.w3.org/2005/Atom" 
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
    >
      <channel>
        <title>فويزاك الدالي</title>
        <link>${siteUrl}</link>
        <description>منصة رقمية مخصصة للأدب، الشعر، والقصص الطويلة.</description>
        <language>ar</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />

        ${posts
          ?.map((post) => {
            const imageUrl =
              post.cover_image_url || `${siteUrl}/default-cover.jpg`;

            return `
              <item>
                <title><![CDATA[${post.title}]]></title>
                <link>${siteUrl}/blog/${post.slug}</link>
                <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
                <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
                <description><![CDATA[${post.excerpt || ""}]]></description>

                <content:encoded><![CDATA[
                  <div style="margin-bottom: 20px;">
                    <img src="${imageUrl}" alt="${post.title}" />
                  </div>
                  <p>${post.excerpt || ""}</p>
                ]]></content:encoded>
              </item>
            `;
          })
          .join("")}
      </channel>
    </rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
