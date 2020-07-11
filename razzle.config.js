const path = require('path');

module.exports = {
  plugins: [
    {
      name: 'typescript',
      options: {
        useBabel: true,
        forkTsChecker: {
          tslint: false,
        },
      },
    },
  ],
  modify(config) {
    config.resolve.modules.unshift(path.resolve(__dirname, 'src'));
    return config;
  },
};
