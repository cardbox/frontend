module.exports = {
  purge: ['./src/**/*.tsx', './src/**/*.html', './src/**/*.ts'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      textColor: ['disabled'],
      cursor: ['disabled'],
      borderColor: ['disabled'],
    },
  },
};
