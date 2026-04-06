"use client";

import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function CustomThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const options = [
    { label: "فـــاتـــح", value: "light", icon: <Sun size={16} /> },
    { label: "داكـــــن", value: "dark", icon: <Moon size={16} /> },
    { label: "نظام الجهاز", value: "system", icon: <Monitor size={16} /> },
  ];

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentLabel = options.find((o) => o.value === theme)?.label;
  const currentIcon = options.find((o) => o.value === theme)?.icon;

  return (
    <div className="relative inline-block">
      {/* <span className="text-xs ">المظهر</span> */}
      <button
        onClick={() => setOpen(!open)}
        className="h-9 px-3 text-sm bg-container text-muted border border-card-hover rounded-md flex items-center justify-between gap-2 hover:bg-card-hover hover:text-primary transition"
      >
        <span className="flex items-center gap-x-2">
          {currentIcon} {currentLabel}
        </span>
        <ChevronDown
          size={14}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-[140px] bg-container border border-card-hover rounded-md shadow-lg z-10">
          {options.map((o) => (
            <li
              key={o.value}
              className={` px-3 py-2 text-sm flex items-center gap-2 cursor-pointer  text-muted hover:bg-card-hover hover:text-foreground transition ${theme === o.value ? "bg-card-hover text-foreground" : ""}`}
              onClick={() => {
                setTheme(o.value);
                setOpen(false);
              }}
            >
              {o.icon} {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
