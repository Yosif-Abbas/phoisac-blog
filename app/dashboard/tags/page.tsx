import TagsForm from "@/components/ui/dashboard/tags/TagsForm";
import TagsHydration from "@/components/ui/dashboard/tags/TagsHydration";
import TagsSkeleton from "@/components/ui/skeleton/TagsSkeleton";
import { Suspense } from "react";

export default function Tags() {
  return (
    <div className="flex flex-col gap-y-10 h-full w-full animate-in fade-in duration-500">
      <div className="flex items-baseline gap-x-2 border-b border-[#1F2937] pb-4">
        <h1 className="text-3xl font-bold text-foreground">
          لوحة تحكم المسؤول
        </h1>
        <span className="text-lg text-muted-foreground">/ الأوسمة</span>
      </div>

      <TagsForm />

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <TagsSkeleton key={i} />
            ))}
          </div>
        }
      >
        <TagsHydration />
      </Suspense>
    </div>
  );
}
