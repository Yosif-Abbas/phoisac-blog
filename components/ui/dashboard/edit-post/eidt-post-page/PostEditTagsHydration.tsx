import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getServerTags } from "@/services/server/tags";
import EditPostFormProviders from "../../EditPostFormProviders";

export default async function PostEditTagsHydration() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tags"],
    queryFn: getServerTags,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditPostFormProviders />
    </HydrationBoundary>
  );
}
