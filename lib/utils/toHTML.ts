import {
  Block,
  Column,
  HeaderBlock,
  ImageBlock,
  ParagraphBlock,
  PoemBlock,
  QuoteBlock,
} from "@/types/cms";
import sanitizeHtml from "sanitize-html";

const clean = (content: string) => {
  return sanitizeHtml(content, {
    allowedTags: ["b", "i", "em", "strong", "a", "br"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
  });
};

export function renderBlocksToHtml(blocks: Block[]) {
  if (!blocks || !Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          const headerData = block.data as HeaderBlock["data"];

          const level = headerData.level || 2;
          return `<h${level} style="margin-top: 1.5em; margin-bottom: 0.75em; font-weight: 600; line-height: 1.3; color: #111827;">
                    ${clean(headerData.text)}
                  </h${level}>`;

        case "paragraph":
          const paragraphData = block.data as ParagraphBlock["data"];

          return `<p style="margin-bottom: 1.25em; line-height: 1.75; color: #374151;">
                    ${clean(paragraphData.text)}
                  </p>`;

        case "quote":
          const quoteData = block.data as QuoteBlock["data"];

          return `<blockquote style="border-right: 4px solid #cbd5e1; padding-right: 1.25rem; margin: 2rem 0; font-style: italic; color: #475569; background-color: #f8fafc; padding: 1.5rem; border-radius: 0.25rem; direction: rtl;">
                    <p style="margin: 0; line-height: 1.75;">${clean(quoteData.text)}</p>
                    ${
                      quoteData.caption
                        ? `<footer style="margin-top: 0.75rem; font-size: 0.875em; color: #64748b; font-weight: 500;">— <cite>${clean(quoteData.caption)}</cite></footer>`
                        : ""
                    }
                  </blockquote>`;

        case "image":
          const imageData = block.data as ImageBlock["data"];
          const src = imageData.media?.public_url || imageData.url || "";
          const alt = imageData.caption || "";

          return `<figure style="margin: 2.5rem 0; text-align: center; display: flex; flex-direction: column; align-items: center;">
                    <img src="${clean(src)}" alt="${clean(alt)}" style="max-width: 100%; height: auto; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);" loading="lazy" />
                    ${
                      imageData.caption
                        ? `<figcaption style="margin-top: 0.75rem; font-size: 0.875rem; color: #6b7280;">${clean(imageData.caption)}</figcaption>`
                        : ""
                    }
                  </figure>`;

        case "poem":
          const poemData = block.data as PoemBlock["data"];
          const isClassic = poemData.style === "classic";

          const poemLines = poemData.cols
            ?.map((line: Column) => {
              if (isClassic) {
                // Uses flex-wrap and min-width to naturally stack on mobile, mimicking your React component
                return `
                  <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.25rem; font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif; font-size: 1.25rem; line-height: 1.8; color: #1f2937; direction: rtl;">
                    <span style="flex: 1 1 45%; text-align: right; min-width: 250px;">${clean(line.sadr || "")}</span>
                    ${
                      line.ajuuz
                        ? `<span style="flex: 1 1 45%; text-align: left; min-width: 250px;">${clean(line.ajuuz || "")}</span>`
                        : ""
                    }
                  </div>
                `;
              } else {
                return `
                  <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 1.25rem; font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif; font-size: 1.25rem; line-height: 1.8; color: #1f2937; direction: rtl;">
                    <span style="width: 100%;">${clean(line.sadr || "")}</span>
                  </div>
                `;
              }
            })
            .join("");

          // Replicating the elegant divider line from your React component
          const captionHtml = poemData.caption
            ? `<div style="margin-top: 2rem; display: flex; align-items: center; justify-content: center; gap: 1rem; color: #64748b;">
                 <div style="height: 1px; width: 2rem; background-color: #cbd5e1;"></div>
                 <span style="font-size: 0.9rem; font-weight: 500;">${clean(poemData.caption)}</span>
                 <div style="height: 1px; width: 2rem; background-color: #cbd5e1;"></div>
               </div>`
            : "";

          return `
            <div style="margin: 3rem 0; width: 100%; display: flex; flex-direction: column; align-items: center;">
              <div style="width: 100%; max-width: 56rem; margin: 0 auto; padding: 0 1.5rem;">
                ${poemLines}
              </div>
              ${captionHtml}
            </div>
          `;

        default:
          return "";
      }
    })
    .join("");
}
