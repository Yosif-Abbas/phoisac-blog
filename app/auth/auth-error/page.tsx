import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>

      <h1 className="text-3xl font-bold mb-4">
        عذراً، حدث خطأ أثناء تسجيل الدخول
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        لم نتمكن من التحقق من هويتك. قد يكون ذلك بسبب انتهاء صلاحية الرابط أو
        إلغاء عملية التسجيل.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 rounded-lg border border-card-hover hover:bg-card-hover transition-all"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
