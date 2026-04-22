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
          return `<h${level} style="margin-top: 1.5em; margin-bottom: 0.75em; font-weight: 600; line-height: 1.3; color: #f8fafc;">
                    ${clean(headerData.text)}
                  </h${level}>`;

        case "paragraph":
          const paragraphData = block.data as ParagraphBlock["data"];

          return `<p style="margin-bottom: 1.25em; line-height: 1.75; color: #f8fafc;">
                    ${clean(paragraphData.text)}
                  </p>`;

        case "quote":
          const quoteData = block.data as QuoteBlock["data"];

          return `<blockquote style="margin: 1rem 0; color: #f8fafc;  padding: 1.5rem; border-radius: 0.25rem; direction: rtl; text-align: center;">
                    <p style="margin: 0; line-height: 1.75;">«${clean(quoteData.text)}»</p>
                    ${
                      quoteData.caption
                        ? `<footer style="margin-top: 0.75rem; font-size: 0.875em; color: #64748b; font-weight: 500;  text-align: center;">— <cite>${clean(quoteData.caption)}</cite> —</footer>`
                        : ""
                    }
                  </blockquote>`;

        case "image":
          const imageData = block.data as ImageBlock["data"];
          const src = imageData.file?.url || "";
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

          const poemRows = poemData.cols
            ?.map((line: Column) => {
              if (isClassic && line.ajuuz) {
                return `
                  <tr>
                    <td align="right" width="45%" valign="top" style="font-family: serif; font-size: 1.3em; padding-bottom: 15px;">${clean(line.sadr || "")}</td>
                    <td width="10%" align="center" valign="top" style="color: #f8fafc; padding-bottom: 15px;">&nbsp;</td>
                    <td align="left" width="45%" valign="top" style="font-family: serif; font-size: 1.3em; color: #f8fafc; padding-bottom: 15px;">${clean(line.ajuuz || "")}</td>
                  </tr>`;
              }
              return `
                <tr>
                  <td colspan="3" align="center" valign="top" style="font-family: serif; font-size: 1.3em; padding-bottom: 15px;">${clean(line.sadr || "")}</td>
                </tr>`;
            })
            .join("");

          return `
            <table width="100%" dir="rtl" border="0" cellpadding="0" cellspacing="0" style="margin: 3em 0; table-layout: fixed;">
              ${poemRows}
              ${
                poemData.caption
                  ? `
                <tr>
                  <td colspan="3" align="center" style="padding-top: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="20" style="border-bottom: 1px solid #64748b;">&nbsp;</td>
                        <td style="padding: 0 15px; color: #64748b; font-size: 0.9em; white-space: nowrap;">${clean(poemData.caption)}</td>
                        <td width="20" style="border-bottom: 1px solid #64748b;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>`
                  : ""
              }
            </table>`;

        default:
          return "";
      }
    })
    .join("");
}
