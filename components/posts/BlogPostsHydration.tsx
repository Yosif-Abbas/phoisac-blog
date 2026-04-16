import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getServerPosts } from "@/services/server/posts";
import { getServerTags } from "@/services/server/tags";
import { getMediaLibrary } from "@/services/server/media";
import PostsList from "./PostsList";
import Search from "../ui/Search";
import Filter from "../ui/Filter";

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
    queryClient.prefetchQuery({
      queryKey: ["photos"],
      queryFn: getMediaLibrary,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className="flex flex-col gap-y-6">
        <Search />
        <Filter />
      </section>
      <PostsList />
    </HydrationBoundary>
  );
}
