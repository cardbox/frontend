import type { FastifyInstance } from 'fastify';
import type { Http2Server } from 'http2';

// this require is necessary for server HMR to recover from error
let server: FastifyInstance<Http2Server> =
  require('./app/server').fastifyInstance;

const PORT = Number.parseInt(process.env.PORT ?? '3005', 10);

server.listen(PORT, '0.0.0.0').catch(console.error);

if (module.hot) {
  console.info('✅  Server-side HMR Enabled!');
  module.hot.accept('./app/server', () => {
    console.info('🔁  HMR Reloading `./app/server`...');

    try {
      server.close(() => {
        server = require('./app/server').fastifyInstance;

        server.listen(PORT, '0.0.0.0').catch(console.error);
      });
    } catch (error) {
      console.error(error);
    }
  });
}
