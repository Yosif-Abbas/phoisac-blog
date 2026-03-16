"use client";

import { useRef, useState } from "react";
import { OutputData } from "@editorjs/editorjs";

import Editor, { EditorHandle } from "@/components/ui/dashboard/Editor";

export default function PostForm() {
  const editorRef = useRef<EditorHandle>(null);
  const [editorData, setEditorData] = useState<OutputData | undefined>();

  return (
    <div>
      <form action="">
        <input type="text" placeholder="عنوان المنشور" className="" />
        <Editor ref={editorRef} onChange={setEditorData} />
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          Submit post
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
