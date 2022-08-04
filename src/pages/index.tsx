import { Route } from 'atomic-router-react';
import React from 'react';

import { routes } from '@box/shared/routes';

import { CardCreatePage } from './card/create';
import { CardEditPage } from './card/edit';
import { CardViewPage } from './card/view';
import { CommentsPage } from './comments';
import { Error404Page } from './error404';
import { HomePage } from './home';
import { OAuthDonePage } from './oauth-done';
import { SearchPage } from './search';
import { UserPage } from './user';

export function Pages() {
  return (
    <>
      <Route route={routes.accesso.done} view={OAuthDonePage} />
      <Route route={routes.card.create} view={CardCreatePage} />
      <Route route={routes.card.edit} view={CardEditPage} />
      <Route route={routes.card.view} view={CardViewPage} />
      <Route route={routes.errors.notFound} view={Error404Page} />
      <Route route={routes.home} view={HomePage} />
      <Route route={routes.search.results} view={SearchPage} />
      <Route route={routes.test.comments} view={CommentsPage} />
      <Route route={routes.user.view} view={UserPage} />
    </>
  );
}

export const routesMap = [
  { path: '/accesso/done', route: routes.accesso.done },
  { path: '/card/new', route: routes.card.create },
  { path: '/card/:cardId/edit', route: routes.card.edit },
  { path: '/card/:cardId', route: routes.card.view },
  { path: '/', route: routes.home },
  { path: '/search', route: routes.search.results },
  { path: '/test/comments', route: routes.test.comments },
  { path: '/u/:username', route: routes.user.view },
];

export const notFoundRoute = routes.errors.notFound;
