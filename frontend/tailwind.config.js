/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#020617', // Deep background
          800: '#0f172a', // Card background
          700: '#1e293b', // Borders
          accent: '#10b981', // Emerald highlights
        },
        alert: {
          critical: '#ef4444', // Poachers/Weapons
          warning: '#f59e0b', // Unauthorized vehicles
          safe: '#10b981',    // Animals/Normal
        }
      },
    },
  },
  plugins: [],
};