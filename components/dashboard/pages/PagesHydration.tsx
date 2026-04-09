import { getServerPages } from "@/services/server/pages";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PagesList from "./PagesList";

export default async function PagesHydration() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["pages"],
    queryFn: getServerPages,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PagesList />
    </HydrationBoundary>
  );
}
