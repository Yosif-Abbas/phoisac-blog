import PostEditTagsHydration from "@/components/dashboard/edit-post/eidt-post-page/PostEditTagsHydration";
import EditorSkeleton from "@/components/skeleton/EditorSkeleton";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPost({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div>
      <div className="flex items-baseline gap-x-2 border-b border-card-hover pb-4">
        <h1 className="text-3xl font-bold text-foreground">
          لوحة تحكم المسؤول
        </h1>
        <span className="text-lg text-muted-foreground">/ تعديل منشور</span>
        <span className="text-lg text-muted-foreground">/ {slug}</span>
      </div>
      <Suspense fallback={<EditorSkeleton />}>
        <PostEditTagsHydration />
      </Suspense>
    </div>
  );
}
