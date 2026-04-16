import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";
import PostDetails from "./PostDetails";
import { getServerPostBySlug } from "@/services/server/posts";
import { getServerUser } from "@/services/server/auth";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailsHydration({ params }: Props) {
  const user = await getServerUser();
  const { slug } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", slug],
    queryFn: () => getServerPostBySlug(slug),
  });

  const post = queryClient.getQueryData(["post", slug]);

  if (!post || (post.status === "test" && user?.role !== "developer")) {
    notFound();
  }

  if (post.deleted_at !== null || post.status === "deleted") {
    const isAdmin = user?.role === "admin";
    const isDeveloper = user?.role === "developer";

    if (!(isAdmin || isDeveloper)) {
      notFound();
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full max-w-4xl mx-auto h-full">
        <PostDetails slug={slug} />
      </div>
    </HydrationBoundary>
  );
}
