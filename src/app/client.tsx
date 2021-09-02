/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { createInspector } from 'effector-inspector';
import React from 'react';
import ReactDOM from 'react-dom';
import { HatchParams, getHatch } from 'framework';
import { HelmetProvider } from 'react-helmet-async';
import { ROUTES } from '@box/pages/routes';
import { Router } from 'react-router';
import {
  allSettled,
  combine,
  createEvent,
  createStore,
  fork,
  forward,
  guard,
  root,
} from 'effector-root';
import { debug } from 'patronum';
import {
  history,
  historyChanged,
  historyEmitCurrent,
} from '@box/entities/navigation';
import { matchRoutes } from 'react-router-config';
import { splitMap } from 'patronum/split-map';

import { Application } from './application';

// import { runMockServer } from '../api/mock';

// import { LOGGER_DOMAIN_NAME } from 'effector-logger/attach';
// createInspector({ trimDomain: LOGGER_DOMAIN_NAME });

/**
 * Run mock-api server for frontend
 * @see https://miragejs.com/quickstarts/react/develop-an-app/
 * @see https://miragejs.com/quickstarts/nextjs/develop-an-app/
 */
// runMockServer();

const ready = createEvent();

forward({ from: ready, to: historyEmitCurrent });

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

debug(routeResolved);

for (const { component, path } of ROUTES) {
  const hatch = getHatch(component);

  const { routeMatched, __: notMatched } = splitMap({
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

  // TODO: rewrite after effector v22 to support chunk loading

  const hatchEnter = createEvent<HatchParams>({ name: `hatchEnter:${path}` });
  const hatchUpdate = createEvent<HatchParams>({ name: `hatchUpdate:${path}` });
  const hatchExit = createEvent<void>({ name: `hatchExit:${path}` });

  if (hatch) {
    forward({ from: hatchEnter, to: hatch.enter });
    forward({ from: hatchUpdate, to: hatch.update });
    forward({ from: hatchExit, to: hatch.exit });
  }

  // Shows that user is on the route
  const $onRoute = createStore(false, { name: `$onRoute:${path}` })
    .on(routeMatched, () => true)
    .on(notMatched, () => false);

  // Shows that user visited route and wait for page
  // If true, page.hatch.enter is triggered and logic is ran
  const $onPage = createStore(false, { name: `$onPage:${path}` })
    .on(hatchEnter, () => true)
    .on(hatchExit, () => false);

  debug(routeMatched, hatchEnter, hatchExit, hatchUpdate, $onRoute, $onPage);

  guard({
    source: routeMatched,
    filter: $onPage,
    target: hatchUpdate,
  });

  guard({
    source: routeMatched,
    filter: combine($onRoute, $onPage, (route, page) => route && !page),
    target: hatchEnter,
  });

  guard({
    source: notMatched,
    filter: $onPage,
    target: hatchExit,
  });
}

const scope = fork(root, { values: INITIAL_STATE });

allSettled(ready, { scope }).then(() => {
  ReactDOM.hydrate(
    <HelmetProvider>
      <Router history={history!}>
        <Application root={scope} />
      </Router>
    </HelmetProvider>,
    document.querySelector('#root'),
  );
});

if (module.hot) {
  module.hot.accept();
}
