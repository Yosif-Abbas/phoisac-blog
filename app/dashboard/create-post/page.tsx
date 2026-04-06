import CreatePostTagsHydration from "@/components/ui/dashboard/create-post/CreatePostTagsHydration";
import EditorSkeleton from "@/components/ui/skeleton/EditorSkeleton";
import { Suspense } from "react";

export default function CreatePost() {
  return (
    <div className="flex flex-col gap-y-6 h-full w-full">
      {/* Fixed alignment using items-baseline */}
      <div className="flex items-baseline gap-x-2 border-b border-[#1F2937] pb-4">
        <h1 className="text-3xl font-bold text-foreground">
          لوحة تحكم المسؤول
        </h1>
        <span className="text-lg text-muted-foreground">/ كتابة منشور</span>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <EditorSkeleton key={i} />
            ))}
          </div>
        }
      >
        <CreatePostTagsHydration />
      </Suspense>
    </div>
  );
}
