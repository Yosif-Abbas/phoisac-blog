import Hero from "@/components/ui/home/Hero";
import LatestPostsHydration from "@/components/ui/home/LatestPostsHydration";
import PostCardSkeleton from "@/components/ui/skeleton/PostCardSkeleton";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-12 md:py-24 gap-y-24">
      <Hero />

      <section className="flex flex-col gap-y-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-3xl font-bold">آخر المنشورات</h2>
          <Link href="/blog" className="text-sm text-muted  hover:underline">
            عرض الكل
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="flex flex-col">
              {[1, 2, 3].map((i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <LatestPostsHydration />
        </Suspense>
      </section>
    </div>
  );
}
