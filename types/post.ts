export type Post = {
  id?: number;
  content: PostContent;
  title: string;
  slug?: string;
  created_at?: Date;
  updated_at?: Date | null;
  tags?: Tag[];
  excerpt?: string;
  auther_id?: number;
  status?: "draft" | "published" | "archived";
  cover_image_url?: string;
};

export type Tag = {
  count?: number;
  id?: number;
  name: string;
};

export type PostContent = {
  blocks: Block[];
};

export type Block = {
  data: BlockData;
  type?: "image" | "paragraph" | "quote" | "poem";
};

export type BlockData = {
  text?: string;
  file?: File;
  caption?: string;
  style?: string;
  cols?: Column[];
};

export type Column = {
  ajuuz?: string;
  sadr?: string;
};

export type File = {
  lastModified?: number;
  name?: string;
  size?: 600023;
  url?: string;
  localFile: File;
};
