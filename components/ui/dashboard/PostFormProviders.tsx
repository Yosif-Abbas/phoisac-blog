"use client";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { TagsProvider } from "./context/TagsContext";
import { useCreatePost } from "@/hooks/posts/useCreatePost";

import PostForm from "./PostForm";
import { useQueryClient } from "@tanstack/react-query";

export default function PostFormProviders() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createPost, isPending, uploadQueue } = useCreatePost();

  return (
    <TagsProvider>
      <PostForm
        onSubmit={(data) => {
          // 2. Pass the callbacks directly to the mutate function!
          createPost(data, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["posts"] });
              toast.success("تم نشر المقال بنجاح!");
              router.push("/dashboard");
              router.refresh();
            },
            onError: (error) => {
              console.error("Publishing error:", error);
              toast.error("حدث خطأ أثناء النشر.");
            },
          });
        }}
        uploadQueue={uploadQueue}
        isSubmitting={isPending}
        submitLabel="نشر المقال"
      />
    </TagsProvider>
  );
}
