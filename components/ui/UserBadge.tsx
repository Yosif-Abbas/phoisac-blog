"use client";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { formatDate } from "@/lib/utils/formatDate";
import { Eye } from "lucide-react";

interface Props {
  date: string | Date;
  view_count: number;
}

export default function UserBadge({ date, view_count }: Props) {
  const { isAdmin } = useCurrentUser();

  return (
    <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
      <span>بقلم</span>
      <span className="font-bold text-foreground">فـويـزاك الـدالي</span>
      <span className="opacity-30">•</span>
      <time
        title={new Date(date).toLocaleString("ar-EG")}
        suppressHydrationWarning
      >
        {formatDate(date)}
      </time>
      {isAdmin && Boolean(view_count) && (
        <>
          <span className="opacity-30">•</span>
          <div className="flex items-center gap-x-1">
            <Eye size={16} />
            <span className="">
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
