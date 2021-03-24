import { contract } from '@cardbox/lib/contract';

import * as model from './model';
import * as page from './page';

export { CardPage } from './page';

contract({ page, model });
