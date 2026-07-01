import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        itqan: {
          50: "#eefbf4",
          100: "#d6f5e3",
          200: "#b0eacb",
          300: "#7dd8ac",
          400: "#45bd88",
          500: "#1fa16b",
          600: "#128155",
          700: "#0f6746",
          800: "#0f523a",
          900: "#0d4331",
          950: "#05261c",
        },
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "serif"],
        urdu: ["var(--font-urdu)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
