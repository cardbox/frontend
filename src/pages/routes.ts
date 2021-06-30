import { CardPage } from './card';
import { CommentsPage } from './comments';
import { Error404Page } from './error404';
import { HomePage } from './home';
import { SearchPage } from './search';
import { UserPage } from './user';
import { paths } from './paths';

export const ROUTES = [
  { exact: true, path: paths.home(), component: HomePage },
  { exact: true, path: paths.comments(), component: CommentsPage },
  { exact: true, path: paths.card(), component: CardPage },
  { exact: true, path: paths.user(), component: UserPage },
  { exact: true, path: paths.search(), component: SearchPage },
  { path: '*', component: Error404Page },
];
