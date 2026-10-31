/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F8F5',
        primary: {
          DEFAULT: '#246B50',
          hover: '#1B543E',
          light: '#DDEBE2',
          subtle: '#EDF5F0',
        },
        charcoal: {
          DEFAULT: '#202A25',
          muted: '#747D76',
          light: '#9EABA1',
        },
        borderSoft: '#E4E8E2',
        surface: '#FFFFFF',
        accent: {
          DEFAULT: '#C77A45',
          light: '#F8EDE5',
        },
        warning: {
          DEFAULT: '#B87936',
          light: '#F9F1E6',
        },
        danger: {
          DEFAULT: '#B94D45',
          light: '#FCEBEA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(32, 42, 37, 0.05), 0 1px 2px rgba(32, 42, 37, 0.03)',
        floating: '0 4px 12px rgba(32, 42, 37, 0.08)',
      }
    },
  },
  plugins: [],
}
