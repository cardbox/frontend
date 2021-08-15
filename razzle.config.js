const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

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
    config.output.publicPath = config.output.publicPath.replace(
      'http://',
      '//',
    );
    config.resolve.alias['@box'] = path.resolve(__dirname, 'src');
    return config;
  },
};
