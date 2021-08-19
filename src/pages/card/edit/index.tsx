import { contract, withHatch } from 'framework';

import * as model from './model';
import * as page from './page';

export const CardEditPage = withHatch(model.hatch, page.CardEditPage);

contract({
  page,
  model,
});
