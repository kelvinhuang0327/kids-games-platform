/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toddler: {
          primary: '#FF6B9D',
          bg: '#FFF9E6',
        },
        kids: {
          primary: '#4A90E2',
          bg: '#F5F8FF',
        },
      },
    },
  },
  plugins: [],
}
