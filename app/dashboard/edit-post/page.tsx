import { Suspense } from "react";

import PostsEditHydration from "@/components/dashboard/edit-post/PostsEditHydration";
import Filter from "@/components/ui/Filter";
import Search from "@/components/ui/Search";
import PostCardEditSkeleton from "@/components/skeleton/PostCardEditSkeleton";

export default function Edit() {
  return (
    <div className="flex flex-col gap-y-8 h-full w-full max-w-5xl mx-auto ">
      <div className="flex items-baseline gap-2 border-b border-card-hover pb-4 flex-wrap">
        <h1 className="text-3xl font-bold text-foreground text-nowrap">
          لوحة تحكم المسؤول
        </h1>
        <span className="text-lg text-muted-foreground text-nowrap">
          / تعديل منشور
        </span>
      </div>

      {/* 2. Search & Filter Bar */}
      <section className="flex flex-col gap-y-6">
        <Search />

        <Filter />
      </section>

      {/* 3. The Post List */}

      <Suspense
        fallback={
          <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((i) => (
              <PostCardEditSkeleton key={i} />
            ))}
          </div>
        }
      >
        <PostsEditHydration />
      </Suspense>
    </div>
  );
}
