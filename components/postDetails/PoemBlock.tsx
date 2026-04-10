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
    <figure className="w-full my-6 flex flex-col items-center">
      <div
        className={`
          w-full max-w-4xl mx-auto flex flex-col gap-y-2 md:gap-y-6 
          ${isClassic ? "px-2 md:px-8" : "px-6"}
        `}
      >
        {cols?.map((line, idx) => (
          <div
            key={idx}
            className={`
      relative w-full font-serif text-xl md:text-3xl text-foreground/90 leading-relaxed
      /* THE FIX: flex-col on mobile, flex-row on desktop */
      ${isClassic ? "flex flex-col md:flex-row md:justify-between items-stretch md:items-center gap-y-1 md:gap-y-0 md:gap-x-12 mb-6" : "flex flex-col items-center text-center mb-6"}
    `}
          >
            {/* The First Half (Sadr) - Stays Top Right on Mobile */}
            <p
              className={
                isClassic
                  ? "flex-1 text-right self-start w-[90%] md:w-auto md:text-justify"
                  : "w-full"
              }
              dangerouslySetInnerHTML={{ __html: sanitize(line.sadr ?? "") }}
            />

            {/* Optional: The Diamond Separator (Only visible on Desktop now) */}
            {/* {isClassic && line.ajuuz && (
              <div className="hidden md:block text-muted-foreground/40 text-sm">
                ♦
              </div>
            )} */}

            {/* The Second Half (Ajuuz) - Criss Crosses to Bottom Left on Mobile */}
            {isClassic && line.ajuuz && (
              <p
                className="flex-1 text-left self-end w-[90%] md:w-auto md:text-justify"
                dangerouslySetInnerHTML={{ __html: sanitize(line.ajuuz ?? "") }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Poet/Source Caption */}
      {caption && (
        <figcaption className="mt-4 md:mt-8 flex items-center gap-x-4 text-muted-foreground/70">
          <div className="h-px w-6 lg:w-8 bg-slate-300 dark:bg-slate-600"></div>

          <span
            className="text-sm md:text-base font-medium text-nowrap"
            dangerouslySetInnerHTML={{ __html: sanitize(caption) }}
          />
          <div className="h-px w-6 lg:w-8 bg-slate-300 dark:bg-slate-600"></div>
        </figcaption>
      )}
    </figure>
  );
}
