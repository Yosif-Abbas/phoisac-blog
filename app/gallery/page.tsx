import { Suspense } from "react";

import MediaLibraryHydration from "@/components/media/MediaLibraryHydration";
import { Skeleton } from "@/components/skeleton/skeleton";

export default function Gallery() {
  return (
    <div className="flex flex-col gap-y-6 h-full w-full">
      <div className="flex items-baseline gap-x-2 border-b border-card-hover pb-4">
        <h1 className="text-3xl font-bold text-foreground">معرض الصور</h1>
      </div>

      <div className="flex items-baseline gap-x-2 border-b border-card-hover pb-4">
        <p className="text-muted-foreground">استكشف الصور المرفوعة.</p>
      </div>

      <Suspense
        fallback={
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-full aspect-[4/3]"
              />
            ))}
          </div>
        }
      >
        <MediaLibraryHydration />
      </Suspense>
    </div>
  );
}
