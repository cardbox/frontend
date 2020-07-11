import { paths } from './paths';

import { HomePage } from './home';
import { Error404Page } from './error404';

export const ROUTES = [
  {
    path: paths.home(),
    exact: true,
    component: HomePage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
