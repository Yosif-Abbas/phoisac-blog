"use client";

import { usePages } from "@/hooks/pages/usePages";
import PageCard from "./PageCard";

export default function PagesList() {
  const { pages } = usePages();

  return (
    <div>
      {pages && pages.map((page) => <PageCard key={page.title} page={page} />)}
    </div>
  );
}
