import { BlockType } from "@/types/post-content";
import Image from "next/image";

export default function ImageBlock({ data }: BlockType) {
  return (
    <div>
      <Image
        height={300}
        width={450}
        src={data.url}
        alt="image"
      />
      <span>{data.caption}</span>
    </div>
  );
}
