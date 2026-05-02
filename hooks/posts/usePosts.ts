import { useInfiniteQuery } from "@tanstack/react-query";

import { getPosts } from "@/services/client/posts";
import { useSearchParams } from "next/navigation";

export function usePosts() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("s") || "";
  const tags = searchParams.getAll("tag").sort();

  return useInfiniteQuery({
    queryKey: ["posts", searchTerm, tags],
    queryFn: ({ pageParam = 0 }) =>
      getPosts({ pageParam, searchTerm, tags } as {
        pageParam: number;
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5,
  });
}
