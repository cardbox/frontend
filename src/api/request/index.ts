export { $cookiesForRequest, $cookiesFromResponse, requestFx, setCookiesForRequest } from './base';

export type { Answer } from './base';

if (process.env.BUILD_TARGET === 'server') {
  require('./server');
} else {
  require('./client');
}
