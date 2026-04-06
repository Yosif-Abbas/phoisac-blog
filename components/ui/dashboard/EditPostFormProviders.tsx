"use client";

import { TagsProvider } from "./context/TagsContext";
import PostForm from "./PostForm";
import { useParams } from "next/navigation";
import { usePost } from "@/hooks/posts/usePost";
import { useUpdatePost } from "@/hooks/posts/useUpdatePost";

export default function EditPostFormProviders() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : undefined;

  const { updatePost, isPending } = useUpdatePost();
  const { post, isLoading } = usePost(slug);

  if (isLoading) return <div>جاري تحميل المقال...</div>;

  if (!post) return <div>لم يتم العثور على المقال.</div>;

  return (
    <TagsProvider>
      <PostForm
        initialData={{
          title: post.title,
          content: post.content,
          tags: post.tags,
          excerpt: post.excerpt || "",
        }}
        onSubmit={(formData) => {
          updatePost({
            postId: post.id,
            slug: post.slug,
            title: formData.title, // This comes from the form state
            content: formData.content, // This comes from the form state
            excerpt: formData.excerpt,
            tags: formData.tags, // This comes from the form state
          });
        }}
        isSubmitting={isPending}
        submitLabel="حفظ التعديلات"
      />
    </TagsProvider>
  );
}
