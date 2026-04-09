"use client";

import { useState } from "react";
import type { MediaFile } from "@/types/cms";
import Image from "next/image";

export default function ImageBlock({
  data,
}: {
  data: { file?: MediaFile; caption?: string };
}) {
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = data?.file?.url || "/elementor-placeholder-image.png";

  return (
    <figure className="w-full flex flex-col items-center my-10 gap-y-4">
      <div
        className={`
          relative w-full flex justify-center rounded-3xl overflow-hidden shadow-lg group transition-colors 
          ${isLoading ? "bg-foreground/5 animate-pulse min-h-[40vh]" : "bg-muted/10"}
        `}
      >
        <Image
          src={imageUrl}
          alt={data.caption || "صورة المقال"}
          width={1920} // Set a real base width
          height={1080} // Set a real base height
          sizes="(max-width: 768px) 100vw, 1200px"
          // 🪄 Tell Next.js to trust your already-optimized WebP
          unoptimized={true}
          className={`
    w-full h-auto max-h-[85vh] object-contain transition-all duration-700
    ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}
  `}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {data.caption && (
        <figcaption
          className="text-sm md:text-base text-muted-foreground italic text-center max-w-2xl px-4  py-1"
          dangerouslySetInnerHTML={{ __html: data.caption }}
        />
      )}
    </figure>
  );
}
