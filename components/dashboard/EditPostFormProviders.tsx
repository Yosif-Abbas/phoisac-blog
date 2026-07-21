"use client";

import React, { useRef } from "react";
import { TagsProvider } from "./context/TagsContext";
import PostForm, { PostFormHandle } from "./PostForm";
import { useParams, useRouter } from "next/navigation";
import { usePost } from "@/hooks/posts/usePost";
import { useUpdatePost } from "@/hooks/posts/useUpdatePost";
import QueryErrorRetry from "../ui/QueryErrorRetry";
import EditorFormSkeleton from "../skeleton/EditorFormSkeleton";

export default function EditPostFormProviders() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : undefined;

  const { updatePost, isPending, uploadQueue } = useUpdatePost();
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
          slug: post.slug,
          cover_image_url: post.cover_image_url,
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
              cover_image_url: formData.cover_image_url,
              cover_image_file: formData.cover_image_file,
            },
            {
              onSuccess: () => {
                formRef.current?.reset?.();
                router.push(`/blog/${post.slug ? post.slug : ""}`);
                router.refresh();
              },
            },
          );
        }}
        uploadQueue={uploadQueue}
        isSubmitting={isPending}
        submitLabel="حفظ التعديلات"
      />
    </TagsProvider>
  );
}
