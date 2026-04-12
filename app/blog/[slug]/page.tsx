import PostDetailsHydration from "@/components/postDetails/PostDetailsHydration";
import { getPostBySlug, getPosts } from "@/services/static/posts";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();

  if (!posts) return [];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || "اقرأ المزيد على مدونة Phoisac Eldali",
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
  };
}

export default async function Post({ params }: PageProps) {
  return <PostDetailsHydration params={params} />;
}
