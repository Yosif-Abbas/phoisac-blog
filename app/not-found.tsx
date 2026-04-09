import Link from "next/link";
import { MoveRight, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* The "Pop-Art" Background Element */}
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-primary/10 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-serif font-bold text-foreground bg-background px-4 py-2 border-2 border-primary shadow-[4px_4px_0px_0px_rgba(var(--primary))]">
            لقد ضللت الطريق!
          </p>
        </div>
      </div>

      <div className="max-w-md space-y-6">
        <h2 className="text-3xl font-bold font-serif leading-tight">
          حتى أرسطو قد يضيع هنا أحياناً...
        </h2>

        <p className="text-muted-foreground text-lg">
          الصفحة التي تبحث عنها غير موجودة، ربما تم نقلها أو حذفها، أو ربما كانت
          مجرد فكرة فلسفية لم تتحقق بعد.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Home size={20} />
            العودة للرئيسية
          </Link>

          <Link
            href="/blog"
            className="flex items-center gap-2 px-6 py-3 bg-container border border-border text-foreground font-bold rounded-xl transition-all hover:bg-accent hover:border-accent"
          >
            استكشف المدونة
            <MoveRight size={20} className="rotate-180" />
          </Link>
        </div>
      </div>

      {/* Subtle Search Suggestion */}
      {/* <div className="mt-12 p-4 border border-dashed border-border rounded-lg opacity-60">
        <p className="text-sm flex items-center gap-2 italic">
          <Search size={16} />
          جرّب استخدام محرك البحث في الأعلى لتجد ما تريد بسرعة.
        </p>
      </div> */}
    </div>
  );
}
