"use client";

import { useEffect, useState } from "react";
import type { MediaFile } from "@/types/cms";
import Image from "next/image";
import DOMPurify from "dompurify";
import { Image as ImageIcon } from "lucide-react";

export default function ImageBlock({
  data,
}: {
  data: { file?: MediaFile; caption?: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const imageUrl = data?.file?.url;

  const sanitize = (content: string) => {
    if (typeof window !== "undefined") return DOMPurify.sanitize(content);
    return content;
  };

  // 1. The Fallback State: No network request, just clean UI
  if (!imageUrl) {
    return (
      <figure className="w-full flex flex-col items-center my-10 gap-y-3">
        <div className="w-full flex flex-col items-center justify-center min-h-[30vh] bg-muted/20 border-2 border-dashed border-muted rounded-xl">
          <ImageIcon className="w-10 h-10 text-muted-foreground/50 mb-2" />
          <span className="text-sm text-muted-foreground/70">
            صورة غير متوفرة
          </span>
        </div>
      </figure>
    );
  }

  return (
    <figure className="w-full flex flex-col items-center my-10 gap-y-4">
      <div
        className={`
          relative w-full flex justify-center rounded-xl overflow-hidden shadow-sm transition-colors 
          ${isLoading ? "bg-muted/20 animate-pulse min-h-[40vh]" : "bg-transparent"}
        `}
      >
        <Image
          src={imageUrl}
          alt={data.caption || "صورة المقال"}
          width={1920}
          height={1080}
          sizes="(max-width: 768px) 100vw, 800px" // Adjusted size assuming max-w-3xl blog container
          unoptimized={true}
          className={`
            w-full h-auto max-h-[75vh] object-contain transition-all duration-700
            ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          `}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {data.caption && isMounted && (
        <figcaption
          className="text-sm md:text-base text-muted-foreground text-center max-w-2xl px-4 py-1 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: sanitize(data.caption) }}
        />
      )}
    </figure>
  );
}
