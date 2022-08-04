import { contract } from '@effector/contract';

import * as model from './model';
import * as page from './page';

export { UserPage } from './page';

contract({
  model,
  page,
});
