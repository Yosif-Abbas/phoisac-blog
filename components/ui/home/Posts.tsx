import { createClient } from "@/lib/supabase/server";
import PostContent from "./PostContent";

async function getPosts() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase.from("posts").select("*");

  if (error || !posts) {
    console.log(error.message);
  }

  return posts;
}

export default async function Posts() {
  const posts = await getPosts();
  console.log(posts);
  return (
    <ul className="flex flex-col gap-y-2">
      {posts &&
        posts.map((post) => (
          <li key={post.slug} className="border">
            <h1>{post.title}</h1>
            <p className="text-xs font-light">{post.created_at}</p>
            <PostContent content={post.content} />
          </li>
        ))}
    </ul>
  );
}
