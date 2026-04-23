import { getSiteSettings } from "@/services/client/settings";
import { useQuery } from "@tanstack/react-query";

export function useSettings() {
  const {
    data: settings,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 1000 * 60 * 5,
  });

  return { settings, isLoading, isError, isFetching, refetch };
}
