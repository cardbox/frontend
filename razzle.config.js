const path = require('path');
const fs = require('fs');

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
  modify(config, { dev }) {
    if (dev) {
      const CRT = path.resolve(__dirname, 'tls', 'cardbox.crt');
      const KEY = path.resolve(__dirname, 'tls', 'cardbox.key');

      const devServer = {
        http2: true,
        https: true,
        cert: fs.readFileSync(CRT),
        key: fs.readFileSync(KEY),
      };

      config.devServer = {
        ...config.devServer,
        ...devServer,
      };
    }

    config.output.publicPath = config.output.publicPath.replace(
      'http://',
      '//',
    );
    config.resolve.alias['@cardbox'] = path.resolve(__dirname, 'src');
    return config;
  },
};
