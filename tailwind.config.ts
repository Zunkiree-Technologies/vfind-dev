import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enables class-based dark mode
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        secondary: "var(--secondary)",
        "secondary-hover": "var(--secondary-hover)",
        darkgray: "var(--darkgray)",
        gray: "var(--background-gray)",
        background: "var(--background)",
        border: "var(--border)",
        "border-line": "var(--border-line)",
        hover: "var(--primary-hover)",
      },
      fontFamily: {
        heading: ["var(--font-heading-family)"],
        title: ["var(--font-title-family)"],
        paragraph: ["var(--font-paragraph-family)"],
        subtext: ["var(--font-subtext-family)"],
      },
      fontSize: {
        heading: "var(--font-heading-size)",
        title: "var(--font-title-size)",
        paragraph: "var(--font-paragraph-size)",
        subtext: "var(--font-subtext-size)",
      },
      fontWeight: {
        heading: "var(--font-heading-weight)",
        title: "var(--font-title-weight)",
        paragraph: "var(--font-paragraph-weight)",
        subtext: "var(--font-subtext-weight)",
      },
      lineHeight: {
        heading: "var(--font-heading-line-height)",
        title: "var(--font-title-line-height)",
        paragraph: "var(--font-paragraph-line-height)",
        subtext: "var(--font-subtext-line-height)",
      },
      keyframes: {
        dash: {
          "72.5%": { opacity: "0" },
          "100%": { strokeDashoffset: "0" },
        },
        "slide-in-left": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0"
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1"
          },
        },
        "slide-in-right": {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0"
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1"
          },
        },
      },
      animation: {
        dash: "dash 1.4s linear infinite",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
