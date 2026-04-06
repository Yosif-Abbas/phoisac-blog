import { getPostBySlug } from "@/services/client/posts";
import { useQuery } from "@tanstack/react-query";

export function usePost(slug: string) {
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
  });

  return { post, isLoading };
}
