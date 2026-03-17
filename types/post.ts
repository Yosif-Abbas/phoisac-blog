export type Post = {
  content: PostContent;
  title: string;
  slug?: string;
  created_at?: Date;
  updated_at?: Date | null;
};

export type PostContent = {
  blocks: Block[];
};

export type Block = {
  data: BlockData;
  type?: "image" | "paragraph";
};

export type BlockData = {
  text?: string;
  url?: string;
  caption?: string;
};

const examplePost: Post = {
  title: "My First Post",
  slug: "my-first-post",
  content: {
    blocks: [
      {
        type: "paragraph",
        data: {
          text: "This is a paragraph in my post.",
        },
      },
      {
        type: "image",
        data: {
          url: "https://your-storage-url.com/image.jpg",
          caption: "An example image",
        },
      },
    ],
  },
};
