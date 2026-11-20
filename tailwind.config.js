/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F6F3EE',
        surface: '#FFFFFF',
        ink: '#111111',
        muted: '#6B6B6B',
        denim: '#1F3A5F',
        'denim-deep': '#0B1220',
        gold: '#C8A96A',
        line: '#E4DFD6',
        success: '#2E7D4F',
        danger: '#B3261E',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        btn: '999px',
        input: '14px',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(17,17,17,0.08)',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};