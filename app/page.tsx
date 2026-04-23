import Hero from "@/components/home/Hero";
import LatestPostsHydration from "@/components/home/LatestPostsHydration";
import PostCardSkeleton from "@/components/skeleton/PostCardSkeleton";
import { getSiteSettings } from "@/services/server/settings";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-12 md:py-24 gap-y-24">
      <Hero settings={settings} />

      <section className="flex flex-col gap-y-12">
        <div className="flex items-baseline justify-between ">
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
