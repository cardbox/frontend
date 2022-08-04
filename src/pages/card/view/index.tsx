import { contract } from 'framework';

import * as model from './model';
import * as page from './page';

export { CardViewPage } from './page';

contract({
  page,
  model,
});
