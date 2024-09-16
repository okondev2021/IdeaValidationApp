/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'tab': {'max': '800px'},
      // => @media (max-width: 1030px) { ... }
      'mobile': {'max': '430px'},
      // => @media (max-width: 430px) { ... }
    }, 
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

