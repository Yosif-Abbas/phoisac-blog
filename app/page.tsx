import Posts from "@/components/ui/home/Posts";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Suspense>
        <Posts />
      </Suspense>
    </div>
  );
}
