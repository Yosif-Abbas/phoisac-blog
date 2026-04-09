import { getPage } from "@/services/client/pages";
import { useQuery } from "@tanstack/react-query";

export function usePage({ page_name }: { page_name: string }) {
  const {
    data: page,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["page", page_name],
    queryFn: () => getPage({ page_name }),
    staleTime: 1000 * 60 * 5,
  });

  return { page, isLoading, isError, refetch, isFetching };
}
