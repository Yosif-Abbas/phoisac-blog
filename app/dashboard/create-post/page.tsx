import CreatePostTagsHydration from "@/components/dashboard/create-post/CreatePostTagsHydration";
import EditorFormSkeleton from "@/components/skeleton/EditorFormSkeleton";
import { Suspense } from "react";

export default function CreatePost() {
  return (
    <div className="flex flex-col gap-y-6 h-full w-full">
      {/* Fixed alignment using items-baseline */}
      <div className="flex items-baseline gap-x-2 border-b border-card-hover pb-4">
        <h1 className="text-3xl font-bold text-foreground">
          لوحة تحكم المسؤول
        </h1>
        <span className="text-lg text-muted-foreground">/ كتابة منشور</span>
      </div>

      <Suspense fallback={<EditorFormSkeleton />}>
        <CreatePostTagsHydration />
      </Suspense>
    </div>
  );
}
