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
  sample,
} from 'effector';
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

routeResolved.compositeName.fullName = `routeResolved`;
routeNotResolved.compositeName.fullName = `routeNotResolved`;

debug(
  routeResolved,
  routeNotResolved,
  ready,
  historyEmitCurrent,
  historyChanged,
);

const $currentRoute = createStore('');
const $currentPage = createStore('');

debug($currentPage, $currentRoute);

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

  notMatched.compositeName.fullName = `(${path})notMatched`;
  routeMatched.compositeName.fullName = `(${path})routeMatched`;

  debug(routeMatched, notMatched);

  // TODO: rewrite after effector v22 to support chunk loading

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

  const $onCurrentPage = createStore(false, set('$onCurrentPage'));

  debug($onCurrentPage);

  const shouldExit = guard({
    source: sample({
      source: [$currentRoute, $onCurrentPage],
      clock: notMatched,
      fn: ([route, onPage], hatch) => (
        console.log({ route, hatch, onPage }), { route, hatch, onPage }
      ),
    }),
    filter: ({ route, onPage }) => onPage && route !== path,
  });

  shouldExit.compositeName.fullName = set('shouldExit').name;

  debug(shouldExit);

  sample({
    clock: shouldExit,
    fn: () => {},
    target: hatchExit,
  });

  const shouldUpdate = guard({
    source: sample({
      source: [$currentRoute, $onCurrentPage],
      clock: routeMatched,
      fn: ([route, onPage], hatch) => ({ route, hatch, onPage }),
    }),
    filter: ({ onPage, route }) => !onPage && route === path,
  });

  sample({
    clock: shouldUpdate,
    fn: ({ hatch }) => hatch,
    target: hatchUpdate,
  });

  const shouldEnter = guard({
    source: sample({
      source: [$currentRoute, $onCurrentPage],
      clock: routeMatched,
      fn: ([route, onPage], hatch) => ({ route, hatch, onPage }),
    }),
    filter: ({ onPage, route }) => !onPage && route !== path,
  });

  $onCurrentPage.on(shouldEnter, () => true).on(shouldExit, () => false);

  sample({
    clock: shouldEnter,
    fn: () => path,
    target: $currentRoute,
  });

  sample({
    clock: shouldEnter,
    fn: ({ hatch }) => hatch,
    target: hatchEnter,
  });

  shouldExit.watch(() => console.log(`[event] (${path})shouldExit`));
  shouldEnter.watch(() => console.log(`[event] (${path})shouldEnter`));
  shouldUpdate.watch(() => console.log(`[event] (${path})shouldUpdate`));

  // Shows that user visited route and wait for page
  // If true, page.hatch.enter is triggered and logic is ran
  // const $onPage = createStore(false, set('$onPage'))
  //   .on(hatchEnter, () => true)
  //   .on(hatchExit, () => false);
  //
  // debug(routeMatched, notMatched, hatchEnter, hatchExit, hatchUpdate, $onPage);
  //
  // guard({
  //   source: routeMatched,
  //   filter: $onPage,
  //   target: hatchUpdate,
  // });
  //
  // guard({
  //   source: sample({
  //     source: [$currentRoute, $onPage],
  //     clock: routeMatched,
  //     fn: ([route, onPage], hatch) => ({ route, onPage, hatch }),
  //   }),
  //   filter: ({ route, onPage }) => route === path && !onPage,
  //   target: hatchEnter.prepend(({ hatch }: { hatch: HatchParams }) => hatch),
  // });
  //
  // guard({
  //   source: notMatched,
  //   filter: $onPage,
  //   target: hatchExit,
  // });
}

const scope = fork({ values: INITIAL_STATE });

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
