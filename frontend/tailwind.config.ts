import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff"
        },
        accent: {
          DEFAULT: "#f97316",
          foreground: "#0f172a"
        }
      },
      boxShadow: {
        soft: "0 20px 25px -15px rgba(15,23,42,0.25)"
      }
    }
  },
  plugins: []
};

export default config;

