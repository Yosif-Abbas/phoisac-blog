"use client";

import { useRef, useState } from "react";
import { OutputData } from "@editorjs/editorjs";

import Editor, { EditorHandle } from "@/components/ui/dashboard/Editor";
import { useCreatePost } from "@/hooks/posts/useCreatePost";

export default function PostForm() {
  const editorRef = useRef<EditorHandle>(null);
  const [editorData, setEditorData] = useState<OutputData | undefined>();
  const [title, setTitle] = useState("");

  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevents page reload
    e.preventDefault();

    if (!editorData) return;

    const postPayload = { title, content: editorData };
    console.log(postPayload);

    createPost(postPayload);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان المنشور"
          className=""
        />
        <Editor
          ref={editorRef}
          onChange={setEditorData}
          placeholder="اكتب اكتب..."
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={isPending}
        >
          نشر المنشور
        </button>
      </form>
    </div>
  );
}

// const handleSubmit = async () => {
//   setSubmitting(true);
//   const data = (await editorRef.current?.save()) ??
//     editorData ?? { blocks: [] };

//   console.log(data);

//   try {
//     const supabase = createClient();

//     // insert the editor data into the posts table
//     const { error } = await supabase
//       .from("posts")
//       .insert([
//         { title: "this is good211", slug: "this-is-good211", content: data },
//       ]);
//     if (error) {
//       throw error;
//     }
//     alert("Post submitted successfully");
//   } catch (err) {
//     console.error(err);
//     alert("Error submitting post");
//   } finally {
//     setSubmitting(false);
//   }
// };

/////////////////////////////////////////////

// const fileName = `${Date.now()}-${file.name}`;

// const supabase = createClient();

// const { data, error } = await supabase.storage
//   .from("post-images")
//   .upload(fileName, )file;

// if (error) {
//   console.log("UPLOAD ERROR:", error);
//   return { success: 0 };
// }

// const { data: publicUrl } = supabase.storage
//   .from("post-images")
//   .getPublicUrl(fileName);

// return {
//   success: 1,
//   file: {
//     url: publicUrl.publicUrl,
//   },
// };
