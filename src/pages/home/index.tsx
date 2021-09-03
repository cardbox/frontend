import { contract, withHatch } from '@box/framework/src';

import * as model from './model';
import * as page from './page';

export const HomePage = withHatch(model.hatch, page.HomePage);

contract({
  page,
  model,
});
