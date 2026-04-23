"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageIcon, FileText, User } from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard/settings/home-page",
      label: "الصفحة الرئيسية",
      icon: ImageIcon,
    },
    {
      href: "/dashboard/settings/blog-page",
      label: "صفحة المدونة",
      icon: FileText,
    },
    {
      href: "/dashboard/settings/personal-info",
      label: "المعلومات الشخصية",
      icon: User,
    },
  ];

  const activeLink = links.find((link) => link.href === pathname);

  return (
    <div className="flex flex-col gap-y-10 h-full w-full pb-10">
      {/* 1. Header Section */}
      <div className="flex items-baseline justify-between border-b border-card-hover pb-6">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h1 className="text-3xl font-bold text-foreground text-nowrap">
            لوحة تحكم المسؤول
          </h1>
          <span className="text-lg text-muted-foreground text-nowrap">
            / الاعدادات
          </span>
          <span className="text-lg text-muted-foreground ">
            / {activeLink?.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 2. Side Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-y-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-muted-foreground hover:bg-card-hover hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* 3. The Specific Settings Form (Children) */}
        <main className="flex-1   rounded-xl p-6 shadow-sm">{children}</main>
      </div>
    </div>
  );
}
