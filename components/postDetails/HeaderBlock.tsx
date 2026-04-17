"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

export default function HeaderBlock({
  data,
}: {
  data: { text: string; level: number };
}) {
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
      <div className="w-2/3 h-8 my-10 animate-pulse bg-muted/10 rounded" />
    );
  }

  const levels: Record<number, string> = {
    1: "text-3xl md:text-5xl font-extrabold mt-12 mb-8 text-foreground",
    2: "text-2xl md:text-4xl font-bold mt-12 mb-6 text-foreground",
    3: "text-xl md:text-2xl font-bold mt-10 mb-4 text-foreground",
    4: "text-lg md:text-xl font-semibold mt-8 mb-3 text-foreground",
  };

  const Tag = `h${data.level}` as keyof JSX.IntrinsicElements;
  const headerClass = levels[data.level] || levels[2];

  return (
    <div className="w-full group">
      <Tag
        className={`${headerClass} leading-tight tracking-tight transition-colors`}
        dangerouslySetInnerHTML={{ __html: sanitize(data.text) }}
      />
    </div>
  );
}
