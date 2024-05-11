module.exports = {
  purge: [],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ['dark'],
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
