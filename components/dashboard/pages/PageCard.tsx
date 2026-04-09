import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils/formatDate";

type PageCardProps = {
  page: {
    page_name: string;
    title: string;
    created_at?: string | Date;
    updated_at?: string | Date;
    description?: string;
  };
};

export default function PageCard({ page }: PageCardProps) {
  return (
    <Link
      href={`/dashboard/pages/${page.page_name}`}
      dir="rtl"
      className="group block rounded-2xl border border-card-hover bg-container p-5 shadow-sm transition-all duration-200 hover:border-tag-active hover:shadow-lg "
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary transition-colors group-hover:bg-tag">
          <FileText size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                {page.title}
              </h3>

              <p className="mt-1 truncate text-xs text-muted-foreground">
                {page.updated_at
                  ? formatDate(page.updated_at)
                  : formatDate(page.created_at)}
              </p>
            </div>
          </div>

          {page.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-secondary-foreground">
              {page.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-accent">
              تعديل الصفحة
            </span>

            <ArrowLeft
              size={18}
              className="text-[rgb(var(--muted-foreground))] transition-transform group-hover:-translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
