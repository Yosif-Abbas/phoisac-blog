import { getServerPage } from "@/services/server/pages";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import PageForm from "../PageForm";

export default async function PageHydration({
  page_name,
}: {
  page_name: string;
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["pages", page_name],
    queryFn: () => getServerPage({ page_name }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageForm page_name={page_name} />
    </HydrationBoundary>
  );
}
