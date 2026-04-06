"use client";

import { useQuery } from "@tanstack/react-query";
import PostContent from "./postDetails/PostContent";
import { getPage } from "@/services/client/pages";

export default function PageContent({ page_name }: { page_name: string }) {
  const { data: page, isLoading } = useQuery({
    queryKey: ["pages", page_name],
    queryFn: () => getPage({ page_name }),
  });

  if (isLoading) return null;

  return (
    <div>
      <PostContent blocks={page.content.blocks} />
    </div>
  );
}
