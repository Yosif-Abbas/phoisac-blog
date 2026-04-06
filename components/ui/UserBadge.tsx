import { formatDate } from "@/lib/utils/formatDate";

interface Date {
  date: string;
}

export default function UserBadge({ date }: Date) {
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
      {/* Add a '5 min read' here for extra pro feel */}
    </div>
  );
}
