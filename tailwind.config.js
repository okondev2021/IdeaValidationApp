/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        redbold: "#dd183b",
        redlight:"#fff0eb",
        black001: "#0f172a",
        grayBlue: "#0F172A",
      }
    },
  },
  plugins: [],
}

