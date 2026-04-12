import PostDetailsHydration from "@/components/postDetails/PostDetailsHydration";
import { getPostBySlug, getPosts } from "@/services/static/posts";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getPosts();

    // If we have posts, map them normally
    if (posts && posts.length > 0) {
      return posts.map((post) => ({
        slug: post.slug,
      }));
    }

    return [{ slug: "placeholder-to-fix-build" }];
  } catch (error) {
    console.error("Build-time fetch error:", error);
    return [{ slug: "placeholder-to-fix-build" }];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  const supabaseUrl = post.cover_image_url;

  const encodedSupabaseUrl = encodeURIComponent(supabaseUrl);
  const thumbnailCard = `https://wsrv.nl/?url=${encodedSupabaseUrl}&w=300&h=300&fit=cover&a=center`;

  return {
    title: post.title,
    description: post.excerpt || "اقرأ المزيد على مدونة Phoisac Eldali",
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,

      images: [
        {
          url: thumbnailCard, // This will be a perfect 300x300 square
          width: 300,
          height: 300,
        },
        {
          url: "/logo.jpg",
          width: 300,
          height: 300,
        },
      ],
    },

    twitter: {
      card: "summary",
      title: post.title,
      images: ["/logo.jpg"],
    },
  };
}

export default async function Post({ params }: PageProps) {
  return <PostDetailsHydration params={params} />;
}
