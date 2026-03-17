import { BlockType } from "@/types/post";

export default function ParagraphBlock({ data }: BlockType) {
  return (
    <div>
      <h1>{data.text}</h1>
    </div>
  );
}
