"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import LoginModal from "../Modal/LoginModal";
import ThemeButton from "./ThemeButton";
import Logout from "./Logout";
import Logo from "../Logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useCurrentUser();
  const pathname = usePathname();

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المدونة", href: "/blog" },
    { name: "فويزاك", href: "/about" },
  ];

  const adminLinks = [
    { name: "لوحة التحكم", href: "/dashboard" },
    { name: "كتابة منشور", href: "/dashboard/create-post" },
    { name: "تعديل منشور", href: "/dashboard/edit-post" },
    { name: "الشعارات", href: "/dashboard/tags" },
    { name: "الصفحات", href: "/dashboard/pages" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-4 z-50 w-full px-4 md:px-6">
      <div className="max-w-[1440px] mx-auto bg-container/80 backdrop-blur-md border border-[#E5E7EB] dark:border-[#1F2937] shadow-lg rounded-2xl h-16 px-6 flex items-center justify-between">
        {/* Left Side: Logo & Desktop Nav */}
        <div className="flex items-center gap-x-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-x-6">
            <ul className="hidden md:flex items-center gap-x-6 ">
              {navLinks.map((link) => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(link.href)
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-x-3">
          <div className="hidden md:flex items-center gap-x-3 border-r border-gray-700/20 pr-3 mr-3">
            <ThemeButton />
            {isAuthenticated ? <Logout /> : <LoginModal title="تسجيل الدخول" />}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 hover:bg-white/5 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-container border-b border-[#1F2937] p-6 flex flex-col gap-y-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg ${isActive(link.href) ? "text-primary" : ""}`}
            >
              {link.name}
            </Link>
          ))}

          <hr className="border-[#1F2937]" />

          {isAdmin &&
            adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg text-muted-foreground"
              >
                {link.name}
              </Link>
            ))}

          <div className="flex items-center justify-between pt-4">
            <ThemeButton />
            {isAuthenticated ? <Logout /> : <LoginModal title="تسجيل الدخول" />}
          </div>
        </div>
      )}
    </header>
  );
}
