// Internal Server Component to handle the fetch
import PostList from "@/components/ui/posts/PostsList";
import { getServerPosts } from "@/services/server/posts";
import { getServerTags } from "@/services/server/tags";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function BlogPostsHydration() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 0 }) => getServerPosts({ pageParam }),
      initialPageParam: 0,
    }),

    queryClient.prefetchQuery({
      queryKey: ["tags"],
      queryFn: getServerTags,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList />
    </HydrationBoundary>
  );
}
