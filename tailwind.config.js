/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        diamax: {
          dark: '#020617',
          night: '#060D1F',
          orange: '#F26522',
          gold: '#FFC72C',
          cyan: '#00D2FF',
          card: 'rgba(6, 13, 31, 0.85)',
          neon: '#00F59B',
          amber: '#F59E0B',
          crimson: '#EF4444',
          border: 'rgba(255, 255, 255, 0.12)'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
