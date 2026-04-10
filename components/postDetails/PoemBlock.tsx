"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import type { PoemBlock } from "@/types/cms"; // Adjust this import based on your setup

export default function PoemBlock({ data }: { data: PoemBlock["data"] }) {
  const { style, cols, caption } = data || {};
  const isClassic = style === "classic";

  // State to handle client-side only rendering for sanitized HTML
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sanitize = (content: string) => {
    if (typeof window !== "undefined") {
      return DOMPurify.sanitize(content);
    }
    return content;
  };

  if (!isMounted) {
    return <div className="w-full min-h-[150px] my-4 bg-transparent" />;
  }

  return (
    <figure className="w-full my-4 flex flex-col items-center">
      <div
        className={`
          w-full max-w-4xl mx-auto flex flex-col gap-y-4 md:gap-y-6 
          ${isClassic ? "px-2 md:px-8" : "px-6"}
        `}
      >
        {cols?.map((line, idx) => (
          <div
            key={idx}
            className={`
              relative w-full font-serif text-xl md:text-3xl text-foreground/90 leading-relaxed
              ${isClassic ? "flex justify-around items-center gap-x-4 md:gap-x-12" : "flex flex-col items-center text-center"}
            `}
          >
            {/* The First Half (Sadr) */}
            <p
              className={
                isClassic ? "text-right md:text-justify flex-1" : "w-full"
              }
              dangerouslySetInnerHTML={{ __html: sanitize(line.sadr ?? "") }}
            />

            {/* The Second Half (Ajuuz) */}
            {isClassic && line.ajuuz && (
              <p
                className="text-right md:text-justify flex-1"
                dangerouslySetInnerHTML={{ __html: sanitize(line.ajuuz ?? "") }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Poet/Source Caption */}
      {caption && (
        <figcaption className="mt-12 flex items-center gap-x-4 text-muted-foreground/70">
          <div className="h-px w-8 bg-slate-300 dark:bg-slate-600"></div>

          <span
            className="text-sm md:text-base font-medium"
            dangerouslySetInnerHTML={{ __html: sanitize(caption) }}
          />
          <div className="h-px w-8 bg-slate-300 dark:bg-slate-600"></div>
        </figcaption>
      )}
    </figure>
  );
}
