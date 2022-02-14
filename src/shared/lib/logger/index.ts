import * as path from 'path';
import Pino, { pino } from 'pino';

import { env } from '@box/shared/config';

let serverLogger: Pino.Logger = global.console as any;
let clientLogger: Pino.Logger;

function createOrInitLogger() {
  if (process.env.BUILD_TARGET === 'client') {
    if (typeof clientLogger === 'undefined') {
      clientLogger = Pino();
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
