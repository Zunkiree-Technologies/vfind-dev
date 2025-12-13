import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Color System (Manatal-inspired)
      colors: {
        // Primary Blue
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
          DEFAULT: "#3b82f6",
        },
        // Secondary Indigo
        secondary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          DEFAULT: "#6366f1",
        },
        // Gray Scale
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        // Semantic Colors
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          DEFAULT: "#22c55e",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          DEFAULT: "#f59e0b",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          DEFAULT: "#ef4444",
        },
        info: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          DEFAULT: "#06b6d4",
        },
        // Border Colors
        border: {
          light: "#e9eaeb",
          DEFAULT: "#e5e7eb",
          medium: "#d1d5db",
          dark: "#9ca3af",
        },
        // Legacy support
        darkgray: "var(--darkgray)",
        background: "var(--background)",
        "border-line": "var(--border-line)",
        "primary-hover": "var(--primary-hover)",
        "secondary-hover": "var(--secondary-hover)",
      },
      // Font Families
      fontFamily: {
        primary: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        secondary: ["var(--font-open-sans)", "system-ui", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        "open-sans": ["var(--font-open-sans)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        // Legacy support
        heading: ["var(--font-montserrat)", "var(--font-heading-family)"],
        title: ["var(--font-montserrat)", "var(--font-title-family)"],
        paragraph: ["var(--font-open-sans)", "var(--font-paragraph-family)"],
        subtext: ["var(--font-open-sans)", "var(--font-subtext-family)"],
      },
      // Font Sizes
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }], // 10px
        xs: ["0.75rem", { lineHeight: "1rem" }],         // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }],     // 14px
        base: ["1rem", { lineHeight: "1.5rem" }],        // 16px
        lg: ["1.125rem", { lineHeight: "1.75rem" }],     // 18px
        xl: ["1.25rem", { lineHeight: "1.75rem" }],      // 20px
        "2xl": ["1.5rem", { lineHeight: "2rem" }],       // 24px
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],  // 30px
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],    // 36px
        "5xl": ["3rem", { lineHeight: "1.2" }],          // 48px
        "6xl": ["3.75rem", { lineHeight: "1.1" }],       // 60px
        "7xl": ["4.5rem", { lineHeight: "1.1" }],        // 72px
        // Legacy support
        heading: "var(--font-heading-size)",
        title: "var(--font-title-size)",
        paragraph: "var(--font-paragraph-size)",
        subtext: "var(--font-subtext-size)",
      },
      // Spacing (8-point grid)
      spacing: {
        "0.5": "0.125rem",  // 2px
        "1": "0.25rem",     // 4px
        "1.5": "0.375rem",  // 6px
        "2": "0.5rem",      // 8px
        "2.5": "0.625rem",  // 10px
        "3": "0.75rem",     // 12px
        "3.5": "0.875rem",  // 14px
        "4": "1rem",        // 16px
        "5": "1.25rem",     // 20px
        "6": "1.5rem",      // 24px
        "7": "1.75rem",     // 28px
        "8": "2rem",        // 32px
        "9": "2.25rem",     // 36px
        "10": "2.5rem",     // 40px
        "11": "2.75rem",    // 44px
        "12": "3rem",       // 48px
        "14": "3.5rem",     // 56px
        "16": "4rem",       // 64px
        "18": "4.5rem",     // 72px
        "20": "5rem",       // 80px
        "24": "6rem",       // 96px
        "28": "7rem",       // 112px
        "32": "8rem",       // 128px
      },
      // Border Radius
      borderRadius: {
        none: "0",
        sm: "0.125rem",     // 2px
        DEFAULT: "0.25rem", // 4px
        md: "0.375rem",     // 6px
        lg: "0.5rem",       // 8px
        xl: "0.75rem",      // 12px
        "2xl": "1rem",      // 16px
        "3xl": "1.5rem",    // 24px
        full: "9999px",
      },
      // Box Shadow
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        // Custom shadows
        card: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)",
        "primary": "0 4px 14px 0 rgba(59, 130, 246, 0.25)",
        "primary-lg": "0 10px 25px 0 rgba(59, 130, 246, 0.3)",
      },
      // Legacy font weights
      fontWeight: {
        heading: "var(--font-heading-weight)",
        title: "var(--font-title-weight)",
        paragraph: "var(--font-paragraph-weight)",
        subtext: "var(--font-subtext-weight)",
      },
      // Legacy line heights
      lineHeight: {
        heading: "var(--font-heading-line-height)",
        title: "var(--font-title-line-height)",
        paragraph: "var(--font-paragraph-line-height)",
        subtext: "var(--font-subtext-line-height)",
      },
      // Animations
      keyframes: {
        dash: {
          "72.5%": { opacity: "0" },
          "100%": { strokeDashoffset: "0" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        dash: "dash 1.4s linear infinite",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out forwards",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        spin: "spin 1s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      // Transition
      transitionDuration: {
        "75": "75ms",
        "100": "100ms",
        "150": "150ms",
        "200": "200ms",
        "300": "300ms",
        "500": "500ms",
      },
    },
  },
  plugins: [],
};

export default config;
