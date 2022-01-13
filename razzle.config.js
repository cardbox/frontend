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
      },
    },
    'svg-react-component',
  ],
  modifyWebpackConfig({ webpackConfig, env: { dev } }) {
    if (dev) {
      const CRT = path.resolve(__dirname, 'tls', 'cardbox.crt');
      const KEY = path.resolve(__dirname, 'tls', 'cardbox.key');

      let devServer;

      try {
        devServer = {
          http2: true,
          https: true,
          cert: fs.readFileSync(CRT),
          key: fs.readFileSync(KEY),
        };
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.error(
            `\n\n---------\n` +
              `ERROR! No local certificates found in ./tls directory.\n` +
              `Maybe you trying to start application without generating certificates first of all?\n` +
              'You can fix this via running `$ ./scripts/create-certs.sh`, but before read Development section in README.md',
          );
          process.exit(-1);
        }
        throw error;
      }

      webpackConfig.devServer = {
        ...webpackConfig.devServer,
        ...devServer,
      };
    }

    webpackConfig.output.publicPath = webpackConfig.output.publicPath.replace('http://', '//');
    webpackConfig.resolve.alias['@box'] = path.resolve(__dirname, 'src');
    return webpackConfig;
  },
};
