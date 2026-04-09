import { Skeleton } from "@/components/skeleton/skeleton";

export default function PostCardEditSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex justify-between items-start">
        <div className=" w-full flex items-start ">
          <div className="space-y-3 w-full">
            <Skeleton className="h-8 w-7/12 bg-foreground/10" />
            <Skeleton className="h-5 w-24 bg-foreground/5" />
          </div>

          <Skeleton className="h-8 w-32 bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}
