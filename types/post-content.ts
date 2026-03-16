export type PostType = {
  content: PostContentType;
  title: string;
  slug: string;
};

export type PostContentType = {
  content: BlocksType;
};

export type BlocksType = {
  blocks: BlockType[];
};

export type BlockType = {
  data: BlockDataType;
  type?: "image" | "paragraph";
};

export type BlockDataType = {
  text?: string;
  url?: string;
  caption?: string;
};
