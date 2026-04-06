"use client";

import ParagraphBlock from "./ParagraphBlock";
import ImageBlock from "./ImageBlock";
import QuoteBlock from "./QuoteBlock";
import { Block, PostContent as PostContentType } from "@/types/post";
import PoemBlock from "./PoemBlock";

export default function PostContent({ blocks }: PostContentType) {
  return (
    <article className=" w-full flex flex-col gap-y-8 md:gap-y-12 py-10 px-4">
      {blocks.map((block: Block, index) => {
        switch (block.type) {
          case "paragraph":
            return <ParagraphBlock data={block.data} key={index} />;
          case "image":
            return <ImageBlock data={block.data} key={index} />;

          case "quote":
            return <QuoteBlock data={block.data} key={index} />;

          case "poem":
            return <PoemBlock data={block.data} key={index} />;
          default:
            return null;
        }
      })}
    </article>
  );
}
