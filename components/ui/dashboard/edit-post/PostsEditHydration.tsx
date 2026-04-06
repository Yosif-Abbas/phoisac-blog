import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getServerPosts } from "@/services/server/posts";
import { getServerTags } from "@/services/server/tags";

import PostListEdit from "./PostListEdit";

export default async function PostsEditHydration() {
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
      <PostListEdit />
    </HydrationBoundary>
  );
}
