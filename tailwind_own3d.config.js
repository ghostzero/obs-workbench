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
          DEFAULT: '#FF9602',
          50: '#FFE2BA',
          100: '#FFDAA5',
          200: '#FFC97C',
          300: '#FFB854',
          400: '#FFA72B',
          500: '#FF9602',
          600: '#C97600',
          700: '#915500',
          800: '#593400',
          900: '#211300',
          950: '#050300'
        },
        zinc: {
          DEFAULT: '#435867',
          50: '#AEBFCA',
          100: '#A0B4C1',
          200: '#849DAF',
          300: '#69879D',
          400: '#557083',
          500: '#435867',
          600: '#374854',
          700: '#1c2328',
          800: '#181e23',
          900: '#13191D',
          950: '#0D1114'
        },
        zinc2: {
          DEFAULT: '#18181B',
          50: '#D6D6DB',
          100: '#C9C9CF',
          200: '#AEAEB7',
          300: '#93939F',
          400: '#787887',
          500: '#60606C',
          600: '#484851',
          700: '#303036',
          800: '#18181B',
          900: '#111113',
          950: '#0D0D0F'
        },
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
