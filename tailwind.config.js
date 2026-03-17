/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,jsx}', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#ef4444',
          hover: '#dc2626',
          light: '#fca5a5',
        },
        surface: {
          900: '#0a0a0a',
          800: '#141414',
          700: '#1a1a1a',
          600: '#222222',
          500: '#2a2a2a',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
