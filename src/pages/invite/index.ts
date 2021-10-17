import { contract, withHatch } from 'framework';

import * as model from './model';
import * as page from './page';

export const InvitePage = withHatch(model.hatch, page.InvitePage);

contract({
  page,
  model,
});
