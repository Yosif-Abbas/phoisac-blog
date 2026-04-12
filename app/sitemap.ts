import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = "https://phoisac.online";

  // 1. Fetch all blog post slugs and timestamps from Supabase
  // We don't use pagination here because the sitemap needs EVERY link
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, created_at")
    .order("created_at", { ascending: false });

  // 2. Map posts to the sitemap format
  const postEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: "weekly",
    priority: 0.7, // Blog posts are important
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1, // Homepage is the most important
    },

    ...postEntries,
  ];
}
