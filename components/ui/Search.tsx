"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search as SearchIcon, Loader2, X } from "lucide-react";
import { useState, useTransition } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Initialize from URL, but let local state be the boss after that.
  const [query, setQuery] = useState(
    searchParams.get("search")?.toString() || "",
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 1. Extracted the core search logic
  const executeSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      const queryString = params.toString();
      replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
      setIsTyping(false);
    });
  };

  // 2. Debounce wraps the execution for typing
  const handleSearch = useDebouncedCallback((term: string) => {
    executeSearch(term);
  }, 400);

  const showLoader = isTyping || isPending;

  return (
    <div className="relative group">
      {/* Clear Button (Left side for RTL) */}
      {query ? (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            handleSearch.cancel(); // Stop any pending debounces
            executeSearch(""); // Clear immediately
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted hover:text-primary transition-colors z-10"
        >
          <X size={18} />
        </button>
      ) : null}

      {/* Search Button (Right side for RTL) */}
      <button
        type="button"
        onClick={() => {
          handleSearch.cancel(); // Stop the delay
          executeSearch(query); // Search immediately on click
        }}
        disabled={showLoader}
        // Changed from pointer-events-none to a clickable button
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted hover:text-primary transition-colors z-10"
      >
        {showLoader ? (
          <Loader2 className="text-primary animate-spin" size={20} />
        ) : (
          <SearchIcon size={20} />
        )}
      </button>

      <input
        type="text"
        placeholder="ابحث عن نص، قصيدة، أو خاطرة..."
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setIsTyping(true);
          handleSearch(value);
        }}
        // Added onKeyDown so hitting "Enter" also triggers the search instantly
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch.cancel();
            executeSearch(query);
          }
        }}
        className="w-full pr-12 pl-12 py-4 bg-container border border-card-hover rounded-2xl text-foreground focus:ring-1 focus:ring-primary/5 outline-none transition-all shadow-sm"
      />
    </div>
  );
}
