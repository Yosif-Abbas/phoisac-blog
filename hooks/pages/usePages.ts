import { getPages } from "@/services/client/pages";

import { useQuery } from "@tanstack/react-query";

export function usePages() {
  const {
    data: pages,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => await getPages(),
  });

  return { pages, isLoading, isError, isFetching, refetch };
}
