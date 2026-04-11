"use client";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { formatDate } from "@/lib/utils/formatDate";
import { Eye, Calendar } from "lucide-react";

interface Props {
  date: string;
  updatedAt?: string; // Add this
  view_count: number;
}

export default function UserBadge({ date, updatedAt, view_count }: Props) {
  const { isAdmin } = useCurrentUser();

  // Check if the post was actually modified (more than 1 minute difference)
  const isModified =
    updatedAt && new Date(updatedAt).getTime() > new Date(date).getTime();

  return (
    <div className="flex items-center gap-x-3 gap-y-2 text-sm text-muted-foreground flex-wrap">
      {/* Author Part */}
      <div className="flex items-center gap-x-2">
        <span className="opacity-70">بقلم</span>
        <span className="font-bold text-foreground">فـويـزاك الـدالي</span>
      </div>

      <span className="opacity-20 hidden sm:block">•</span>

      {/* Date Part */}
      <div className="flex items-center gap-x-2">
        <Calendar size={14} className="opacity-60" />
        <time
          title={`تاريخ النشر: ${new Date(date).toLocaleString("ar-EG")}`}
          suppressHydrationWarning
        >
          {isModified ? formatDate(updatedAt) : formatDate(date)}
        </time>

        {/* The "Edited" Tag */}
        {/* {isModified && (
          <>
            <span className="opacity-20 hidden sm:block">•</span>

            <span
              className="text-[10px] bg-primary/50 px-1.5 py-0.5 rounded-full text-primary-foreground font-medium"
              title={`آخر تحديث: ${new Date(updatedAt).toLocaleString("ar-EG")}`}
            >
              معدّل
            </span>
          </>
        )} */}
      </div>

      {/* Admin View Count */}
      {isAdmin && Boolean(view_count) && (
        <>
          <span className="opacity-20 hidden sm:block">•</span>
          <div className="flex items-center gap-x-1 bg-primary/5 text-primary px-2 py-0.5 rounded-full border border-primary/10">
            <Eye size={14} />
            <span className="font-medium">
              {view_count}{" "}
              {(view_count > 1 && view_count < 11) || view_count === 0
                ? "قراءات"
                : "قراءة"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
