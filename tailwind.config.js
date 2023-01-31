module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './src/**/*.{html,js}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    fontFamily: {
      sans: ['"Quicksand"', 'sans-serif']
    },
    extend: {
      fontFamily: {
        "Quicksand": ['Quicksand', 'sans-serif']
      },
      colors: {
        golden: "#c39e53",
        "dark-blue": "#143a5f"
      }
    },
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
