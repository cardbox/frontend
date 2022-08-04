import { createHistoryRouter } from 'atomic-router';
import { RouterProvider } from 'atomic-router-react';
import { allSettled, createEvent, fork, sample } from 'effector';
import { Provider } from 'effector-react/scope';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import { notFoundRoute, routesMap } from '@box/pages';

import { createClientHistory } from '@box/entities/navigation';

import { Application } from './application';

const ready = createEvent();

const router = createHistoryRouter({
  routes: routesMap,
  notFoundRoute,
});

const history = createClientHistory();

sample({
  clock: ready,
  fn: () => history,
  target: router.setHistory,
});

const scope = fork({ values: INITIAL_STATE });

const root = createRoot(document.querySelector('#root')!);

allSettled(ready, { scope }).then(() =>
  root.render(
    <HelmetProvider>
      {/* @ts-ignore */}
      <RouterProvider router={router}>
        <Provider value={scope}>
          <Application />
        </Provider>
      </RouterProvider>
    </HelmetProvider>,
  ),
);

if (module.hot) {
  module.hot.accept();
}
