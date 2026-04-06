import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",

        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          hover: "rgb(var(--card-hover) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
          active: "rgb(var(--card-active) / <alpha-value>)",
          border: "rgb(var(--card-border) / <alpha-value>)",
        },

        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          border: "rgb(var(--popover-foreground) / <alpha-value>)",
        },

        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          active: "rgb(var(--primary-active) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },

        tag: {
          DEFAULT: "rgb(var(--tag) / <alpha-value>)",
          foreground: "rgb(var(--tag-foreground) / <alpha-value>)",
          border: "rgb(var(--tag-border) / <alpha-value>)",
          hover: "rgb(var(--tag-hover) / <alpha-value>)",
          active: "rgb(var(--tag-active) / <alpha-value>)",
        },

        container: {
          DEFAULT: "rgb(var(--container) / <alpha-value>)",
        },

        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },

        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },

        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },

        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
          hover: "rgb(var(--destructive-hover) / <alpha-value>)",
          active: "rgb(var(--destructive-active) / <alpha-value>)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-amiri)", "serif"],
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
} satisfies Config;
