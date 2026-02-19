export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          900: '#811B12',
          800: '#5B291F',
          700: '#835B4C',
          600: '#C6694B',
          500: '#AD907D',
          400: '#DBA78D',
          300: '#EFCE9C',
          200: '#E7D3C7',
          100: '#FBF7F6',
        },
        neutralui: {
          900: '#000000',
          800: '#1E1E1E',
          100: '#FEFEFE',
        },
      }
    },
  },
  plugins: [],
}
