import { contract } from '@box/lib/contract';
import { withHatch } from 'framework';

import * as model from './model';
import * as page from './page';

export const OAuthDonePage = withHatch(model.hatch, page.OAuthDonePage);

contract({
  page,
  model,
});
