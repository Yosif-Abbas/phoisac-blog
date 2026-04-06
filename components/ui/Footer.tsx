"use client";

import { Copyright } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-[#E5E7EB] dark:border-[#1F2937] bg-container/50 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-y-2 text-[10px] sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-x-1.5 order-2 md:order-1">
          <Copyright size={12} className="opacity-70" />
          <span>{new Date().getFullYear()}</span>
          <span className="font-medium text-foreground/80">فويزاك الدالي</span>
        </div>

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
