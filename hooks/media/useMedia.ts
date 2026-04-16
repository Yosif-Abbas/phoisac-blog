import { getMediaLibrary } from "@/services/client/media";
import { useQuery } from "@tanstack/react-query";

export function useMedia() {
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: () => getMediaLibrary(),
    staleTime: 1000 * 60 * 5,
  });

  return { mediaItems, isLoading };
}
