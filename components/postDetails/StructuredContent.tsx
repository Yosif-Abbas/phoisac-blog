"use client";

import ParagraphBlock from "./ParagraphBlock";
import ImageBlock from "./ImageBlock";
import QuoteBlock from "./QuoteBlock";
import type {
  Block,
  StructuredContent as StructuredContentType,
  ParagraphBlock as ParagraphBlockType,
  QuoteBlock as QuoteBlockType,
  ImageBlock as ImageBlockType,
  PoemBlock as PoemBlockType,
} from "@/types/cms";
import PoemBlock from "./PoemBlock";
import HeaderBlock from "./HeaderBlock";

export default function StructuredContent({ blocks }: StructuredContentType) {
  return (
    <article className=" w-full flex flex-col gap-y-4 md:gap-y-6 pt-6 pb-10 md:px-2">
      {blocks.map((block: Block, index) => {
        switch (block.type) {
          case "header":
            return (
              <HeaderBlock
                data={block.data as ImageBlockType["data"]}
                key={index}
              />
            );
          case "paragraph":
            return (
              <ParagraphBlock
                data={block.data as ParagraphBlockType["data"]}
                key={index}
              />
            );
          case "image":
            return (
              <ImageBlock
                data={block.data as ImageBlockType["data"]}
                key={index}
              />
            );

          case "quote":
            return (
              <QuoteBlock
                data={block.data as QuoteBlockType["data"]}
                key={index}
              />
            );

          case "poem":
            return (
              <PoemBlock
                data={block.data as PoemBlockType["data"]}
                key={index}
              />
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
