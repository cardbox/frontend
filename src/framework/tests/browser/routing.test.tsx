import React from 'react';
import { Effect, Event, Store, createEvent } from 'effector';

import { createBrowserApplication, createHatch, withHatch } from '../../src';

test('check triggering hatch without binding to domain', () => {
  const homePageHatch = createHatch();
  const HomePage = withHatch(homePageHatch, () => <div>Home page</div>);

  const notFoundPageHatch = createHatch();
  const NotFoundPage = withHatch(notFoundPageHatch, () => (
    <span>Not found</span>
  ));
  const routes = [
    {
      path: '/',
      exact: true,
      component: HomePage,
    },
    {
      path: '*',
      component: NotFoundPage,
    },
  ];

  const ready = createEvent();

  const app = createBrowserApplication({
    ready,
    routes,
  });

  const homePageEnter = watch(homePageHatch.enter);
  const notFoundPageEnter = watch(notFoundPageHatch.enter);

  expect(app).not.toBeUndefined();
  expect(homePageEnter).not.toBeCalled();
  expect(notFoundPageEnter).not.toBeCalled();

  ready();
  expect(homePageEnter).toBeCalled();
  expect(notFoundPageEnter).not.toBeCalled();

  homePageEnter.mockClear();
  notFoundPageEnter.mockClear();
  app!.navigation.historyPush('/random/address');

  expect(homePageEnter).not.toBeCalled();
  expect(notFoundPageEnter).toBeCalledWith({
    params: { '0': '/random/address' },
    query: {},
  }); // TODO: change structure of * matcher
});

/** Triggers fn on effect start */
function watch<T>(unit: Event<T> | Store<T> | Effect<T, any, any>) {
  const fn = jest.fn();
  unit.watch(fn);
  return fn;
}
