import { BookOpen, LucideIcon } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title = "لا توجد بيانات",
  description = "لم يتم العثور على أي محتوى هنا حتى الآن.",
  icon: Icon = BookOpen,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-2xl bg-card/30 ${className}`}
    >
      <div className="p-4 bg-muted/50 rounded-full mb-4 text-muted-foreground">
        {/* You can pass any Lucide icon here, but BookOpen fits your vibe perfectly */}
        <Icon size={32} strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-bold font-amiri text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description}
      </p>

      {/* Optional button if you want the user to DO something (like "Create Post") */}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
