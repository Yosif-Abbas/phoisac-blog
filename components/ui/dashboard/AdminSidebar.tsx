"use client";

import AdminBadge from "../AdminBadge";
import { CirclePlus, Gauge, PanelsTopLeft, Pencil, Tags } from "lucide-react";
import SidebarLink from "./SidebarLink";

export default function AdminSidebar() {
  return (
    <aside className="h-fit sticky top-24 hidden lg:flex flex-col gap-y-6 w-full">
      <div className="px-4">
        <AdminBadge />
        <h1 className="text-xl font-bold text-foreground mt-8">لوحة التحكم</h1>
      </div>

      <nav>
        <ul className="flex flex-col gap-y-1">
          <SidebarItem
            href="/dashboard"
            icon={<Gauge size={18} />}
            label="الرئيسية"
          />
          <SidebarItem
            href="/dashboard/create-post"
            icon={<CirclePlus size={18} />}
            label="كتابة منشور"
          />
          <SidebarItem
            href="/dashboard/edit-post"
            icon={<Pencil size={18} />}
            label="تعديل منشور"
          />
          <SidebarItem
            href="/dashboard/tags"
            icon={<Tags size={18} />}
            label="الأوسمة"
          />
          <SidebarItem
            href="/dashboard/pages"
            icon={<PanelsTopLeft size={18} />}
            label="الصفحات"
          />
        </ul>
      </nav>
    </aside>
  );
}

// A styled sub-component for consistency
function SidebarItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <li>
      <SidebarLink
        href={href}
        className="flex items-center gap-x-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 hover:text-primary group"
      >
        <span className="text-muted-foreground group-hover:text-primary transition-colors">
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </SidebarLink>
    </li>
  );
}
