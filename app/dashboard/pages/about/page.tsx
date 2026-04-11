import PageHydration from "@/components/dashboard/pages/about/PageHydration";
import EditorFormSkeleton from "@/components/skeleton/EditorFormSkeleton";
import { Suspense } from "react";

export default function About() {
  return (
    <div className="flex flex-col gap-y-10 h-full w-full pb-10">
      {/* 1. Header Section */}
      <div className="flex items-baseline justify-between border-b border-card-hover pb-6 ">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h1 className="text-3xl font-bold text-foreground text-nowrap">
            لوحة تحكم المسؤول
          </h1>
          <span className="text-lg text-muted-foreground text-nowrap">
            / الصفحات
          </span>
          <span className="text-lg text-muted-foreground text-nowrap">
            / فويزاك
          </span>
        </div>
      </div>

      <Suspense fallback={<EditorFormSkeleton />}>
        <PageHydration page_name="about" />
      </Suspense>
    </div>
  );
}
