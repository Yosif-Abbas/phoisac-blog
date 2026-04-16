import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getMediaLibrary } from "@/services/server/media";
import MediaLibrary from "./MediaLibrary";

export default async function MediaLibraryHydration() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["media"],
    queryFn: getMediaLibrary,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MediaLibrary />
    </HydrationBoundary>
  );
}

