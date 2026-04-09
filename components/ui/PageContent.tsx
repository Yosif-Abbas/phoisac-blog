"use client";

import StructuredContentSkeleton from "../skeleton/StructuredContentSkeleton";
import StructuredContent from "../postDetails/StructuredContent";
import QueryErrorRetry from "./QueryErrorRetry";
import { usePage } from "@/hooks/pages/usePage";

export default function PageContent({ page_name }: { page_name: string }) {
  const { page, isLoading, isError, refetch, isFetching } = usePage({
    page_name,
  });

  if (isLoading) return <StructuredContentSkeleton />;
  if (isError)
    return <QueryErrorRetry query={{ isError, refetch, isFetching }} />;

  if (!page) return null;

  return (
    <div>
      <StructuredContent blocks={page.content.blocks} />
    </div>
  );
}
