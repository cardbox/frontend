import { contract } from '@effector/contract';

import * as model from './model';
import * as page from './page';

contract({ page, model });

export { SearchPage } from './page';
