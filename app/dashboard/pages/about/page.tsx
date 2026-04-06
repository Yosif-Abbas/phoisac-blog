import PageHydration from "@/components/ui/dashboard/pages/about/PageHydration";
import PostCardSkeleton from "@/components/ui/skeleton/PostCardSkeleton";
import { Suspense } from "react";

export default function About() {
  return (
    <div className="flex flex-col gap-y-10 h-full w-full pb-10">
      {/* 1. Header Section */}
      <div className="flex items-baseline justify-between border-b border-[#1F2937] pb-6">
        <div className="flex items-baseline gap-x-2">
          <h1 className="text-3xl font-bold text-foreground">
            لوحة تحكم المسؤول
          </h1>
          <span className="text-lg text-muted-foreground">/ الصفحات</span>
          <span className="text-lg text-muted-foreground">/ فويزاك</span>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <PageHydration page_name="about" />
      </Suspense>
    </div>
  );
}
