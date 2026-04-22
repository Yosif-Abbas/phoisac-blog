import { Block, Column, ImageBlock, PoemBlock } from "@/types/cms";

export function renderBlocksToHtml(blocks: Block[]) {
  if (!blocks) return "";

  return blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;

        case "paragraph":
          return `<p>${block.data.text}</p>`;

        case "quote":
          return `<blockquote style="border-right: 4px solid #ddd; padding-right: 15px; margin: 20px 0; color: #555;">
                    <p>${block.data.text}</p>
                    ${block.data.caption ? `<cite>— ${block.data.caption}</cite>` : ""}
                  </blockquote>`;

        case "image":
          // Based on your ImageBlock type, we check for media object or direct url
          const imageData = block.data as ImageBlock["data"];
          // Narrowing down the source based on your specific MediaRef type
          const src = imageData.media?.public_url || imageData.url || "";

          return `<figure style="margin: 20px 0; text-align: center;">
                    <img src="${src}" alt="${block.data.caption || ""}" style="max-width: 100%; height: auto;" />
                    ${block.data.caption ? `<figcaption style="font-size: 0.8em; color: #666;">${block.data.caption}</figcaption>` : ""}
                  </figure>`;

        case "poem":
          const poemData = block.data as PoemBlock["data"];
          // TypeScript now knows 'line' is a Column type!
          const poemLines = poemData.cols
            ?.map(
              (line: Column) => `
                <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 8px; font-family: serif; direction: rtl;">
                  <span style="flex: 1; text-align: right;">${line.sadr || ""}</span>
                  <span style="flex: 1; text-align: left; color: #666;">${line.ajuuz || ""}</span>
                </div>
              `,
            )
            .join("");

          return `
            <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px; direction: rtl;">
              ${poemLines}
              ${block.data.caption ? `<div style="text-align: center; margin-top: 15px; font-size: 0.9em; opacity: 0.7;">— ${block.data.caption}</div>` : ""}
            </div>
          `;

        default:
          return "";
      }
    })
    .join("");
}
