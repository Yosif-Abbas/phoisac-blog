import PostDetails from "@/components/ui/postDetails/PostDetails";
import { getServerPostBySlug } from "@/services/server/posts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Post({ params }: Props) {
  const { slug } = await params;
  const queryClient = new QueryClient();

  // Prefetch the specific post
  await queryClient.prefetchQuery({
    queryKey: ["post", slug],
    queryFn: () => getServerPostBySlug(slug),
  });

  const post = queryClient.getQueryData(["post", slug]);

  // If the post doesn't exist, trigger the 404 page immediately
  if (!post) {
    notFound();
  }

  console.log(post);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full max-w-4xl mx-auto ">
        <PostDetails slug={slug} />
      </div>
    </HydrationBoundary>
  );
}
