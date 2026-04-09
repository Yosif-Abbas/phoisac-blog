import { getPostBySlug } from "@/services/client/posts";
import { useQuery } from "@tanstack/react-query";

export function usePost(slug: string) {
  const {
    data: post,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    staleTime: 1000 * 60 * 5,
  });

  return { post, isLoading, isError, isFetching, refetch };
}
