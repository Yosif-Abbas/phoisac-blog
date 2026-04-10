import type { Metadata } from "next";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/Providers";
import { Suspense } from "react";
import ServerLayoutContent from "@/components/ServerLayoutContent";
import Loading from "@/components/ui/Loading";

export const metadata: Metadata = {
  metadataBase: new URL("https://phoisac-blog.vercel.app"), // CRITICAL for relative image paths
  title: {
    template: "%s | Phoisac Eldali",
    default: "Phoisac Eldali | مدونة أدبية", // Added a descriptor
  },
  description:
    "اكتشف عالمًا من الأدب، الروايات، والقصائد الشعرية في مدونة Phoisac Eldali.",
  keywords: ["أدب", "رواية", "شعر", "كتابة", "Phoisac Eldali"],
  authors: [{ name: "Phoisac Eldali" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://phoisac-blog.vercel.app",
    siteName: "Phoisac Eldali",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Phoisac Eldali Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phoisac Eldali",
    description: "مدونة أدبية متخصصة في الشعر والرواية.",
    images: ["/og-image.png"],
  },
};

const IBMPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-sans",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${IBMPlexSansArabic.variable} ${amiri.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground min-h-dvh flex flex-col">
        <Suspense fallback={<Loading />}>
          <Providers>
            <ServerLayoutContent>{children}</ServerLayoutContent>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
