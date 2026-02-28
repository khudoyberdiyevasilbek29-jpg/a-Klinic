import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        surface: "#020617",
        surfaceElevated: "#020617",
        accent: "#22c55e",
        accentSoft: "#16a34a",
        muted: "#64748b",
        border: "#1e293b"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.85)"
      },
      borderRadius: {
        "2xl": "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;

