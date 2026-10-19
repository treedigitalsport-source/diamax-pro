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
          dark: '#030712',
          card: 'rgba(15, 23, 42, 0.85)',
          neon: '#00F59B',
          cyan: '#00D2FF',
          amber: '#F59E0B',
          crimson: '#EF4444',
          gold: '#FFD700',
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
