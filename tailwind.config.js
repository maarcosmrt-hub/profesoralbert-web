// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // No dependemos de oscuro, pero dejamos 'class' por si en el futuro lo quieres reactivar
  darkMode: 'class',
  content: [
    './public/index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
};
