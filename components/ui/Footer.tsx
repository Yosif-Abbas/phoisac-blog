"use client";

import { Check, Copyright, Rss } from "lucide-react";
import CurrentYear from "./CurrentYear";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المدونة", href: "/blog" },
    { name: "عن الكاتب", href: "/about" },
  ];

  const [rssCopied, setRssCopied] = useState(false);

  const copyRssLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    const rssUrl = `${window.location.origin}/rss.xml`;

    try {
      await navigator.clipboard.writeText(rssUrl);
      setRssCopied(true);
      setTimeout(() => setRssCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy RSS link", err);
    }
  };

  return (
    <footer className="w-full  border-t border-card-hover bg-background/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Top Section: Branding & Nav */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-foreground/90">
              فويزاك الدالي
            </h3>
            {/* <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              منصة رقمية مخصصة للأدب، الشعر، والقصص الطويلة.
            </p> */}
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-4 items-center text-xs">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className=" font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={copyRssLink}
              className="flex gap-x-2 text-muted-foreground hover:text-[#ee802f] transition-all group"
              title="Copy RSS Feed Link"
            >
              <span
                className={`font-medium uppercase tracking-wider transition-opacity duration-300 `}
                dir="rtl"
              >
                {rssCopied ? "تم النسخ" : "RSS خلاصة"}
              </span>

              {rssCopied ? (
                <Check
                  size={16}
                  className="text-green-500 animate-in zoom-in duration-300"
                />
              ) : (
                <Rss
                  size={16}
                  strokeWidth={2.5}
                  className="group-hover:scale-110 transition-transform"
                />
              )}
            </button>
          </nav>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/80">
          <div className="flex items-center gap-x-2">
            <Copyright size={14} className="opacity-60" />
            <CurrentYear />
            <span className="font-medium">
              <span className="text-foreground font-semibold  ">
                فويزاك الدالي
              </span>
              . جميع الحقوق محفوظة.
            </span>
          </div>

          <div className="flex items-center gap-x-6">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              سياسة الخصوصية
            </Link>

            <div className="flex items-center gap-x-1 border-r border-card-hover pr-6">
              <span>تم التطوير بواسطة</span>
              <a
                href="https://youssef-abbas.vercel.app"
                target="_blank"
                className="text-foreground font-semibold hover:text-primary transition-all underline-offset-4 hover:underline"
              >
                يوسف عباس
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
