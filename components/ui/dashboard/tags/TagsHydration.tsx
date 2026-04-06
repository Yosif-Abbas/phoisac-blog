import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerTags } from "@/services/server/tags";
import TagsList from "./TagsList";

export default async function TagsHydration() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tags"],
    queryFn: getServerTags,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagsList />
    </HydrationBoundary>
  );
}
