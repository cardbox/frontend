import express from 'express';

// this require is necessary for server HMR to recover from error
let app = require('./server').server;

if (module.hot) {
  module.hot.accept('./server', () => {
    console.info('🔁  HMR Reloading `./server`...');
    try {
      app = require('./server').server;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const port = Number.parseInt(process.env.PORT ?? '3000', 10);

const server = express()
  .use((req, res) => app.handle(req, res))
  .listen(port, (error: Error | undefined) => {
    if (error) {
      console.error(error);
      return;
    }
    console.info(`> Started on port ${port}`);
  });

export default server;
