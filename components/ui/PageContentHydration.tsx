import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PageContent from "./PageContent";
import { getServerPage } from "@/services/server/pages";

export default async function PageContentHydration({
  page_name,
}: {
  page_name: string;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["page", page_name],
    queryFn: () => getServerPage({ page_name }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageContent page_name={page_name} />
    </HydrationBoundary>
  );
}
