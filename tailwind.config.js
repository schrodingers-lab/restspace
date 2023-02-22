module.exports = {
  purge: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ww-primary': '#F15A24',
        'ww-secondary':  '#F18F1E'
      },
      backgroundImage: {
        'splash': "url('/img/splash.png')",
        'air': "url('/img/cairns-air.jpg')",
        'cairns1': "url('/img/cairns-1.jpg')",
        'cairns2': "url('/img/cairns-2.jpg')",
        'cairns3': "url('/img/cairns-3.jpg')",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
