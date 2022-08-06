import { contract } from '@effector/contract';

import * as model from './model';
import * as page from './page';

contract({ model, page });

export { UserPage } from './page';
