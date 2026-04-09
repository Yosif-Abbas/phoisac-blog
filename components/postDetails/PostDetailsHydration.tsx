  import {
    QueryClient,
    dehydrate,
    HydrationBoundary,
  } from "@tanstack/react-query";
  import { notFound } from "next/navigation";
  import PostDetails from "./PostDetails";
  import { getServerPostBySlug } from "@/services/server/posts";

  interface Props {
    params: Promise<{ slug: string }>;
  }

  export default async function PostDetailsHydration({ params }: Props) {
    const { slug } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
      queryKey: ["post", slug],
      queryFn: () => getServerPostBySlug(slug),
    });

    const post = queryClient.getQueryData(["post", slug]);

    if (!post) {
      notFound();
    }

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="w-full max-w-4xl mx-auto h-full">
          <PostDetails slug={slug} />
        </div>
      </HydrationBoundary>
    );
  }
