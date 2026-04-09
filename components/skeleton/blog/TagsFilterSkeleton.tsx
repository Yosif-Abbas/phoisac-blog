"use client";

import { Skeleton } from "../skeleton";

export default function TagsFilterSkeleton() {
  return (
    <div className="flex items-center flex-wrap gap-x-3 gap-y-2 pb-2">
      {/* Tag pills */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="inline-flex items-center  rounded-full min-w-16 border border-transparent"
        >
          <Skeleton className="h-6 rounded-full w-14 bg-foreground/10" />
        </div>
      ))}

      {/* Toggle button (كل الوسوم / إغلاق) */}
      <div className="flex items-center  rounded-full border border-transparent">
        <Skeleton className="h-7 rounded-full w-20 bg-foreground/10" />
      </div>
    </div>
  );
}
