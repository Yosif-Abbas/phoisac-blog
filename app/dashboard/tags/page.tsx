import TagsForm from "@/components/dashboard/tags/TagsForm";
import TagsHydration from "@/components/dashboard/tags/TagsHydration";
import TagsSkeleton from "@/components/skeleton/TagsSkeleton";
import { Suspense } from "react";

export default function Tags() {
  return (
    <div className="flex flex-col gap-y-10 h-full w-full animate-in fade-in duration-500">
      <div className="flex items-baseline gap-x-2 border-b border-card-hover pb-4">
        <h1 className="text-3xl font-bold text-foreground">
          لوحة تحكم المسؤول
        </h1>
        <span className="text-lg text-muted-foreground">/ الأوسمة</span>
      </div>

      <TagsForm />

      <Suspense fallback={<TagsSkeleton />}>
        <TagsHydration />
      </Suspense>
    </div>
  );
}
