"use client";

import { Copyright } from "lucide-react";
import CurrentYear from "./CurrentYear";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-[#E5E7EB] dark:border-card-hover bg-container/50 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col-reverse md:flex-row items-center justify-between gap-y-2 text-[10px] sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-x-1.5">
          <Copyright size={12} className="opacity-70" />

          <CurrentYear />
          <span className="font-medium text-foreground/80">فويزاك الدالي</span>
        </div>
        <Link href="/privacy">سياسة الخصوصية (Privacy Policy)</Link>

        <div className="flex items-center gap-x-1 order-1 md:order-2">
          <span>تم التطوير بواسطة</span>
          <a
            href="https://youssef-abbas.vercel.app"
            target="_blank"
            className="text-primary hover:underline transition-all font-medium"
          >
            يوسف عباس
          </a>
        </div>
      </div>
    </footer>
  );
}
