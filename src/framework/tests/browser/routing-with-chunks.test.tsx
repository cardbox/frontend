import React from 'react';
import { allSettled, fork } from 'effector';

import { $pageName, root } from './fixtures/internal';
import { createBrowserApplication, loadable } from '../../src';

test.skip('triggering hatch loaded from chunk', async () => {
  const routes = [
    {
      path: '/page1',
      exact: true,
      component: loadable(() => import('./fixtures/page1')),
    },
    {
      path: '/page-another',
      exact: true,
      component: loadable(() => import('./fixtures/page-another')),
    },
  ];

  const ready = root.createEvent();

  const application = createBrowserApplication({
    domain: root,
    ready,
    routes,
  });

  const scope = fork(root);
  expect(scope.getState($pageName)).toEqual('(nothing)');

  await allSettled(application!.navigation.historyPush, {
    scope,
    params: '/page1',
  });
  expect(scope.getState($pageName)).toEqual('page1');

  await allSettled(application!.navigation.historyPush, {
    scope,
    params: '/page-another',
  });
  expect(scope.getState($pageName)).toEqual('page-another');
});
