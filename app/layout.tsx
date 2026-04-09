import type { Metadata } from "next";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/Providers";
import { Suspense } from "react";
import ServerLayoutContent from "@/components/ServerLayoutContent";
import Loading from "@/components/ui/Loading";

export const metadata: Metadata = {
  title: {
    template: "%s | Phoisac Eldali",
    default: "Phoisac Eldali",
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
