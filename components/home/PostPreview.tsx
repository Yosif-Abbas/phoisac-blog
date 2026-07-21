import { formatDate } from "@/lib/utils/formatDate";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PostPreview({
  title,
  excerpt,
  date,
  tags,
  slug,
  cover_image_url,
}: any) {
  // Assuming formatDate is defined elsewhere in your file
  const formattedDate = formatDate(date);
  const hasImage = !!cover_image_url;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group cursor-pointer flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-transparent hover:border-card-hover hover:bg-card-hover/50 transition-all duration-300"
    >
      {/* Responsive Wrapper: 
        Stacks vertically on mobile (flex-col), aligns horizontally on larger screens (sm:flex-row) 
      */}
      <div className="flex flex-row items-start gap-2 sm:gap-4 w-full min-w-0">
        {/* Cover Image */}
        <div className="shrink-0 relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-card-hover ">
          {hasImage ? (
            <Image
              src={cover_image_url}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 80px, 144px"
            />
          ) : (
            /* 2. Elegant Placeholder: Shown when cover_image_url is missing */
            <div className="w-full h-full flex flex-col items-center justify-center bg-background text-primary/80">
              <ImageIcon size={28} strokeWidth={1.5} />
              <span className="text-[10px] mt-1 font-medium opacity-50">
                لا توجد صورة
              </span>
            </div>
          )}
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col gap-y-1.5 w-full min-w-0">
          <div className="flex items-start gap-x-3 text-[11px] font-medium text-emerald-500/80 justify-between w-full">
            <div className="flex gap-x-2 flex-wrap gap-y-1">
              {tags?.map((t: { id: string; name: string }) => (
                <span
                  key={t.id}
                  className="bg-emerald-500/10 px-2 py-0.5 rounded-full text-nowrap"
                >
                  #{t.name}
                </span>
              ))}
            </div>
            <div className="shrink-0 flex items-center justify-end sm:justify-start">
              <span className="text-xs font-medium text-muted-foreground/60 group-hover:text-muted-foreground transition-colors whitespace-nowrap">
                {formattedDate}
              </span>
            </div>
          </div>

          <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors truncate">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-1 hidden md:block">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-background border border-card-hover items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-sm rtl:rotate-180 ms-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </div>
    </Link>
  );
}
