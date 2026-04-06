"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLink({
  href,
  children,
  className = "",
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        relative flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
        } ${className}
      `}
    >
      {/* The Active Indicator (RTL version) */}
      {isActive && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full" />
      )}

      {children}
    </Link>
  );
}
