// components/ui/posts/blocks/PoemBlock.tsx

import { Block } from "@/types/post"; // Adjust import based on your types

export default function PoemBlock({ data }: Block) {
  const { style, cols, caption } = data;
  const isClassic = style === "classic";

  return (
    <figure className="w-full my-4 flex flex-col items-center">
      <div
        className={`
          w-full max-w-4xl mx-auto flex flex-col gap-y-2 md:gap-y-4
          ${isClassic ? "px-2 md:px-8" : "px-6"}
        `}
      >
        {cols &&
          cols.map((line: any, idx: number) => (
            <div
              key={idx}
              className={`
              relative w-full font-serif text-xl md:text-3xl text-foreground/90
              ${
                isClassic
                  ? "flex justify-around items-center gap-x-4 md:gap-x-12"
                  : "flex flex-col items-center text-center"
              }
            `}
            >
              {/* The First Half (Sadr) */}
              <span
                className={isClassic ? "text-left md:text-right" : "w-full"}
              >
                {line.sadr}
              </span>

              {/* The Ornament (Only for Classic style) */}
              {/* {isClassic && (
                <span className="text-primary/30 text-sm md:text-lg select-none">
                  ✦
                </span>
              )} */}

              {/* The Second Half (Ajuuz) - Only if it exists/Classic style */}
              {isClassic && line.ajuuz && (
                <span className="text-right md:text-left">{line.ajuuz}</span>
              )}
            </div>
          ))}
      </div>

      {/* Poet/Source Caption */}
      {caption && (
        <figcaption className="mt-10 flex items-center gap-x-3 text-muted-foreground/60">
          <div className="h-px w-8 bg-slate-300 dark:bg-slate-600" />
          <cite className="text-sm md:text-base font-medium">{caption}</cite>
          <div className="h-px w-8 bg-slate-300 dark:bg-slate-600" />
        </figcaption>
      )}
    </figure>
  );
}
