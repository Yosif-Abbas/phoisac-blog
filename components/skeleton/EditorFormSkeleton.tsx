import EditorSkeleton from "./EditorSkeleton";
import { Skeleton } from "./skeleton";

export default function EditorFormSkeleton() {
  return (
    <div>
      <div className="pb-4 border-b border-b-card-hover flex items-start">
        <Skeleton className="h-12 w-32 bg-foreground/10 rounded-lg" />
      </div>
      <EditorSkeleton />
    </div>
  );
}
