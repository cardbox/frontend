import type { FastifyInstance } from 'fastify';
import type { Http2Server } from 'http2';

// this require is necessary for server HMR to recover from error
let server: FastifyInstance<Http2Server> =
  require('./app/server').fastifyInstance;

if (module.hot) {
  module.hot.accept('./app/server', () => {
    console.info('🔁  HMR Reloading `./app/server`...');
    try {
      server = require('./app/server').server;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

const PORT = Number.parseInt(process.env.PORT ?? '3005', 10);

server.listen(PORT, '0.0.0.0').catch(console.error);

const httpServer = server;

export default httpServer;
