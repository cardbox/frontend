import { CardPage } from './card';
import { CommentsPage } from './comments';
import { Error404Page } from './error404';
import { HomePage } from './home';
import { UserPage } from './user';
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
    path: paths.card(),
    exact: true,
    component: CardPage,
  },
  {
    path: paths.user(),
    exact: true,
    component: UserPage,
  },
  {
    path: '*',
    component: Error404Page,
  },
];
