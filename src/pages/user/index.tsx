import { contract, withHatch } from 'framework';

import * as model from './model';
import * as page from './page';

export const UserPage = withHatch(model.hatch, page.UserPage);

contract({
  model,
  page,
});
