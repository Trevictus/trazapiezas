/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", 
  ],
  theme: {
    extend: {
      colors: {
        'industrial-blue': '#045dd1',
        'safety-orange': '#d97707',
        'taller-green': '#28a745',
      }
    },
  },
  plugins: [],
}