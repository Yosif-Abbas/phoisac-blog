"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { useState, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  // Ensure the query client is only created once per user session
  const [queryClient] = useState(() => new QueryClient());

  const pathname = usePathname();

  // Determine the active "Theme" based on the URL
  let themeClass = "";

  if (pathname.includes("/dashboard/edit-post")) {
    themeClass = "theme-edit";
  } else if (pathname.startsWith("/dashboard")) {
    themeClass = "theme-admin";
  }
  // If it's a normal visitor page (like /blog), themeClass stays empty,
  // which uses your default colors!

  return (
    <main
      className={`min-h-dvh flex flex-col bg-background text-foreground transition-colors duration-500 ${themeClass}`}
    >
      <QueryClientProvider client={queryClient}>
        <NextTopLoader showSpinner={false} color="#4f46e5" />
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        <Toaster
          position="top-center" // bottom-center or top-center usually looks best for blogs
          toastOptions={{
            // Global styles for all toasts
            style: {
              background: "rgb(var(--container))",
              color: "rgb(var(--foreground))",
              border: "1px solid rgb(var(--border))",
              boxShadow:
                "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              borderRadius: "1rem", // 16px - matches your rounded-xl buttons
              padding: "16px",
              fontFamily: "inherit", // Ensures it uses your Arabic font (e.g., Cairo, Tajawal)
            },
            // Optional: Customizing default success/error icons
            success: {
              iconTheme: {
                primary: "rgb(var(--accent))",
                secondary: "rgb(var(--accent-foreground))",
              },
            },
            error: {
              iconTheme: {
                primary: "rgb(var(--destructive))",
                secondary: "rgb(var(--destructive-foreground))",
              },
            },
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </main>
  );
}
