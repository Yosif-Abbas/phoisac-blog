"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

export default function ParagraphBlock({ data }: { data: { text: string } }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sanitize = (content: string) => {
    if (typeof window !== "undefined") return DOMPurify.sanitize(content);
    return content;
  };

  if (!isMounted) {
    return (
      <div className="w-full min-h-[1.5em] my-2 animate-pulse bg-foreground/5 rounded" />
    );
  }

  return (
    <div className="w-full">
      <p
        className="text-lg md:text-xl text-foreground/90 font-medium leading-[1.8] md:leading-[2] tracking-wide
                   [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-8 [&_a]:decoration-primary/40 hover:[&_a]:decoration-primary transition-all
                   [&_b]:font-bold [&_b]:text-foreground [&_i]:italic"
        dangerouslySetInnerHTML={{ __html: sanitize(data.text) }}
      />
    </div>
  );
}
