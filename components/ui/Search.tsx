"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search as SearchIcon, Loader2, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [query, setQuery] = useState(
    searchParams.get("search")?.toString() || "",
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setQuery(searchParams.get("search")?.toString() || "");
  }, [searchParams]);

  const updateUrl = (params: URLSearchParams) => {
    const queryString = params.toString();
    replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    // 3. Wrap the navigation in startTransition
    startTransition(() => {
      updateUrl(params);
      setIsTyping(false); // Stop the "typing" phase once the "transition" phase starts
    });
  }, 400);

  // 4. The spinner shows if we are EITHER debouncing OR navigating
  const showLoader = isTyping || isPending;

  return (
    <div className="relative group">
      {query ? (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            const params = new URLSearchParams(searchParams.toString());
            params.delete("search");
            startTransition(() => {
              updateUrl(params);
              setIsTyping(false);
            });
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted hover:text-primary transition-colors"
        >
          <X size={18} />
        </button>
      ) : null}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        {showLoader ? (
          <Loader2 className="text-primary animate-spin" size={20} />
        ) : (
          <SearchIcon
            className="text-muted group-focus-within:text-primary transition-colors"
            size={20}
          />
        )}
      </div>

      <input
        type="text"
        placeholder="ابحث عن نص، قصيدة، أو خاطرة..."
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setIsTyping(true); // Immediate feedback
          handleSearch(value);
        }}
        className="w-full pr-12 pl-12 py-4 bg-container border border-card-hover rounded-2xl text-foreground focus:ring-1 focus:ring-primary/5 outline-none transition-all shadow-sm"
      />
    </div>
  );
}
