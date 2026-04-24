/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: '#f4fbff',
          100: '#dff4ff',
          200: '#b6e9ff',
          300: '#7ad8ff',
          400: '#38c0ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        clinical: '0 24px 80px rgba(14, 165, 233, 0.16)',
      },
    },
  },
  plugins: [],
}
