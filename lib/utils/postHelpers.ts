import { OutputData } from "@editorjs/editorjs";

export const getPostStats = (editorData?: OutputData) => {
  if (!editorData || !editorData.blocks) return { words: 0, time: 0 };

  let text = "";
  editorData.blocks.forEach((block) => {
    if (block.type === "paragraph" || block.type === "header") {
      text += (block.data.text || "").replace(/<[^>]*>?/gm, "") + " ";
    }
  });

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return { words, time: Math.ceil(words / 125) };
};

export const getExcerptFromEditor = (content?: OutputData) => {
  if (!content?.blocks || content.blocks.length === 0) return "";

  for (const block of content.blocks) {
    let text = block.data?.text;
    if (block.type === "poem") {
      const sadr = block.data?.cols[0].sadr;
      const ajuuz = block.data?.cols[0].ajuuz;
      text = `${sadr} ${ajuuz ? "✦ " + ajuuz : ""}`;
    }

    if (!text) continue;

    const plainText = text
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (plainText) {
      return plainText.length > 120
        ? plainText.slice(0, 120).trim() + "..."
        : plainText;
    }
  }
  return "";
};

export const getUploadStats = (
  blocks?: Array<{ type?: string; data?: { file?: { localFile?: File } } }>,
) => {
  if (!blocks) return { images: [], totalMB: "0" };

  const images = blocks
    .filter((b) => b.type === "image" && b.data?.file?.localFile)
    .map((b) => b.data!.file!.localFile as File);

  const totalBytes = images.reduce((acc, file) => acc + file.size, 0);
  return { images, totalMB: (totalBytes / (1024 * 1024)).toFixed(2) };
};

export const getEditorImages = (blocks?: Array<any>) => {
  if (!blocks) return [];
  return blocks
    .filter((b) => b.type === "image" && (b.data?.file?.url || b.data?.url))
    .map((b) => (b.data?.file?.url || b.data?.url) as string);
};
