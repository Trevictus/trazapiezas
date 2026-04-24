/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", 
  ],
  theme: {
    extend: {
      colors: {
        // Aquí hay que añadir los colores de Figma para tenerlos siempre a mano
        'industrial-blue': '#007bff',
        'safety-orange': '#ff8c00',
        'taller-green': '#28a745',
      }
    },
  },
  plugins: [],
}