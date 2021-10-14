// // NOTE: Uncomment if need
// /**
//  * Getting env-var
//  * @throwable
//  */
// const getEnvVar = (key: string) => {
//   if (process.env[key] === undefined) {
//     throw new Error(`Env variable ${key} is required`);
//   }
//   return process.env[key]!;
// };
// // Usage:
// export const SESSION_TOKEN = getEnvVar('RAZZLE_SESSION_TOKEN');

// Default vars
export const BUILD_TARGET = process.env.BUILD_TARGET!;
export const BUILD_ON_CLIENT = BUILD_TARGET === 'client';
export const BUILD_ON_SERVER = BUILD_TARGET === 'server';

export const PORT = Number.parseInt(process.env.PORT ?? '3005', 10);
export const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';
export const IS_DEBUG = Boolean(process.env.DEBUG);

export const NODE_ENV = process.env.NODE_ENV!;
export const IS_DEV_ENV = NODE_ENV === 'development';
export const IS_PROD_ENV = NODE_ENV === 'production';

// Custom vars
export const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:9008';
export const SESSION_TOKEN = process.env.RAZZLE_SESSION_TOKEN;

export const CLIENT_BACKEND_URL =
  process.env.CLIENT_BACKEND_URL ?? '/api/internal';
export const TLS_CERT_FILE = process.env.TLS_CERT_FILE!;
export const TLS_KEY_FILE = process.env.TLS_KEY_FILE!;
export const RAZZLE_PUBLIC_DIR = process.env.RAZZLE_PUBLIC_DIR!;
export const USE_SSL = process.env.USE_SSL === 'true';
