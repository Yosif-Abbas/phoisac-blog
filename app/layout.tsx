import type { Metadata } from "next";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";

import "./globals.css";
import { Providers } from "@/components/Providers";
import { Suspense } from "react";
import ServerLayoutContent from "@/components/ServerLayoutContent";
import Loading from "@/components/ui/Loading";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.phoisac.online/"),

  title: {
    template: "%s | Phoisac Eldali",
    default: "Phoisac Eldali | مدونة أدبية للشعر والرواية", // Professional default title
  },

  description:
    "مدونة أدبية متخصصة تضم مجموعة فريدة من القصائد الشعرية، والروايات العميقة، والنصوص الإبداعية. استكشف عالم المعاني والكلمات مع الكاتب Phoisac Eldali.",

  keywords: [
    "أدب",
    "رواية",
    "شعر",
    "قصائد",
    "كتابة إبداعية",
    "نصوص أدبية",
    "أدب عربي",
    "Phoisac Eldali",
    "فويزاك الدالي",
  ],

  authors: [{ name: "Phoisac Eldali", url: "https://www.phoisac.online" }],
  creator: "Phoisac Eldali",
  publisher: "Phoisac Eldali",
  category: "Literature",

  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://www.phoisac.online",
    siteName: "Phoisac Eldali",
    title: "Phoisac Eldali | مدونة أدبية",
    description: "اكتشف عالمًا من الأدب، الروايات، والقصائد الشعرية الحصرية.",

    images: [
      {
        url: "/og-image.jpg",
        width: 736,
        height: 736,
        alt: "Phoisac Eldali - مدونة أدبية متخصصة في الشعر والرواية",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Phoisac Eldali | مدونة أدبية",
    description: "اكتشف عالمًا من الأدب، الروايات، والقصائد الشعرية الحصرية.",
    images: ["/og-image.jpg"],
  },

  // other: {
  //   "fb:app_id": "YOUR_FACEBOOK_APP_ID_HERE", // Leave empty or remove if you don't use Facebook Insights
  // },
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
