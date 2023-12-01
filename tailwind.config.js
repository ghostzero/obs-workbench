/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/renderer/index.html',
    './src/renderer/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E91E63',
          50: '#F9C5D7',
          100: '#F8B3CA',
          200: '#F48DB0',
          300: '#F06897',
          400: '#ED437D',
          500: '#E91E63',
          600: '#CF1454',
          700: '#AF1147',
          800: '#8E0E39',
          900: '#6D0B2C',
          950: '#5D0926'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
