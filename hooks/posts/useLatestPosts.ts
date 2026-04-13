import { getLatestPosts } from "@/services/client/posts";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "../auth/useCurrentUser";

export function useLatestPosts({ limit }: { limit: number }) {
  const { user } = useCurrentUser();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["posts", "latest", { limit }],
    queryFn: () => getLatestPosts({ limit, currentUserId: user.id }),
  });

  return { posts: data, isLoading, isError, refetch, isFetching };
}
