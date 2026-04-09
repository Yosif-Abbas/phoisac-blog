"use client";

import { usePages } from "@/hooks/pages/usePages";
import PageCard from "./PageCard";
import PageCardSkeleton from "@/components/skeleton/PageCardSkeleton";
import QueryErrorRetry from "@/components/ui/QueryErrorRetry";
import EmptyState from "@/components/ui/EmptyState";

export default function PagesList() {
  const { pages, isLoading, isError, isFetching, refetch } = usePages();

  if (isLoading)
    return (
      <div className="flex flex-col gap-y-4">
        {[1, 2, 3].map((i) => (
          <PageCardSkeleton key={i} />
        ))}
      </div>
    );

  if (isError)
    return <QueryErrorRetry query={{ isError, isFetching, refetch }} />;

  if (!pages || pages.length === 0) return <EmptyState />;

  return (
    <div>
      {pages && pages.map((page) => <PageCard key={page.title} page={page} />)}
    </div>
  );
}
