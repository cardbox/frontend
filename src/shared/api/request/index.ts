import { env } from '@box/shared/config';

export {
  $cookiesForRequests,
  $cookiesFromResponse,
  requestFx,
  setCookiesForRequests,
} from './base';

export type { Answer } from './base';

if (env.BUILD_ON_SERVER) {
  require('./server');
} else {
  require('./client');
}
