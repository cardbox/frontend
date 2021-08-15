import { contract } from '@box/lib/contract';

import * as model from './model';
import * as page from './page';

export { OauthDonePage } from './page';

contract({
  page,
  model,
});
