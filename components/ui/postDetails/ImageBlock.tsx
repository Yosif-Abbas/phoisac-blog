"use client";

import { useState } from "react";
import { Block } from "@/types/post";
import Image from "next/image";

export default function ImageBlock({ data }: Block) {
  // 1. Track if the image is still downloading
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = data?.file?.url || "/elementor-placeholder-image.png";

  return (
    <figure className="w-full flex flex-col items-center my-10 gap-y-4">
      {/* 2. The Wrapper becomes the Skeleton when loading */}
      <div
        className={`
          relative w-full flex justify-center rounded-3xl overflow-hidden shadow-lg  group transition-colors duration-500
          ${isLoading ? "bg-muted/40 animate-pulse min-h-[40vh]" : "bg-muted/10"}
        `}
      >
        <Image
          src={imageUrl}
          alt={data.caption || "صورة المقال"}
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          // 3. Keep the image invisible until it's fully loaded, then fade it in smoothly
          className={`
            w-full h-auto max-h-[75vh] object-contain transition-all duration-700 ease-in-out group-hover:scale-[1.01]
            ${isLoading ? "opacity-0 blur-md" : "opacity-100 blur-0"}
          `}
          quality={90}
          loading="lazy"
          // 4. The trigger: Next.js fires this when the image is fully downloaded and rendered
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Caption remains exactly the same */}
      {data.caption && (
        <figcaption
          className="text-sm md:text-base text-muted-foreground italic text-center max-w-2xl px-4  py-1"
          dangerouslySetInnerHTML={{ __html: data.caption }}
        />
      )}
    </figure>
  );
}
