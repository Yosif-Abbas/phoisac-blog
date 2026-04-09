"use client";

import { Search } from "lucide-react";
import { Skeleton } from "../skeleton";

export default function SearchInputSkeleton() {
  return (
    <div className="relative group">
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full z-10" />
      <Skeleton className="w-full h-[56px] rounded-2xl bg-foreground/10" />
    </div>
  );
}
