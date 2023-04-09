import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    backgroundImage: {
      "header-mobile": "url('/images/mobile/bg-pattern-header.svg')",
      "header-tablet": "url('/images/tablet/bg-pattern-header.svg')",
      "header-desktop": "url('/images/desktop/bg-pattern-header.svg')",
    },
    boxShadow: {
      sm: "0 2px 4px 0 rgba(11, 10, 55, 0.15)",
      lg: "0 8px 20px 0 rgba(18, 16, 99, 0.06)",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      error: "#ff0000",
      black: "#000",
      white: "#fff",
      gray: "#9daec2",
      "light-gray": "#f4f6f8",
      "dark-gray": "#6e8098",
      violet: "#5964e0",
      "light-violet": "#939bf4",
      "very-dark-blue": "#19202d",
      midnight: "#121721",
    },
    fontFamily: {
      kum: '"Kumbh Sans", sans-serif',
    },
    fontSize: {
      body: ["1rem", { lineHeight: "1.625rem" }],
      sm: ["0.875rem", { lineHeight: "1.286rem" }],
      md: ["1.25rem", { lineHeight: "1.2rem" }],
      lg: ["1.5rem", { lineHeight: "1.208rem" }],
      xl: ["1.75rem", { lineHeight: "1.214rem" }],
    },
    screens: {
      tablet: "640px",
      desktop: "1024px",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
