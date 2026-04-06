import { formatDate } from "@/lib/utils/formatDate";
import Link from "next/link";

export default function PostPreview({ title, excerpt, date, tags, slug }: any) {
  const formattedDate = formatDate(date);

  return (
    <Link
      href={`/blog/${slug}`}
      className="group cursor-pointer flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-transparent hover:border-card-hover hover:bg-card-hover/50 transition-all duration-300"
    >
      <div className="flex items-center gap-x-5 md:gap-x-8 w-full">
        {/* Content Wrapper */}
        <div className="flex flex-col gap-y-1.5 w-full">
          <div className="flex items-start gap-x-3 text-[11px] font-medium text-emerald-500/80 justify-between w-full">
            {/* Fixed the mapping assuming tags is an array of objects based on t.id */}
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

          <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>

          {/* We keep the excerpt but strictly limit it to 1 line for the "slim" feel */}
          <p className="text-sm text-muted-foreground line-clamp-1 hidden md:block">
            {excerpt}
          </p>
        </div>
      </div>

      {/* Action Button - Replaces the "Read More" text with a sleek, interactive icon */}
      <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-background border border-card-hover items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all shadow-sm rtl:rotate-180 mr-4 ">
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
