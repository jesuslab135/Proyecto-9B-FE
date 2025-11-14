/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vibrant-teal': '#00C4B4',
        'forest-green': '#2E7BD2',
        'sky-blue': '#81D4FA',
        'lime-green': '#A7FFEB',
        'soft-gray': '#ECEFF1',
        'dark-slate': '#263238',
      },
    },
  },
  plugins: [],
}
