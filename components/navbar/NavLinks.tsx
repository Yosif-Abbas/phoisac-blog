"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  // Helper function to check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <ul className="hidden md:flex items-center gap-x-8 text-base font-medium">
      <li className="relative">
        <Link
          href="/"
          className={`transition-colors duration-200 py-2 ${
            isActive("/")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          الرئيسية
        </Link>
        {isActive("/") && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
        )}
      </li>

      <li className="relative">
        <Link
          href="/blog"
          className={`transition-colors duration-200 py-2 ${
            isActive("/blog")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          المدونة
        </Link>
        {isActive("/blog") && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
        )}
      </li>

      <li className="relative">
        <Link
          href="/about"
          className={`transition-colors duration-200 py-2 ${
            isActive("/about")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          فويزاك
        </Link>
        {isActive("/about") && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
        )}
      </li>
    </ul>
  );
}
