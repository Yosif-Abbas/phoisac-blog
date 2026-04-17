"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButton({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    // We get the URL dynamically from the browser
    const url = window.location.href;
    const shareData = { title, text, url };

    // 1. Try the native OS Share Sheet first
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Users often cancel the share sheet, which throws a harmless error.
        // We log it only if we need to debug.
        console.log("Share canceled or failed", error);
      }
    } else {
      // 2. Fallback: Copy to Clipboard
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        // Reset the icon back to 'Share' after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error("Failed to copy text: ", error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="group flex items-center gap-x-2 px-3 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all border border-transparent hover:border-border"
      title="مشاركة المقال"
    >
      <span className="sr-only sm:not-sr-only">
        {isCopied ? "تم النسخ" : "مشاركة"}
      </span>
      {isCopied ? (
        <Check size={18} className="text-green-500" />
      ) : (
        <Share2
          size={18}
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        />
      )}
    </button>
  );
}
