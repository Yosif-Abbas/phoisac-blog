export function renderBlocksToHtml(blocks: any[]) {
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
          return `<figure style="margin: 20px 0; text-align: center;">
                    <img src="${block.data.file.url}" alt="${block.data.caption || ""}" style="max-width: 100%; height: auto;" />
                    ${block.data.caption ? `<figcaption style="font-size: 0.8em; color: #666;">${block.data.caption}</figcaption>` : ""}
                  </figure>`;

        case "poem":
          // We loop through the 'cols' array since 'text' doesn't exist
          const poemLines = block.data.cols
            ?.map((line) => {
              return `
                <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 8px; font-family: serif;">
                  <span style="flex: 1; text-align: right;">${line.sadr || ""}</span>
                  <span style="flex: 1; text-align: left; color: #666;">${line.ajuuz || ""}</span>
                </div>
              `;
            })
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
