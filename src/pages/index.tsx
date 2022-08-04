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
      <Route route={routes.test.comments} view={CommentsPage} />
      <Route route={routes.card.edit} view={CardEditPage} />
      <Route route={routes.card.view} view={CardViewPage} />
      <Route route={routes.home} view={HomePage} />
      <Route route={routes.search.results} view={SearchPage} />
      <Route route={routes.user.view} view={UserPage} />
      <Route route={routes.errors.notFound} view={Error404Page} />
    </>
  );
}
