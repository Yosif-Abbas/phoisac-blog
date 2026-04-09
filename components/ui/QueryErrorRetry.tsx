import { Button } from "./Button";
import { AlertCircle, RotateCcw, RefreshCcw } from "lucide-react";

interface QueryErrorProps {
  query: any; // Using any or UseQueryResult depending on your strictness
  message?: string;
  className?: string;
}

export default function QueryErrorRetry({
  query,
  message = "عذراً، تعذر جلب البيانات",
  className = "",
}: QueryErrorProps) {
  if (!query.isError) return null;

  return (
    <div
      role="alert"
      className={`w-full p-6 rounded-2xl border-2 border-dashed border-destructive/30 bg-destructive/5 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-300 ${className}`}
    >
      {/* Icon with a soft glow */}
      <div className="p-3 bg-destructive/10 rounded-full text-destructive shadow-[0_0_15px_rgba(var(--destructive),0.2)]">
        <AlertCircle size={28} />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold font-amiri text-foreground">
          {message}
        </h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          يبدو أن هناك مشكلة في الاتصال. يمكنك المحاولة مرة أخرى.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
        <Button
          onClick={() => query.refetch()}
          disabled={query.isFetching}
          className="min-w-[140px] shadow-lg active:scale-95 transition-transform"
        >
          {query.isFetching ? (
            <span className="flex items-center gap-2">
              <RotateCcw className="animate-spin" size={16} />
              جاري المحاولة...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <RotateCcw size={16} />
              إعادة المحاولة
            </span>
          )}
        </Button>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-4"
        >
          <RefreshCcw size={14} />
          تحديث كامل للصفحة
        </button>
      </div>
    </div>
  );
}
