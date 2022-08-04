import 'dotenv/config';
import type { FastifyInstance } from 'fastify';
import type { Server } from 'http';

import { env } from '@box/shared/config';
import { logger } from '@box/shared/lib/logger';

import * as app from './app/server';

require('./app/opentelemetry/instrumentations');
require('./app/opentelemetry/config');

// this require is necessary for server HMR to recover from error
let server: FastifyInstance<Server> = app.fastifyInstance;

process.on('unhandledRejection', (error: any) => {
  // Will print "unhandledRejection err is not defined"
  logger.fatal(
    {
      error: String(error),
      message: error?.message,
      stack: error?.stack,
    },
    'unhandledRejection',
  );
});

server
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .catch(logger.error);

if (module.hot) {
  logger.info('✅  Server-side HMR Enabled!');
  module.hot.accept('./app/server', () => {
    logger.info('🔁  HMR Reloading `./app/server`...');

    try {
      server.close(() => {
        server = require('./app/server').fastifyInstance;

        server
          .listen({
            host: '0.0.0.0',
            port: env.PORT,
          })
          .catch(logger.error);
      });
    } catch (error) {
      logger.error(error as any);
    }
  });
}
