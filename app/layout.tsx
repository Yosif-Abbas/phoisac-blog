import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Geist } from "next/font/google";

import RootProviders from "@/components/RootProviders";

import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    template: "Phoisac | %s",
    default: "Phoisac",
  },
};

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={`${geist.className} antialiased bg-background`}
      >
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
