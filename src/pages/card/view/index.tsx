import { contract, withHatch } from '@box/framework/src';

import * as model from './model';
import * as page from './page';

export const CardViewPage = withHatch(model.hatch, page.CardViewPage);

contract({
  page,
  model,
});
