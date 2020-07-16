import { CommentsPage } from './comments';
import { Error404Page } from './error404';
import { HomePage } from './home';
import { paths } from './paths';

export const ROUTES = [
  {
    path: paths.home(),
    exact: true,
    component: HomePage,
  },
  {
    path: paths.comments(),
    exact: true,
    component: CommentsPage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
