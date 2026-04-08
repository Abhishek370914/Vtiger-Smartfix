/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0658D4",
          foreground: "#FFFFFF",
        },
        border: "hsl(var(--border, 214.3 31.8% 91.4%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222.2 84% 4.9%))",
        success: {
          DEFAULT: "#00C853",
          foreground: "#FFFFFF",
        },
        neutral: {
          DEFAULT: "#F8F9FA",
          foreground: "#212529",
        },
        accent: {
          DEFAULT: "#FFC107",
          foreground: "#212529",
        },
        secondary: {
          DEFAULT: "#6C757D",
          foreground: "#FFFFFF",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
