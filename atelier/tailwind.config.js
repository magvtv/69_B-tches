/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d4af37',
          light: '#e6c76a',
          dark: '#a38629',
        },
        secondary: {
          DEFAULT: '#8b4513',
          light: '#a05a2c',
          dark: '#6a340f',
        },
        accent: {
          DEFAULT: '#b87333',
          light: '#d08c4d',
          dark: '#8c5727',
        },
        background: {
          primary: '#121212',
          secondary: '#1e1e1e',
          tertiary: '#2a2a2a',
          highlight: '#3a3a3a',
        },
        border: {
          DEFAULT: '#3a3a3a',
          light: '#4a4a4a',
          accent: '#d4af37',
        },
        text: {
          DEFAULT: '#f5f5f5',
          muted: '#a0a0a0',
          dark: '#666666',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        body: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'renaissance': '0 10px 30px rgba(0, 0, 0, 0.5)',
        'renaissance-lg': '0 15px 40px rgba(0, 0, 0, 0.8)',
        'gold': '0 0 8px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [],
} 