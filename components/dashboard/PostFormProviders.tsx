"use client";

import { useRouter } from "next/navigation";
import React, { useRef } from "react";

import toast from "react-hot-toast";

import { TagsProvider } from "./context/TagsContext";
import { useCreatePost } from "@/hooks/posts/useCreatePost";

import PostForm, { PostFormHandle } from "./PostForm";
import { useQueryClient } from "@tanstack/react-query";

export default function PostFormProviders() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createPost, isPending, uploadQueue } = useCreatePost();

  const formRef = useRef<PostFormHandle | null>(null);

  

  return (
    <TagsProvider>
      <PostForm
        ref={formRef}
        onSubmit={(data) => {
          // 2. Pass the callbacks directly to the mutate function!
          createPost(data, {
            onSuccess: (_, post) => {
              // Clear form inputs on success
              formRef.current?.reset?.();
              queryClient.invalidateQueries({ queryKey: ["posts"] });
              toast.success("تم نشر المقال بنجاح!");
              router.push(`/blog/${post.slug ? post.slug : ""}`);
              router.refresh();
            },
            onError: (error) => {
              console.error("Publishing error:", error);
              toast.error(error.message || "حدث خطأ أثناء النشر.");
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
