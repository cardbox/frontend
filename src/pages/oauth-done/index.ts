import { contract } from 'framework';

import * as model from './model';
import * as page from './page';

export { OAuthDonePage } from './page';

contract({
  page,
  model,
});
