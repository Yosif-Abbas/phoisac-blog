import type { OutputData, OutputBlockData } from "@editorjs/editorjs";

export type UUID = string;

export interface Profile {
  id: UUID;
  user_name: string;
  email: string;
  role?: string | null;
  avatar_url?: string | null;
}

export interface Media {
  id: UUID;
  file_path: string;
  public_url: string;
  uploader_id: UUID;
  created_at?: string | Date | null;
}

export type MediaRef = Pick<Media, "id" | "public_url" | "file_path">;

export interface Tag {
  id: UUID;
  name: string;
  count?: number;
}

export interface PostTag {
  id: UUID;
  post_id: UUID;
  tag_id: UUID;
  tags?: Tag[];
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  previewUrl?: string;
}

// Convenience type used by legacy components: a serializable picture payload
export type MediaFile = {
  file?: UploadedFile;
  url?: string;
  caption?: string;
  mediaId?: UUID;
};

export type Column = {
  ajuuz?: string;
  sadr?: string;
};

// Use Editor.js OutputBlockData to ensure compatibility with Editor's OutputData
export type ParagraphBlock = OutputBlockData<"paragraph", { text: string }>;
export type QuoteBlock = OutputBlockData<
  "quote",
  { text: string; caption?: string }
>;

export type ImageBlock = OutputBlockData<
  "image",
  {
    // Prefer server-side media reference when available
    media?: MediaRef;
    // Local upload representation (serializable)
    upload?: UploadedFile;
    // Direct URL (fallback)
    url?: string;
    caption?: string;
    // Added to match the standard Editor.js output from your JSON
    file?: { url: string };
  }
>;

export type HeaderBlock = OutputBlockData<
  "header",
  { text: string; level: number }
>;

export type PoemBlock = OutputBlockData<
  "poem",
  { cols: Column[]; caption?: string; style?: string }
>;

export type UnknownBlock = OutputBlockData<string, Record<string, unknown>>;

export type Block =
  | HeaderBlock // <-- Added here
  | ParagraphBlock
  | QuoteBlock
  | ImageBlock
  | PoemBlock
  | UnknownBlock;

export type StructuredContent = OutputData & { blocks: Block[] };

export interface Post {
  id: UUID;
  title: string;
  slug: string;
  content: StructuredContent;
  author_id: UUID;
  cover_image_url?: string | null;
  created_at?: string | Date;
  updated_at?: string | Date | null;
  excerpt?: string;
  status?: "draft" | "published" | "archived" | "test" | "deleted";
  view_count?: number;
  tags?: Tag[];
  post_tags?: PostTag[];
  deleted_at?: string | Date | null;
}

// Export DB-row shaped types for server code that expects column names
export type PostRow = Post;
export type ProfileRow = Profile;

export default {} as unknown;
