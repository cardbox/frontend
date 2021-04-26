/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ROUTES } from '@cardbox/pages/routes';
import { Router } from 'react-router';
import { fork, forward, root } from 'effector-root';
import { getStart, routeWithEvent } from '@cardbox/lib/page-routing';
import { history, historyChanged } from '@cardbox/entities/navigation';
import { matchRoutes } from 'react-router-config';

import { Application } from './application';
import { historyInit } from '../entities/navigation';

const routesMatched = historyChanged.map((change) => ({
  routes: matchRoutes(ROUTES, change.pathname),
  query: Object.fromEntries(new URLSearchParams(change.search)),
}));

for (const { component } of ROUTES) {
  const startPageEvent = getStart(component);
  if (!startPageEvent) continue;

  const matchedRoute = routesMatched.filterMap(({ routes, query }) => {
    const route = routes.find(routeWithEvent(startPageEvent));
    if (route) return { route, query };
    return undefined;
  });

  forward({
    from: matchedRoute,
    to: startPageEvent.prepend(({ route, query }) => ({
      params: route.match.params,
      query,
    })),
  });
}

const scope = fork(root, { values: INITIAL_STATE });

historyInit(scope);

ReactDOM.hydrate(
  <HelmetProvider>
    <Router history={history!}>
      <Application root={scope} />
    </Router>
  </HelmetProvider>,
  document.querySelector('#root'),
);

if (module.hot) {
  module.hot.accept();
}
