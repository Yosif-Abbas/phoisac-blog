import { Tag as TagIcon } from "lucide-react";

export default function TagsSkeleton() {
  // Use the exact same container padding (p-4) and rounding (rounded-2xl)
  return (
    <div className="flex items-center justify-between p-4 bg-container/50 border border-[#1F2937] rounded-2xl relative overflow-hidden animate-pulse">
      {/* 1. Standard Shimmer Effect (optional, for a softer feel) */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="flex items-center gap-x-3">
        {/* 2. MATCHED: Icon Container (p-2, bg-primary/10) */}
        <div className="p-2 bg-primary/10 rounded-lg">
          {/* We show the Icon shape, but softly pulsed */}
          <TagIcon size={18} className="text-primary/20" />
        </div>

        <div className="flex flex-col gap-y-2">
          {/* 3. MATCHED: Tag Name (Pulsed line with similar height/font-bold) */}
          <div className="h-5 w-24 bg-[#1F2937] rounded-lg" />

          {/* 4. MATCHED: Post Count (Pulsed line with text-xs height) */}
          <div className="h-3.5 w-16 bg-[#1F2937]/50 rounded-md" />
        </div>
      </div>

      {/* 5. MATCHED: Action Buttons Placeholders */}
      {/* Note: The "opacity-0" group hover effect will handle these when data loads */}
      <div className="flex items-center gap-x-1">
        <div className="w-8 h-8 bg-[#1F2937] rounded-lg" />
        <div className="w-8 h-8 bg-[#1F2937] rounded-lg" />
      </div>
    </div>
  );
}
