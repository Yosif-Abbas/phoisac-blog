import { BlockType } from "@/types/post-content";

export default function ParagraphBlock({ data }: BlockType) {
  return (
    <div>
      <h1>{data.text}</h1>
    </div>
  );
}
