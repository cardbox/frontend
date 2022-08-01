import { withHatch } from 'framework';

import * as model from './model';
import * as page from './page';

export const SearchPage = withHatch(model.hatch, page.SearchPage);
