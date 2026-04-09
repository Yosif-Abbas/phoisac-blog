import PagesHydration from "@/components/dashboard/pages/PagesHydration";
import PageCardSkeleton from "@/components/skeleton/PageCardSkeleton";
import { Suspense } from "react";

export default function page() {
  return (
    <div className="flex flex-col gap-y-10 h-full w-full pb-10">
      {/* 1. Header Section */}
      <div className="flex items-baseline justify-between border-b border-card-hover pb-6">
        <div className="flex items-baseline gap-x-2">
          <h1 className="text-3xl font-bold text-foreground">
            لوحة تحكم المسؤول
          </h1>
          <span className="text-lg text-muted-foreground">/ الصفحات</span>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col gap-y-4">
            {[1, 2, 3].map((i) => (
              <PageCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <PagesHydration />
      </Suspense>
    </div>
  );
}
