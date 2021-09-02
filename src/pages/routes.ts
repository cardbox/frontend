import { CardViewPage } from './card/view';
import { HomePage } from './home';
import { paths } from './paths';

export const ROUTES = [
  { exact: true, path: paths.home(), component: HomePage },
  { exact: true, path: paths.cardView(), component: CardViewPage },
];
