import { getServerTags } from "@/services/server/tags";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PostFormProviders from "../PostFormProviders";

export default async function CreatePostTagsHydration() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["tags"],
    queryFn: getServerTags,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostFormProviders />
    </HydrationBoundary>
  );
}
