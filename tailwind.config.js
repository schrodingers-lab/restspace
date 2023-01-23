module.exports = {
  purge: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'ww-primary': '#F15A24',
        'ww-secondary':  '#F18F1E'
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
