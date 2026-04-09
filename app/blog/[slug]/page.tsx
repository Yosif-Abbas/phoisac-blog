import PostDetailsHydration from "@/components/postDetails/PostDetailsHydration";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Post({ params }: PageProps) {
  return <PostDetailsHydration params={params} />;
}
