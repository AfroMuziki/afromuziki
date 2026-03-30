/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0D1E38",
          dark: "#070F1E",
          light: "#1A2840",
        },
        gold: {
          DEFAULT: "#D4A843",
          light: "#F0C866",
          dark: "#B8912E",
        },
        cream: "#F0EAD6",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
