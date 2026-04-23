import { getSiteSettings } from "@/services/server/settings";
import Image from "next/image";
import Link from "next/link";

interface Props {
  className?: string;
}

export default async function Logo({ className }: Props) {
  const { icon_image_url } = await getSiteSettings();

  const url = icon_image_url ? icon_image_url : "/logo.jpeg";

  return (
    <Link
      href="/"
      // Added a slight transition for a professional feel
      className={`relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity ${className}`}
    >
      <Image
        src={url}
        alt="Phoisac Eldali Logo"
        width={96}
        height={96}
        priority
        loading="eager"
        quality={80}
        className="object-cover w-full h-full"
      />
    </Link>
  );
}
