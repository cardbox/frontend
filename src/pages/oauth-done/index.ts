import { withHatch } from 'framework';

import { contract } from '@box/shared/lib/contract';

import * as model from './model';
import * as page from './page';

export const OAuthDonePage = withHatch(model.hatch, page.OAuthDonePage);

contract({
  page,
  model,
});
