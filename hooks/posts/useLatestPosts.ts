import { getLatestPosts } from "@/services/client/posts";
import { useQuery } from "@tanstack/react-query";

export function useLatestPosts({ limit }: { limit: number }) {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["posts", "latest", { limit }],
    queryFn: () => getLatestPosts({ limit }),
  });

  return { posts: data, isLoading, isError, refetch, isFetching };
}
