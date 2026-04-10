import Image from "next/image";
import Link from "next/link";
interface Props {
  className?: string;
}
export default function Logo({ className }: Props) {
  return (
    <Link
      href="/"
      className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center ${className}`}
    >
      <Image
        src="/phoisac.jpeg"
        alt="User Icon"
        width={1000}
        height={1000}
        loading="eager"
        className="object-cover w-full h-full"
      />
    </Link>
  );
}
