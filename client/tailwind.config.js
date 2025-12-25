/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aurapurple': '#8B5CF6',
        'aurapink': '#EC4899',
        'aurablue': '#3B82F6',
        'auragreen': '#10B981',
      }
    },
  },
  plugins: [],
}