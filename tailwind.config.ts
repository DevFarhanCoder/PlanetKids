import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PlanetKids Brand Colors
        primary: {
          DEFAULT: '#6C63FF',
          50: '#F5F4FF',
          100: '#EEEDFF',
          200: '#D4D1FF',
          300: '#BAB5FF',
          400: '#A099FF',
          500: '#6C63FF',
          600: '#4D42F5',
          700: '#3830D9',
          800: '#2823A3',
          900: '#1C1874',
        },
        secondary: {
          DEFAULT: '#FF6B9D',
          50: '#FFF0F5',
          100: '#FFE0EB',
          200: '#FFC2D7',
          300: '#FFA3C3',
          400: '#FF84AF',
          500: '#FF6B9D',
          600: '#FF4081',
          700: '#F5006F',
          800: '#C70059',
          900: '#990044',
        },
        accent: {
          DEFAULT: '#FFB800',
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#FFB800',
          600: '#E6A600',
          700: '#B38200',
          800: '#805E00',
          900: '#4D3800',
        },
        success: {
          DEFAULT: '#00D9A3',
          50: '#E6FFF8',
          100: '#CCFFF1',
          200: '#99FFE3',
          300: '#66FFD5',
          400: '#33FFC7',
          500: '#00D9A3',
          600: '#00B389',
          700: '#008D6F',
          800: '#006655',
          900: '#00403B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
