import { contract } from '@effector/contract';

import * as model from './model';
import * as page from './page';

export { HomePage } from './page';

contract({
  page,
  model,
});
