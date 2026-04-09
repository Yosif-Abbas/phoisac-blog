import { useQuery } from "@tanstack/react-query";

import { getTags } from "@/services/client/tags";

export function useTags() {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    staleTime: 1000 * 60 * 60,
  });

  return {
    tags: data?.data,
    count: data?.count,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
