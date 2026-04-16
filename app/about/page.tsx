import StructuredContentSkeleton from "@/components/skeleton/StructuredContentSkeleton";
import PageContentHydration from "@/components/ui/PageContentHydration";
import { Suspense } from "react";

export default function About() {
  return (
    <div className="flex flex-col gap-y-6 h-full w-full pb-10">
      <div className="flex items-baseline justify-between border-b border-card-hover pb-4">
        <div className="flex items-baseline gap-x-2">
          <h1 className="text-3xl font-bold text-foreground">عن فويزاك</h1>
        </div>
      </div>

      <Suspense fallback={<StructuredContentSkeleton />}>
        <PageContentHydration page_name="about" />
      </Suspense>
    </div>
  );
}
