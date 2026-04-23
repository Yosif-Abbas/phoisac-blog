"use client";

import React, { useState } from "react";
import { Check, Rss } from "lucide-react";

export default function RssButton() {
  const [rssCopied, setRssCopied] = useState(false);

  const copyRssLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    const rssUrl = `${window.location.origin}/rss.xml`;

    try {
      await navigator.clipboard.writeText(rssUrl);
      setRssCopied(true);
      setTimeout(() => setRssCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy RSS link", err);
    }
  };

  return (
    <button
      onClick={copyRssLink}
      className="flex gap-x-2 text-muted-foreground hover:text-[#ee802f] transition-all group"
      title="Copy RSS Feed Link"
    >
      <span
        className="font-medium uppercase tracking-wider transition-opacity duration-300"
        dir="rtl"
      >
        {rssCopied ? "تم النسخ" : "RSS خلاصة"}
      </span>

      {rssCopied ? (
        <Check
          size={16}
          className="text-green-500 animate-in zoom-in duration-300"
        />
      ) : (
        <Rss
          size={16}
          strokeWidth={2.5}
          className="group-hover:scale-110 transition-transform"
        />
      )}
    </button>
  );
}
