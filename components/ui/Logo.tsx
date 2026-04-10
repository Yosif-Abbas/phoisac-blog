import Image from "next/image";
import Link from "next/link";

interface Props {
  className?: string;
}

export default function Logo({ className }: Props) {
  return (
    <Link
      href="/"
      // Added a slight transition for a professional feel
      className={`relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center hover:opacity-90 transition-opacity ${className}`}
    >
      <Image
        src="/phoisac.jpeg"
        alt="Phoisac Eldali Logo"
        width={96}
        height={96}
        priority
        quality={80}
        className="object-cover w-full h-full"
      />
    </Link>
  );
}
