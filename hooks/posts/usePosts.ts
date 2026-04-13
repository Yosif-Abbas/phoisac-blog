import { useInfiniteQuery } from "@tanstack/react-query";

import { getPosts } from "@/services/client/posts";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "../auth/useCurrentUser";

export function usePosts() {
  const { user } = useCurrentUser();

  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const tags = searchParams.getAll("tag").sort();

  console.log(user);

  return useInfiniteQuery({
    queryKey: ["posts", searchTerm, tags],
    queryFn: ({ pageParam = 0 }) =>
      getPosts({ pageParam, searchTerm, tags, currentUserId: user?.id } as {
        pageParam: number;
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5,
  });
}
