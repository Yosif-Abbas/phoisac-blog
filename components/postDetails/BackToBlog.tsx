import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function BackToBlog() {
  return (
    <Link
      href="/blog"
      className="group flex items-center gap-x-1 text-muted-foreground hover:text-primary transition-colors text-sm  w-fit"
    >
      <ChevronRight
        size={16}
        className="transition-transform group-hover:translate-x-1"
      />
      <span>العودة للمدونة</span>
    </Link>
  );
}
