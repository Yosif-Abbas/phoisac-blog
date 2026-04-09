"use client";

import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("The Server is confused:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-6 text-center p-6 border-2 border-destructive/20 rounded-3xl bg-destructive/5">
      <div className="relative">
        <AlertTriangle size={64} className="text-destructive animate-pulse" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-amiri text-foreground">
          تعذر جلب البيانات!
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          يبدو أن خوادمنا تمرّ بأزمة وجودية.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[200px]">
        <Button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.reload();
            } else {
              reset();
            }
          }}
          className="bg-primary hover:scale-105 transition-transform font-bold py-6 shadow-lg"
        >
          <RefreshCw size={18} className="ml-2" />
          أعد المحاولة
        </Button>
      </div>
    </div>
  );
}
