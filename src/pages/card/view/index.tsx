import { contract, withHatch } from 'framework';

import * as model from './model';
import * as page from './page';

export const CardViewPage = withHatch(model.hatch, page.CardViewPage);

contract({
  page,
  model,
});
