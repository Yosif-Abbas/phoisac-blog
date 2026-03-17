import type Metadata from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";

import RootProviders from "@/components/RootProviders";

import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    template: "Phoisac | %s",
    default: "Phoisac",
  },
};

const IBMPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={cn("font-sans", IBMPlexSansArabic.variable)}
    >
      <body
        className={`${IBMPlexSansArabic.className} antialiased bg-background`}
      >
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
