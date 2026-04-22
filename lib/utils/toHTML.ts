export function renderBlocksToHtml(blocks: any[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;

        case "paragraph":
          return `<p>${block.data.text}</p>`;

        case "quote":
          return `<blockquote>
                    <p>${block.data.text}</p>
                    ${block.data.caption ? `<cite>— ${block.data.caption}</cite>` : ""}
                  </blockquote>`;

        case "image":
          return `<figure>
                    <img src="${block.data.file.url}" alt="${block.data.caption || ""}" />
                    ${block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : ""}
                  </figure>`;

        case "poem":
          // Poems usually need to preserve line breaks
          const poemLines = block.data.text.split("\n").join("<br />");
          return `<div style="margin: 20px 0; font-style: italic; line-height: 1.8;">
                    ${poemLines}
                  </div>`;

        default:
          return "";
      }
    })
    .join("");
}
