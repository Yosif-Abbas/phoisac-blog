import { getLatestPosts } from "@/services/server/posts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import LatestPosts from "./LatestPosts";

const limit = Number(process.env.NEXT_PUBLIC_LATEST_POSTS_LIMIT) || 2;

export default async function LatestPostsHydration() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts", "latest", { limit }],
    queryFn: () => getLatestPosts({ limit }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LatestPosts />
    </HydrationBoundary>
  );
}
