import tailwindAnimate from "tailwindcss-animate";

const config = {
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
        keyframes: {
          slowPulse: {
            "0%, 100%": { opacity: "0.4" },
            "50%": { opacity: "0.7" },
          },
        },
        animation: {
          "slow-pulse": "slowPulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        },
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

        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",

        chart: {
          "1": "rgb(var(--chart-1) / <alpha-value>)",
          "2": "rgb(var(--chart-2) / <alpha-value>)",
          "3": "rgb(var(--chart-3) / <alpha-value>)",
          "4": "rgb(var(--chart-4) / <alpha-value>)",
          "5": "rgb(var(--chart-5) / <alpha-value>)",
        },
      },

      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-amiri)", "serif"],
      },
    },
  },

  plugins: [tailwindAnimate],
};

export default config;
