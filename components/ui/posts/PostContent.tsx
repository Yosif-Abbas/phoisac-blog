"use client";

import { PostContentType, BlockType } from "@/types/post-content";

import ParagraphBlock from "./ParagraphBlock";
import ImageBlock from "./ImageBlock";

export default function PostContent({ content }: PostContentType) {
  return (
    <div>
      {content.blocks.map((block: BlockType, index) => {
        switch (block.type) {
          case "paragraph":
            return <ParagraphBlock data={block.data} key={index} />;
          case "image":
            return block.data.url ? (
              <ImageBlock data={block.data} key={index} />
            ) : null;
          default:
            return null;
        }
      })}
    </div>
  );
}
