/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor:'#18a058',
        fourCornerColor: '#f87171'
      }
    },
  },
  plugins: [],
}