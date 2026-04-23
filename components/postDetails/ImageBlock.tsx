"use client";

import { useEffect, useState } from "react";
import type { MediaFile } from "@/types/cms";
import Image from "next/image";
import DOMPurify from "dompurify";
import { Image as ImageIcon, ImageOff } from "lucide-react"; // Import ImageOff
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ImageBlock({
  data,
}: {
  data: { file?: MediaFile; caption?: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Full-screen state

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const imageUrl = data?.file?.url;

  const sanitize = (content: string) => {
    if (typeof window !== "undefined") return DOMPurify.sanitize(content);
    return content;
  };

  // 2. The Fallback State: Catch BOTH missing URLs and Broken URLs
  if (!imageUrl || hasError) {
    return (
      <figure className="w-full flex flex-col items-center my-10 gap-y-3">
        <div className="w-full flex flex-col items-center justify-center min-h-[30vh] bg-muted/10 border border-dashed border-muted-foreground/30 rounded-xl">
          {hasError ? (
            <ImageOff className="w-8 h-8 text-muted-foreground/40 mb-3" />
          ) : (
            <ImageIcon className="w-8 h-8 text-muted-foreground/40 mb-3" />
          )}
          <span className="text-sm text-muted-foreground/60 font-medium">
            {hasError ? "تعذر تحميل الصورة" : "صورة غير متوفرة"}
          </span>
        </div>
        {/* Even if the image is broken, we should still show the caption if it exists */}
        {data?.caption && isMounted && (
          <figcaption
            className="text-sm text-muted-foreground/60 text-center max-w-2xl px-4"
            dangerouslySetInnerHTML={{ __html: sanitize(data.caption) }}
          />
        )}
      </figure>
    );
  }

  return (
    <figure className="w-full flex flex-col items-center my-10 gap-y-4">
      {/* Interactive Wrapper */}
      <div
        className={`
          relative w-full flex justify-center rounded-xl overflow-hidden cursor-pointer group
          ${isLoading ? "bg-muted/20 animate-pulse min-h-[40vh]" : "bg-transparent"}
        `}
        onClick={() => !isLoading && setIsOpen(true)}
      >
        {/* Subtle Hover Overlay */}
        {!isLoading && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10 flex items-center justify-center">
            {/* <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" /> */}
          </div>
        )}

        <Image
          src={imageUrl}
          alt={data.caption || "صورة المقال"}
          width={1920}
          height={1080}
          sizes="(max-width: 768px) 100vw, 800px"
          unoptimized={true}
          className={`
            w-full h-auto max-h-[75vh] object-contain transition-all duration-700
            ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          `}
          
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      </div>

      {data.caption && isMounted && (
        <figcaption
          className="text-sm md:text-base text-muted-foreground text-center max-w-2xl px-4 py-1 leading-relaxed italic"
          dangerouslySetInnerHTML={{ __html: sanitize(data.caption) }}
        />
      )}

      {/* Lightbox Implementation */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[{ src: imageUrl }]}
        render={{
          buttonPrev: () => null, // Hide navigation since it's a single image
          buttonNext: () => null,
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </figure>
  );
}
