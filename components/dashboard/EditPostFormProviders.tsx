"use client";

import React, { useRef } from "react";
import { TagsProvider } from "./context/TagsContext";
import PostForm, { PostFormHandle } from "./PostForm";
import { useParams } from "next/navigation";
import { usePost } from "@/hooks/posts/usePost";
import { useUpdatePost } from "@/hooks/posts/useUpdatePost";
import QueryErrorRetry from "../ui/QueryErrorRetry";
import EditorFormSkeleton from "../skeleton/EditorFormSkeleton";

export default function EditPostFormProviders() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : undefined;

  const { updatePost, isPending } = useUpdatePost();
  const { post, isLoading, isError, isFetching, refetch } = usePost(
    slug as string,
  );

  const formRef = useRef<PostFormHandle | null>(null);

  if (isLoading) return <EditorFormSkeleton />;

  if (isError || !post)
    return <QueryErrorRetry query={{ isError, isFetching, refetch }} />;

  return (
    <TagsProvider>
      <PostForm
        ref={formRef}
        initialData={{
          title: post.title,
          content: post.content,
          tags: post.tags,
          excerpt: post.excerpt || "",
        }}
        onSubmit={(formData) => {
          updatePost(
            {
              id: post.id,
              slug: post.slug,
              title: formData.title,
              content: formData.content,
              excerpt: formData.excerpt,
              tags: formData.tags,
            },
            {
              onSuccess: () => {
                formRef.current?.reset?.();
              },
            },
          );
        }}
        isSubmitting={isPending}
        submitLabel="حفظ التعديلات"
      />
    </TagsProvider>
  );
}
