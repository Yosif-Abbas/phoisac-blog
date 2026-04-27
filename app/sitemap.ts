import { createClient } from "@/lib/supabase/server";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = "https://www.phoisac.online";

  // 1. Fetch all blog post slugs and timestamps from Supabase
  // We don't use pagination here because the sitemap needs EVERY link
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // 2. Map posts to the sitemap format
  const postEntries: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const { data: pages } = await supabase
    .from("pages")
    .select("page_name, updated_at, created_at");

  // 3. Map static pages to the sitemap format
  const pageEntries: MetadataRoute.Sitemap = (pages ?? []).map((page) => ({
    url: `${baseUrl}/${page.page_name}`,
    lastModified: new Date(page.updated_at || page.created_at),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...pageEntries,
    ...postEntries,
  ];
}
