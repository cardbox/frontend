import * as path from 'path';
import P, { pino } from 'pino';
import { env } from '@box/shared/config';

import Logger = P.Logger;

let serverLogger: Logger;
let clientLogger: Logger;

function createOrInitLogger() {
  const isClient = typeof window !== 'undefined';

  if (isClient) {
    if (typeof clientLogger === 'undefined') {
      clientLogger = P();
    }
    return clientLogger;
  }
  if (typeof serverLogger === 'undefined') {
    const transport = pino.transport({
      target: path.resolve(__dirname, '..', 'worker', 'transport.mjs'),
    });

    serverLogger = pino({
      level: env.LOG_LEVEL,
      write: transport.write,
    });
  }

  return serverLogger;
}

export const logger = createOrInitLogger();
