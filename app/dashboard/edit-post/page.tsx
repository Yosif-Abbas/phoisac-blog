import PostsEditHydration from "@/components/ui/dashboard/edit-post/PostsEditHydration";
import Filter from "@/components/ui/Filter";
import Search from "@/components/ui/Search";
import PostCardSkeleton from "@/components/ui/skeleton/PostCardSkeleton";
import { Suspense } from "react";

export default function Edit() {
  return (
    <div className="flex flex-col gap-y-8 h-full w-full max-w-5xl mx-auto ">
      <div className="flex items-baseline gap-x-2 border-b border-[#1F2937] pb-4">
        <h1 className="text-3xl font-bold text-foreground">
          لوحة تحكم المسؤول
        </h1>
        <span className="text-lg text-muted-foreground">/ تعديل منشور</span>
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
            {[1, 2, 3].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <PostsEditHydration />
      </Suspense>
    </div>
  );
}
