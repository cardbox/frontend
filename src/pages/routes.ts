import { CardCreatePage } from './card/create';
import { CardEditPage } from './card/edit';
import { CardViewPage } from './card/view';
import { CommentsPage } from './comments';
import { Error404Page } from './error404';
import { HomePage } from './home';
import { OAuthDonePage } from './oauth-done';
import { SearchPage } from './search';
import { UserPage } from './user';
import { paths } from './paths';

export const ROUTES = [
  { exact: true, path: paths.home(), component: HomePage },
  { exact: true, path: paths.comments(), component: CommentsPage },
  { exact: true, path: paths.cardCreate(), component: CardCreatePage },
  { exact: true, path: paths.cardView(), component: CardViewPage },
  { exact: true, path: paths.cardEdit(), component: CardEditPage },
  { exact: true, path: paths.oauthDone(), component: OAuthDonePage },
  { exact: true, path: paths.user(), component: UserPage },
  { exact: true, path: paths.search(), component: SearchPage },
  { path: '*', component: Error404Page },
];
