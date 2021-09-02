import type { FastifyInstance } from 'fastify';
import type { Http2Server } from 'http2';
import { logger } from '@box/lib/logger';

// this require is necessary for server HMR to recover from error
let server: FastifyInstance<Http2Server> =
  require('./app/server').fastifyInstance;

process.on('unhandledRejection', (error) => {
  // Will print "unhandledRejection err is not defined"
  logger.fatal(
    {
      error: String(error),
      message: error?.['message'],
      stack: error?.['stack'],
    },
    'unhandledRejection',
  );
});

const PORT = Number.parseInt(process.env.PORT ?? '3005', 10);

server.listen(PORT, '0.0.0.0').catch(logger.error);

if (module.hot) {
  logger.info('✅  Server-side HMR Enabled!');
  module.hot.accept('./app/server', () => {
    logger.info('🔁  HMR Reloading `./app/server`...');

    try {
      server.close(() => {
        server = require('./app/server').fastifyInstance;

        server.listen(PORT, '0.0.0.0').catch(logger.error);
      });
    } catch (error) {
      logger.error(error);
    }
  });
}
