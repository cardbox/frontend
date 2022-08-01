import { allSettled, createEvent, createStore, fork, forward, guard, sample } from 'effector';
import { Provider } from 'effector-react/scope';
import { getHatch, HatchParams } from 'framework';
import { splitMap } from 'patronum/split-map';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Router } from 'react-router';
import { matchRoutes } from 'react-router-config';

import { ROUTES } from '@box/pages/routes';

import { history, historyChanged, initializeClientHistory } from '@box/entities/navigation';

import { Application } from './application';

// import { runMockServer } from '../shared/api/mock';

/**
 * Run mock-api server for frontend
 * @see https://miragejs.com/quickstarts/react/develop-an-app/
 * @see https://miragejs.com/quickstarts/nextjs/develop-an-app/
 */
// runMockServer();

const ready = createEvent();

const { routeResolved, __: routeNotResolved } = splitMap({
  source: historyChanged,
  cases: {
    routeResolved(change) {
      const routes = matchRoutes(ROUTES, change.pathname);

      if (routes.length > 0)
        return {
          route: routes[0].route,
          match: routes[0].match,
          change,
        };

      return undefined;
    },
  },
});

function extractCurrentRoutePath() {
  const routes = matchRoutes(ROUTES, history?.location.pathname ?? '/');

  if (routes.length > 0) {
    return routes[0].route.path;
  }
  return '/';
}

const $currentRoute = createStore(extractCurrentRoutePath());

for (const { component, path } of ROUTES) {
  const hatch = getHatch(component);

  const { routeMatched, __: routeNotMatched } = splitMap({
    source: routeResolved,
    cases: {
      routeMatched({ route, match, change }) {
        if (route.path === path)
          return {
            // route.path is a string with path params, like "/user/:userId"
            // :userId is a path param
            // match.params is an object contains parsed params values
            // "/user/123" will be transformed to { userId: 123 } in match.params
            params: match.params,
            query: Object.fromEntries(new URLSearchParams(change.search)),
          } as HatchParams;

        return undefined;
      },
    },
  });

  // TODO: add support for chunk loading

  const set = (name: string) => ({
    name: `(${path})${name}`,
    sid: `(${path})${name}`,
  });

  const hatchEnter = createEvent<HatchParams>(set('hatchEnter'));
  const hatchUpdate = createEvent<HatchParams>(set('hatchUpdate'));
  const hatchExit = createEvent<void>(set('hatchExit'));

  if (hatch) {
    forward({ from: hatchEnter, to: hatch.enter });
    forward({ from: hatchUpdate, to: hatch.update });
    forward({ from: hatchExit, to: hatch.exit });
  }

  const $onCurrentPage = $currentRoute.map((route) => route === path);

  guard({
    source: $currentRoute,
    clock: routeNotMatched,
    filter: (currentRoute, { route: { path: newRoute } }) => {
      const pageRoute = path;

      const isANewRouteDifferent = currentRoute !== newRoute;
      const isCurrentRouteOfCurrentPage = currentRoute === pageRoute;

      return isCurrentRouteOfCurrentPage && isANewRouteDifferent;
    },
    target: hatchExit,
  });

  guard({
    clock: routeMatched,
    filter: $onCurrentPage,
    target: hatchUpdate,
  });

  const shouldEnter = guard({
    clock: routeMatched,
    filter: $onCurrentPage.map((on) => !on),
  });

  sample({ clock: shouldEnter, target: hatchEnter });

  sample({
    clock: shouldEnter,
    fn: () => path,
    target: $currentRoute,
  });
}

const scope = fork({ values: INITIAL_STATE });

initializeClientHistory(scope);

allSettled(ready, { scope }).then(() => {
  ReactDOM.hydrate(
    <HelmetProvider>
      <Router history={history!}>
        <Provider value={scope}>
          <Application />
        </Provider>
      </Router>
    </HelmetProvider>,
    document.querySelector('#root'),
  );
});

if (module.hot) {
  module.hot.accept();
}

// FIXME: later will be fixed by local-auth (BOX-205)
// Uncomment for passing auth token
// document.cookie = `session-token=${
//   process.env.RAZZLE_SESSION_TOKEN || ''
// }; Path=/;`;
